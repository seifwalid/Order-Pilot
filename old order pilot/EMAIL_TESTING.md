# Email Testing Guide for OrderPilot

## Resend Testing Limitations

Resend's free tier only allows sending emails to:
- Your verified account email (mkhalil@genscout.io)
- Verified domain emails
- Added test email addresses

## Workaround Options

### Option 1: Development Mode (Recommended for Testing)

Add this line to your `.env.local` file:
```
MOCK_EMAILS=true
```

**Benefits:**
- Test with ANY email address
- No actual emails sent
- Invitation URLs logged to console
- Copy URLs directly from terminal

**How to use:**
1. Add `MOCK_EMAILS=true` to `.env.local`
2. Restart your dev server
3. Invite any email address
4. Copy the invitation URL from the terminal
5. Open URL in browser to test

### Option 2: Add Test Emails to Resend

1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Navigate to **Settings** → **Test Mode**
3. Add email addresses you want to test
4. Verify each email through confirmation

### Option 3: Use Your Own Domain

1. **Add Domain to Resend:**
   - Go to Resend Dashboard → Domains
   - Add your domain (e.g., `yourdomain.com`)
   
2. **Configure DNS Records:**
   - Add SPF record: `v=spf1 include:_spf.resend.com ~all`
   - Add DKIM record (provided by Resend)
   - Add DMARC record: `v=DMARC1; p=none;`

3. **Update Email From Address:**
   - Change from `onboarding@resend.dev`
   - To `noreply@yourdomain.com`

### Option 4: Upgrade Resend Plan

- **Pro Plan**: $20/month for 50k emails
- **Removes all testing restrictions**
- **Send to any email address**

## Current Development Setup

The system automatically:
- ✅ Detects development mode
- ✅ Shows warnings for non-verified emails
- ✅ Falls back to console logging when needed
- ✅ Provides copy-paste invitation URLs

## Testing Flow

1. **Invite staff member** with any email
2. **Check terminal** for invitation URL
3. **Copy URL** from console output
4. **Open in browser** to test onboarding
5. **Complete onboarding** with any Google/email account

## Production Setup

For production, you'll want to:
1. Add your domain to Resend
2. Set up proper DNS records  
3. Use your domain for sending emails
4. Remove `MOCK_EMAILS=true` from environment
