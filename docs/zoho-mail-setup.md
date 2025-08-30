# Zoho Mail Setup for InfinityStack Platform

## Step-by-Step Zoho Mail Configuration

### 1. Sign Up for Zoho Mail
1. Go to [Zoho Mail](https://www.zoho.com/mail/)
2. Click "Get Started Free"
3. Choose "For Business" option
4. Enter your details and create a Zoho account

### 2. Add Custom Domain (infinitystack.com)
1. After signup, you'll be prompted to add a domain
2. Enter: `infinitystack.com`
3. Choose "I own this domain"
4. Select the free plan (up to 5 users)

### 3. Domain Verification
Zoho will provide you with verification methods. Choose one:

#### Option A: DNS TXT Record (Recommended)
1. Add this TXT record to your domain DNS:
   ```
   Name: @
   Type: TXT
   Value: zoho-verification=zb12345678.zmverify.zoho.com
   ```
   (Zoho will provide the exact value)

#### Option B: HTML File Upload
1. Download the HTML verification file
2. Upload to your domain root: `infinitystack.com/zohoverify.html`

### 4. Configure MX Records
Add these MX records to your domain DNS:
```
Priority: 10, Value: mx.zoho.com
Priority: 20, Value: mx2.zoho.com
Priority: 50, Value: mx3.zoho.com
```

### 5. Create Email Accounts
Once verified, create these email accounts:
- admin@infinitystack.com
- superadmin@infinitystack.com
- ceo@infinitystack.com
- founder@infinitystack.com

### 6. DNS Configuration for infinitystack.com
If you don't own the domain yet, you have options:

#### Option A: Register infinitystack.com
1. Go to any domain registrar (Namecheap, GoDaddy, etc.)
2. Register infinitystack.com
3. Point DNS to Zoho's servers

#### Option B: Use a Subdomain (Alternative)
If infinitystack.com is taken, use:
- `platform.infinitystack.com`
- `app.infinitystack.com`
- Or register `infinitystack.co`, `infinitystack.io`, etc.

## Quick Alternative: Use Existing Domain

### If you already have a domain:
1. Use your existing domain instead
2. Update the email restrictions in the code
3. Create admin@yourdomain.com

Let me know your domain situation and I'll help you proceed!

## DNS Records Summary
Once you have the domain, add these records:

### MX Records:
```
@ MX 10 mx.zoho.com
@ MX 20 mx2.zoho.com  
@ MX 50 mx3.zoho.com
```

### TXT Record:
```
@ TXT "zoho-verification=zb12345678.zmverify.zoho.com"
```

### SPF Record (Optional but recommended):
```
@ TXT "v=spf1 include:zoho.com ~all"
```

## Testing Your Setup
1. Wait 24-48 hours for DNS propagation
2. Try logging into Zoho Mail with admin@infinitystack.com
3. Send a test email to verify it works
4. Test the OAuth login on your app

## Next Steps After Email Setup
1. Update Google OAuth consent screen with the email
2. Add the email as a test user in Google Cloud Console
3. Test the complete login flow