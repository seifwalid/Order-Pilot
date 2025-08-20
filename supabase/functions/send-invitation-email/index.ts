import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface InvitationData {
  email: string;
  invitationId: string;
  restaurantName: string;
  role: string;
  invitationUrl: string;
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Get the invitation data from the request
    const invitationData: InvitationData = await req.json();
    
    if (!invitationData.email || !invitationData.invitationId || !invitationData.restaurantName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Generate the invitation URL
    const baseUrl = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000';
    const invitationUrl = `${baseUrl}/staff-onboarding?invitation=${invitationData.invitationId}`;

    // Create the email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Staff Invitation - ${invitationData.restaurantName}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 10px; }
          .button { 
            display: inline-block; 
            background-color: #4f46e5; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          .highlight { background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">OrderPilot</div>
            <h1 style="color: #4f46e5; margin: 0;">You're Invited to Join ${invitationData.restaurantName}!</h1>
          </div>
          
          <p>Hello!</p>
          
          <p>You've been invited to join <strong>${invitationData.restaurantName}</strong> as a <strong>${invitationData.role}</strong>.</p>
          
          <p>To accept this invitation and complete your staff profile setup, please click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${invitationUrl}" class="button">Accept Invitation</a>
          </div>
          
          <div class="highlight">
            <p><strong>Important Information:</strong></p>
            <ul>
              <li>This invitation expires in 7 days</li>
              <li>You'll need to complete your profile setup</li>
              <li>You'll be able to view orders and menu items</li>
              <li>You won't have access to edit restaurant settings</li>
            </ul>
          </div>
          
          <p>If you have any questions, please contact the restaurant manager.</p>
          
          <p>Best regards,<br>The ${invitationData.restaurantName} Team</p>
          
          <div class="footer">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${invitationUrl}" style="color: #4f46e5; word-break: break-all;">${invitationUrl}</a></p>
            <p>This email was sent by OrderPilot - Restaurant Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend (you can also use SendGrid, AWS SES, etc.)
    const emailPayload: EmailPayload = {
      to: invitationData.email,
      subject: `You're Invited to Join ${invitationData.restaurantName}!`,
      html: emailHtml
    };

    // For now, we'll use a simple email service
    // In production, you'd use Resend, SendGrid, or AWS SES
    const emailResult = await sendEmail(emailPayload, invitationData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      emailResult 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send email',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

async function sendEmail(emailPayload: EmailPayload, invitationData: InvitationData) {
  // Option 1: Resend (recommended for Supabase)
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: Deno.env.get('FROM_EMAIL') || 'noreply@yourdomain.com',
          to: emailPayload.to,
          subject: emailPayload.subject,
          html: emailPayload.html,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return { service: 'resend', result };
      } else {
        throw new Error(`Resend API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Resend error:', error);
      // Fall back to console logging for development
    }
  }

  // Option 2: Use Supabase's built-in email service
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'magiclink',
          email: emailPayload.to,
          options: {
            redirectTo: invitationData.invitationUrl,
            data: {
              invitation_id: invitationData.invitationId,
              restaurant_name: invitationData.restaurantName,
              role: invitationData.role
            }
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return { service: 'supabase', result };
      } else {
        throw new Error(`Supabase email error: ${response.status}`);
      }
    } catch (error) {
      console.error('Supabase email error:', error);
      // Fall back to console logging for development
    }
  }

  // Option 3: Console logging for development
  console.log('=== INVITATION EMAIL (Edge Function) ===');
  console.log('To:', emailPayload.to);
  console.log('Subject:', emailPayload.subject);
  console.log('HTML Content Length:', emailPayload.html.length);
  console.log('========================');

  return { service: 'console', message: 'Email logged to console (development mode)' };
}
