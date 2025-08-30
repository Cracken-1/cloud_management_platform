# OAuth and Email Setup Guide

## Google OAuth Consent Screen Configuration

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the Google+ API and Gmail API

### 2. OAuth Consent Screen Configuration
Navigate to "APIs & Services" > "OAuth consent screen"

#### App Information:
- **App name:** InfinityStack Platform
- **User support email:** admin@infinitystack.com
- **App logo:** Upload your company logo (120x120px PNG/JPG)

#### App Domain:
- **Application home page:** https://cloud-management-platform.vercel.app
- **Application privacy policy:** https://cloud-management-platform.vercel.app/privacy
- **Application terms of service:** https://cloud-management-platform.vercel.app/terms

#### Authorized Domains:
```
infinitystack.com
cloud-management-platform.vercel.app
vercel.app
localhost (for development)
```

#### Scopes:
- `../auth/userinfo.email`
- `../auth/userinfo.profile` 
- `openid`

#### Developer Contact:
- **Email:** admin@infinitystack.com

### 3. OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Create OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://cloud-management-platform.vercel.app/auth/callback
   https://cloud-management-platform.vercel.app/auth/google/callback
   ```

## Free Email Setup Options

### Option 1: Zoho Mail (Recommended)
1. Go to [Zoho Mail](https://www.zoho.com/mail/)
2. Sign up for free plan
3. Add custom domain: infinitystack.com
4. Create admin@infinitystack.com
5. Verify domain ownership

### Option 2: Cloudflare Email Routing
1. Add infinitystack.com to Cloudflare
2. Go to Email > Email Routing
3. Create route: admin@infinitystack.com → your-personal@gmail.com
4. Verify MX records

### Option 3: Gmail Workspace (14-day trial)
1. Go to [Google Workspace](https://workspace.google.com/)
2. Start free trial
3. Add infinitystack.com domain
4. Create admin@infinitystack.com

## Testing the Setup

### Test Email Addresses:
- admin@infinitystack.com
- superadmin@infinitystack.com
- ceo@infinitystack.com
- founder@infinitystack.com

### Verification Steps:
1. Test Google OAuth login with the created email
2. Verify domain restriction works
3. Check that non-@infinitystack.com emails are rejected
4. Confirm superadmin access works

## Environment Variables
Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```