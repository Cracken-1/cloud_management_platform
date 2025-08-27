import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { tenantService } from '@/lib/tenant/tenant-service';

// Mock company data for demo purposes
const mockCompanies = {
  'freshfoods': {
    name: 'Fresh Foods Restaurant',
    industry: 'restaurant',
    websiteUrl: 'https://freshfoodsrestaurant.com',
    adminEmail: 'admin@freshfoods.com'
  },
  'techmart': {
    name: 'TechMart Electronics',
    industry: 'retail',
    websiteUrl: 'https://techmartstore.com',
    adminEmail: 'admin@techmart.com'
  },
  'swiftlogistics': {
    name: 'Swift Logistics',
    industry: 'logistics',
    websiteUrl: 'https://swiftdelivery.com',
    adminEmail: 'admin@swiftlogistics.com'
  },
  'digitalsolutions': {
    name: 'Digital Solutions Inc',
    industry: 'technology',
    websiteUrl: 'https://digitalsoftware.com',
    adminEmail: 'admin@digitalsolutions.com'
  },
  'pandamart': {
    name: 'PandaMart Kenya',
    industry: 'retail',
    websiteUrl: 'https://pandamart.co.ke',
    adminEmail: 'admin@pandamart.co.ke'
  }
};

export async function POST(request: NextRequest) {
  try {
    const { companyId, email, password } = await request.json();

    // Validate demo credentials
    if (password !== 'demo123') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const mockCompany = mockCompanies[companyId as keyof typeof mockCompanies];
    if (!mockCompany || email !== mockCompany.adminEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if tenant already exists
    const { data: existingTenant } = await supabaseAdmin
      .from('tenants')
      .select('id, name')
      .eq('name', mockCompany.name)
      .single();

    let tenantId: string;

    if (!existingTenant) {
      // Create tenant if it doesn't exist
      const setupResult = await tenantService.setupTenant({
        adminUserId: 'demo-user-' + companyId,
        companyName: mockCompany.name,
        websiteUrl: mockCompany.websiteUrl,
        contactEmail: mockCompany.adminEmail,
        industry: mockCompany.industry
      });

      if (!setupResult.success) {
        return NextResponse.json({ error: 'Failed to setup demo tenant' }, { status: 500 });
      }

      tenantId = setupResult.tenantId!;
    } else {
      tenantId = existingTenant.id;
    }

    // Check if demo user exists
    const { data: existingUser } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!existingUser) {
      // Create demo user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'demo123',
        email_confirm: true,
        user_metadata: {
          full_name: `${mockCompany.name} Admin`,
          role: 'ADMIN'
        }
      });

      if (authError) {
        return NextResponse.json({ error: 'Failed to create demo user' }, { status: 500 });
      }

      // Create user profile
      await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authUser.user.id,
          email,
          full_name: `${mockCompany.name} Admin`,
          role: 'ADMIN',
          tenant_id: tenantId,
          is_active: true,
          is_verified: true
        });
    } else {
      // Update existing user with tenant
      await supabaseAdmin
        .from('user_profiles')
        .update({ tenant_id: tenantId })
        .eq('email', email);
    }

    // Sign in the user
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
      }
    });

    if (signInError) {
      return NextResponse.json({ error: 'Failed to generate login link' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      loginUrl: signInData.properties.action_link,
      tenantId,
      companyName: mockCompany.name
    });

  } catch (error) {
    console.error('Mock login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
