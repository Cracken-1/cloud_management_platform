# Supabase Configuration for Vercel Deployment

## Site URL Configuration
In your Supabase dashboard:

1. Go to Authentication > URL Configuration
2. Set **Site URL** to: `https://cloud-management-platform.vercel.app`

## Redirect URLs
Add these redirect URLs in Supabase:
```
http://localhost:3000/**
https://cloud-management-platform.vercel.app/**
https://cloud-management-platform.vercel.app/auth/callback
```

## Google OAuth Provider Setup
1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)

## Environment Variables for Vercel
Make sure these are set in your Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing Checklist
- [ ] Site URL matches your Vercel domain
- [ ] Redirect URLs include your Vercel domain
- [ ] Google OAuth provider is enabled
- [ ] Environment variables are set in Vercel
- [ ] Domain restrictions work (@infinitystack.com only)