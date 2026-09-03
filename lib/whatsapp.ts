/**
 * Uploads a QR Buffer to WhatsApp Media API and returns the media ID.
 */
async function uploadMedia(qrBuffer: Buffer): Promise<string | null> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  
  if (!phoneNumberId || !token) return null;

  try {
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('type', 'image/png');
    formData.append('file', new Blob([new Uint8Array(qrBuffer)], { type: 'image/png' }), 'ticket.png');

    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    return data.id || null;
  } catch (error) {
    console.error('WhatsApp Media Upload Error:', error);
    return null;
  }
}

/**
 * Sends a WhatsApp message with the ticket QR.
 */
export async function sendWhatsAppTicket({
  phone,
  buyerName,
  eventName,
  qrBuffer
}: {
  phone: string;
  buyerName: string;
  eventName: string;
  qrBuffer: Buffer;
}) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneNumberId || !token) {
    console.warn('WhatsApp credentials not set. Skipping WhatsApp notification.');
    return;
  }

  try {
    // 1. Upload QR image
    const mediaId = await uploadMedia(qrBuffer);
    if (!mediaId) throw new Error('Failed to upload media to WhatsApp');

    // 2. Send message
    // Note: Assuming a standard image message (works within 24h session, or if testing to yourself).
    // In strict production, you'd send an approved template message.
    const to = phone.replace(/[^0-9]/g, ''); // E.164 format digits only
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'image',
      image: {
        id: mediaId,
        caption: `🎟️ *${eventName}*\n\nHi ${buyerName}, here is your ticket! Scan this QR at the entrance.`
      }
    };

    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('WhatsApp Send Error:', errData);
    } else {
      console.log(`WhatsApp message sent to ${to}`);
    }
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
  }
}
