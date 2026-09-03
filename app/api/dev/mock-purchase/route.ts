import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { generateQrToken } from '@/lib/qr';

export async function GET(req: Request) {
  // Security: Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();

  // 1. Get the first event and ticket type
  const { data: event } = await supabase.from('events').select('id').limit(1).single();
  const { data: ticketType } = await supabase.from('ticket_types').select('id, name').limit(1).single();

  if (!event || !ticketType) {
    return NextResponse.json({ error: 'Database not seeded yet' }, { status: 500 });
  }

  // 2. Create a mock order (bypassing Razorpay)
  const orderId = crypto.randomUUID();
  await supabase.from('orders').insert({
    id: orderId,
    event_id: event.id,
    buyer_name: 'VIP Tester',
    buyer_email: 'vip@nyx.com',
    buyer_phone: '9999999999',
    amount: 0,
    currency: 'INR',
    payment_status: 'captured', // Set directly to captured to trigger display
  });

  // 3. Generate the Ticket and Cryptographic QR Token!
  const ticketId = crypto.randomUUID();
  const qrToken = generateQrToken(ticketId); // HMAC-SHA256 Signed Token
  
  await supabase.from('tickets').insert({
    id: ticketId,
    order_id: orderId,
    ticket_type_id: ticketType.id,
    qr_token: qrToken,
    status: 'issued'
  });

  // 4. Redirect straight to the confirmation page to view the QR code
  return NextResponse.redirect(new URL(`/confirmation?order_id=${orderId}`, req.url));
}
