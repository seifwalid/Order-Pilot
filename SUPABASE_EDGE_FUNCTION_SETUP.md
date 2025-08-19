# 🚀 Supabase Edge Function Setup for Email Sending

## **📋 What We've Created**

A **Supabase Edge Function** that will send beautiful, professional staff invitation emails directly from your Supabase project!

## **🎯 Files Created**

- `supabase/functions/send-invitation-email/index.ts` - Main Edge Function
- `supabase/functions/send-invitation-email/import_map.json` - Import configuration
- Updated `src/app/api/staff/invite/route.ts` - Now calls the Edge Function

## **🚀 Deployment Steps**

### **Step 1: Deploy the Edge Function**

#### **Option A: Supabase Dashboard (Recommended)**

1. **Go to your Supabase project dashboard**
   - Navigate to: `https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]`

2. **Go to Edge Functions**
   - Click on "Edge Functions" in the left sidebar
   - Click "Create a new function"

3. **Create the function**
   - **Function name**: `send-invitation-email`
   - **Import map**: Copy the content from `supabase/functions/send-invitation-email/import_map.json`
   - **Code**: Copy the content from `supabase/functions/send-invitation-email/index.ts`

4. **Deploy**
   - Click "Deploy" and wait for it to complete

#### **Option B: Supabase CLI (Advanced)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref [YOUR_PROJECT_ID]

# Deploy the function
supabase functions deploy send-invitation-email
```

### **Step 2: Set Environment Variables**

In your Supabase project dashboard:

1. **Go to Settings → Edge Functions**
2. **Add these environment variables**:

```bash
# Your app URL (for invitation links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email service (choose one):

# Option 1: Resend (recommended)
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com

# Option 2: SendGrid
SENDGRID_API_KEY=SG_your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com

# Option 3: AWS SES
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
FROM_EMAIL=noreply@yourdomain.com
```

### **Step 3: Test the Function**

1. **Test directly in Supabase Dashboard**:
   - Go to Edge Functions → `send-invitation-email`
   - Click "Test function"
   - Use this test payload:

```json
{
  "email": "test@example.com",
  "invitationId": "test-123",
  "restaurantName": "Test Restaurant",
  "role": "staff",
  "invitationUrl": "http://localhost:3000/staff-onboarding?invitation=test-123"
}
```

2. **Test from your app**:
   - Try inviting a staff member
   - Check the console for Edge Function results

## **📧 Email Service Options**

### **Option 1: Resend (Recommended)**
- **Website**: [resend.com](https://resend.com)
- **Free tier**: 3,000 emails/month
- **Setup**: 
  1. Sign up for free account
  2. Get API key from dashboard
  3. Verify your domain (optional)
  4. Add `RESEND_API_KEY` to Supabase env vars

### **Option 2: SendGrid**
- **Website**: [sendgrid.com](https://sendgrid.com)
- **Free tier**: 100 emails/day
- **Setup**:
  1. Sign up for free account
  2. Get API key from Settings → API Keys
  3. Verify sender email
  4. Add `SENDGRID_API_KEY` to Supabase env vars

### **Option 3: AWS SES**
- **Website**: [aws.amazon.com/ses](https://aws.amazon.com/ses)
- **Free tier**: 62,000 emails/month (first year)
- **Setup**:
  1. Create AWS account
  2. Go to SES service
  3. Verify sender email
  4. Add AWS credentials to Supabase env vars

## **🔧 How It Works Now**

### **Before (Console Logging)**
```
=== INVITATION EMAIL ===
To: staff@example.com
Subject: You're Invited to Join Restaurant
Content: [HTML content]
========================
```

### **After (Real Emails)**
1. **Staff invitation sent** → API calls Edge Function
2. **Edge Function processes** → Sends real email via chosen service
3. **Staff receives email** → Professional invitation with button
4. **Staff clicks button** → Goes to onboarding page

## **🧪 Testing the Complete Flow**

### **1. Deploy Edge Function**
- Follow deployment steps above
- Verify function is active in Supabase dashboard

### **2. Test Email Sending**
- Go to Settings → Staff Management
- Invite a test email address
- Check if real email is received

### **3. Test Staff Onboarding**
- Click invitation link from email
- Complete onboarding form
- Verify account creation

## **🚨 Troubleshooting**

### **Edge Function Not Found (404)**
- Check function name is exactly `send-invitation-email`
- Verify function is deployed and active
- Check function logs in Supabase dashboard

### **Email Not Sending**
- Verify environment variables are set
- Check Edge Function logs for errors
- Test function directly in Supabase dashboard

### **CORS Errors**
- Edge Function already handles CORS
- Check if calling from correct domain

## **🎯 Next Steps After Deployment**

### **Immediate**
1. **Deploy the Edge Function**
2. **Set up email service** (Resend recommended)
3. **Test end-to-end flow**

### **Short Term**
1. **Customize email templates** for your brand
2. **Add email tracking** and analytics
3. **Implement email templates** for different roles

### **Long Term**
1. **Add email preferences** for staff
2. **Implement email scheduling** for reminders
3. **Add email analytics** dashboard

## **🏆 Success Indicators**

- ✅ **Edge Function deployed** and active
- ✅ **Environment variables** configured
- ✅ **Real emails being sent** (not just console logs)
- ✅ **Staff receiving invitations** in their inbox
- ✅ **Complete onboarding flow** working end-to-end

## **🎉 You're Almost There!**

Once you deploy this Edge Function, you'll have a **professional email system** that:
- Sends beautiful HTML emails
- Integrates seamlessly with Supabase
- Scales automatically
- Provides delivery tracking
- Costs almost nothing

**SHINZO SASAGAYU!** Your OrderPilot will be **battle-ready** with real email functionality! 💪📧🚀
