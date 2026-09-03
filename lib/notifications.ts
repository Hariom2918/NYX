import { sendTicketEmail } from './email';
import { sendWhatsAppTicket } from './whatsapp';
import { renderQrImage } from './qr';

export async function sendOrderNotifications({
  buyerName,
  buyerEmail,
  buyerPhone,
  eventName,
  tickets
}: {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  eventName: string;
  tickets: { qrToken: string; typeName: string }[];
}) {
  try {
    // Pre-render QR buffers for all tickets
    const ticketsWithBuffers = await Promise.all(
      tickets.map(async (t) => ({
        typeName: t.typeName,
        qrBuffer: await renderQrImage(t.qrToken)
      }))
    );

    // Run notifications in parallel
    const promises: Promise<void>[] = [];

    // 1. Email with all tickets attached
    promises.push(
      sendTicketEmail({
        to: buyerEmail,
        buyerName,
        eventName,
        tickets: ticketsWithBuffers
      })
    );

    // 2. WhatsApp
    // We'll send the first ticket to WhatsApp to avoid spamming if they bought many.
    // In a real app, you might stitch them into one PDF or send a link to the confirmation page.
    if (ticketsWithBuffers.length > 0) {
      promises.push(
        sendWhatsAppTicket({
          phone: buyerPhone,
          buyerName,
          eventName,
          qrBuffer: ticketsWithBuffers[0].qrBuffer
        })
      );
    }

    // Wait for all notifications to complete (or fail gracefully)
    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Notification orchestration error:', error);
  }
}
