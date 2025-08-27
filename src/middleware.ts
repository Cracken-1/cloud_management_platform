import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware during build time if environment variables are not available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return NextResponse.next();
  }

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/api/auth/callback'
  ];

  // API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth/callback',
    '/api/registration/submit'
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));

  // If it's a public route, allow access
  if (isPublicRoute || isPublicApiRoute) {
    return res;
  }

  // If no session and trying to access protected route, redirect to login
  if (!session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Get user profile to check role and verification status
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_active, is_verified, tenant_id')
    .eq('id', session.user.id)
    .single();

  // If no profile found, redirect to login
  if (!profile) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('error', 'profile_not_found');
    return NextResponse.redirect(redirectUrl);
  }

  // If user is not active, redirect to login with error
  if (!profile.is_active) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('error', 'account_deactivated');
    return NextResponse.redirect(redirectUrl);
  }

  // If user is not verified, redirect to login with error
  if (!profile.is_verified) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('error', 'account_not_verified');
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based route protection
  const adminRoutes = ['/admin'];
  const superadminRoutes = ['/admin/superadmin', '/admin/system', '/admin/tenants'];

  // Check if trying to access admin routes
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isSuperadminRoute = superadminRoutes.some(route => pathname.startsWith(route));

  if (isSuperadminRoute && profile.role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (isAdminRoute && !['SUPERADMIN', 'ADMIN', 'STORE_MANAGER', 'CUSTOMER_SERVICE', 'INVENTORY_MANAGER', 'ANALYTICS_VIEWER', 'FRANCHISE_MANAGER'].includes(profile.role)) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Add user info to headers for use in components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', session.user.id);
  requestHeaders.set('x-user-role', profile.role);
  requestHeaders.set('x-user-tenant', profile.tenant_id || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};