import { getWelcomeEmailHtml, getWelcomeEmailText } from './emailTemplates';

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
): Promise<void> {
  const dashboardUrl = `${process.env.VITE_APP_URL || 'http://localhost:5000'}/dashboard`;
  
  const html = getWelcomeEmailHtml({ userName, dashboardUrl });
  const text = getWelcomeEmailText({ userName, dashboardUrl });

  // Em desenvolvimento, apenas log
  if (process.env.NODE_ENV === 'development') {
    console.log('[Email] Welcome email would be sent to:', userEmail);
    console.log('[Email] Content:', text);
    return;
  }

  // Em produção, usar serviço de email
  // Exemplos: SendGrid, AWS SES, Resend, etc.
  try {
    await sendEmail({
      to: userEmail,
      subject: '🚀 Bem-vindo ao Elevare!',
      html,
      text,
    });
  } catch (error) {
    console.error('[Email] Failed to send welcome email:', error);
  }
}

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  // Implementar integração com serviço de email
  // Exemplo com SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  await sgMail.send({
    to: options.to,
    from: 'contato@elevare.com',
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  */
  
  // For now, just log in production too
  console.log('[Email] Would send email:', {
    to: options.to,
    subject: options.subject,
  });
}
