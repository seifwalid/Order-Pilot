import { Resend } from 'resend'

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendStaffInvitation({
  email,
  restaurantName,
  inviterName,
  role,
  invitationUrl,
}: {
  email: string
  restaurantName: string
  inviterName: string
  role: string
  invitationUrl: string
}) {
  console.log('🔄 Attempting to send email to:', email)
  console.log('📧 Using Resend API key:', process.env.RESEND_API_KEY ? 'Configured' : 'Not configured')
  console.log('🔗 Invitation URL:', invitationUrl)
  
  // Check if we should use development mode
  const isDevMode = process.env.NODE_ENV === 'development'
  const useMockEmails = process.env.MOCK_EMAILS === 'true'
  
  if (!resend || useMockEmails) {
    console.log('⚠️  Using development email mode (logged to console)')
    return logStaffInvitation({ email, restaurantName, inviterName, role, invitationUrl })
  }
  
  // In development, warn about Resend limitations
  if (isDevMode && email !== 'mkhalil@genscout.io') {
    console.log('⚠️  WARNING: Resend may only deliver to verified emails in testing mode')
    console.log('💡 To test with other emails, set MOCK_EMAILS=true in your .env.local')
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'OrderPilot <onboarding@resend.dev>',
      to: [email],
      subject: `You're invited to join ${restaurantName} on OrderPilot`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">OrderPilot</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">You're Invited!</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              <strong>${inviterName}</strong> has invited you to join <strong>${restaurantName}</strong> 
              as a <strong>${role}</strong> on OrderPilot.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              OrderPilot is a complete restaurant management system that helps teams coordinate 
              orders, manage menus, and streamline operations.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 5px; font-weight: bold; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              If the button above doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${invitationUrl}" style="color: #667eea; word-break: break-all;">${invitationUrl}</a>
            </p>
            
            <p style="color: #777; font-size: 14px;">
              This invitation will expire in 7 days. If you have any questions, 
              please contact ${inviterName} at ${restaurantName}.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('❌ Email sending failed:', error)
      throw error
    }

    console.log('✅ Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send staff invitation email:', error)
    return { success: false, error }
  }
}

// For development/testing - logs email instead of sending
export async function logStaffInvitation({
  email,
  restaurantName,
  inviterName,
  role,
  invitationUrl,
}: {
  email: string
  restaurantName: string
  inviterName: string
  role: string
  invitationUrl: string
}) {
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│                   📧 DEVELOPMENT EMAIL MODE                │
├─────────────────────────────────────────────────────────────┤
│ To: ${email.padEnd(50)} │
│ Restaurant: ${restaurantName.padEnd(44)} │
│ Invited by: ${inviterName.padEnd(44)} │
│ Role: ${role.padEnd(50)} │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Invitation URL:                                         │
│ ${invitationUrl}                                            │
├─────────────────────────────────────────────────────────────┤
│ 💡 To test: Copy the URL above and open in browser         │
│ 📝 Note: Email is not actually sent in development mode    │
└─────────────────────────────────────────────────────────────┘
  `)
  
  return { success: true, data: { id: `dev-${Date.now()}` } }
}
