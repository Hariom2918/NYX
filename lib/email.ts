import { Resend } from 'resend';

// Only initialize if key exists, otherwise we mock it
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendTicketEmail({
  to,
  buyerName,
  eventName,
  tickets
}: {
  to: string;
  buyerName: string;
  eventName: string;
  tickets: { typeName: string; qrBuffer: Buffer }[];
}) {
  if (!resend) {
    console.warn('RESEND_API_KEY not set. Skipping email notification.');
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject: `Your Tickets for ${eventName}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #111;">
          <h2>Hi ${buyerName},</h2>
          <p>Your tickets for <strong>${eventName}</strong> are confirmed!</p>
          <p>Please find your entry QR codes attached to this email. You will need to show these at the entrance.</p>
          <p>See you there!</p>
        </div>
      `,
      attachments: tickets.map((t, i) => ({
        filename: `ticket-${t.typeName.replace(/\s+/g, '-').toLowerCase()}-${i + 1}.png`,
        content: t.qrBuffer,
      })),
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
