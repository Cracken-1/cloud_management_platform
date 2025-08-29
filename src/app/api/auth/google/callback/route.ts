import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  if (!code) {
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  // Proxy the request to Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const redirectUrl = new URL(`${supabaseUrl}/auth/v1/callback`);
  
  // Forward all query parameters
  url.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(redirectUrl.toString());
}