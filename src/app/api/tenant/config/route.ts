import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { tenantService } from '@/lib/tenant/tenant-service';

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's tenant ID
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('tenant_id')
      .eq('id', session.user.id)
      .single();

    if (profileError || !userProfile?.tenant_id) {
      return NextResponse.json({ error: 'No tenant associated with user' }, { status: 404 });
    }

    const config = await tenantService.getTenantConfiguration(userProfile.tenant_id);
    
    if (!config) {
      return NextResponse.json({ error: 'Tenant configuration not found' }, { status: 404 });
    }

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Failed to fetch tenant config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
