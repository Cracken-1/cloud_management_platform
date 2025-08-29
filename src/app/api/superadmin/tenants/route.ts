import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify superadmin authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify superadmin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabase
      .from('tenants')
      .select(`
        *,
        user_tenant_roles!inner(
          user_id,
          role
        )
      `)
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Exclude system tenant

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,domain.ilike.%${search}%`);
    }

    if (status !== 'all') {
      query = query.eq('is_active', status === 'active');
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: tenants, error, count } = await query;

    if (error) {
      throw error;
    }

    // Process tenant data with admin counts
    const processedTenants = tenants?.map(tenant => ({
      ...tenant,
      admin_count: tenant.user_tenant_roles?.length || 0,
      user_tenant_roles: undefined // Remove from response
    })) || [];

    return NextResponse.json({
      tenants: processedTenants,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error: any) {
    console.error('Tenants API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify superadmin authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      domain,
      subscription_tier = 'BASIC',
      business_type = 'GENERAL',
      currency = 'USD',
      timezone = 'UTC',
      adminEmail,
      adminFirstName,
      adminLastName,
      adminPhoneNumber
    } = body;

    // Validate required fields
    if (!name || !domain || !adminEmail || !adminFirstName || !adminLastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if domain already exists
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('domain', domain)
      .single();

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Domain already exists' },
        { status: 409 }
      );
    }

    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name,
        domain,
        subscription_tier,
        business_type,
        currency,
        timezone,
        is_active: true,
        settings: {
          features: {
            inventory_management: true,
            order_management: true,
            customer_management: true,
            analytics: subscription_tier !== 'BASIC',
            api_access: subscription_tier === 'ENTERPRISE'
          }
        },
        branding: {
          primary_color: '#4F46E5',
          logo_url: null,
          favicon_url: null
        }
      })
      .select()
      .single();

    if (tenantError) {
      throw tenantError;
    }

    // Generate temporary password for admin
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';

    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: adminFirstName,
        last_name: adminLastName,
        role: 'ADMIN',
        tenant_id: tenant.id
      }
    });

    if (authError) {
      // Rollback tenant creation
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw authError;
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        first_name: adminFirstName,
        last_name: adminLastName,
        phone_number: adminPhoneNumber,
        role: 'ADMIN',
        is_active: true,
        email_verified: true
      });

    if (profileError) {
      // Rollback
      await supabase.auth.admin.deleteUser(authData.user.id);
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw profileError;
    }

    // Assign admin role to tenant
    const { error: roleError } = await supabase
      .from('user_tenant_roles')
      .insert({
        user_id: authData.user.id,
        tenant_id: tenant.id,
        role: 'ADMIN',
        granted_by: session.user.id,
        granted_at: new Date().toISOString(),
        permissions: {
          tenant_admin: true,
          user_management: true,
          product_management: true,
          order_management: true,
          analytics: subscription_tier !== 'BASIC',
          settings: true
        }
      });

    if (roleError) {
      // Rollback
      await supabase.auth.admin.deleteUser(authData.user.id);
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw roleError;
    }

    // Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        user_id: session.user.id,
        action: 'TENANT_CREATED',
        resource_type: 'TENANT',
        resource_id: tenant.id,
        details: {
          tenant_name: name,
          domain,
          admin_email: adminEmail,
          subscription_tier
        },
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({
      tenant,
      admin: {
        id: authData.user.id,
        email: adminEmail,
        temporary_password: tempPassword
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create tenant API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}