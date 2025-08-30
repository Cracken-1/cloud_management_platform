import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedSuperadmin } from '@/lib/auth/superadmin-access';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const from = requestUrl.searchParams.get('from');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('OAuth error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
      }

      if (data.user) {
        const email = data.user.email!;
        
        // Check if user profile exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          // Create user profile
          const role = isAuthorizedSuperadmin(email) ? 'SUPERADMIN' : 'ADMIN';
          
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: email,
              first_name: data.user.user_metadata?.full_name?.split(' ')[0] || '',
              last_name: data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
              role: role,
              is_active: true,
              is_verified: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        // Redirect based on role and source
        if (from === 'superadmin' && isAuthorizedSuperadmin(email)) {
          return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
        } else if (isAuthorizedSuperadmin(email)) {
          return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
    } catch (error) {
      console.error('Callback error:', error);
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=callback_failed', request.url));
}