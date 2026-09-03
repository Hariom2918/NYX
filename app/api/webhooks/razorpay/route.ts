import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateQrToken } from '@/lib/qr';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(expectedSignature, 'utf8'))) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      const supabase = createServerSupabaseClient();

      // 1. Idempotency Check & Order Update
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'captured',
          razorpay_payment_id: razorpayPaymentId
        })
        .eq('razorpay_order_id', razorpayOrderId)
        .eq('payment_status', 'created') 
        .select()
        .single();

      if (orderError || !order) {
        console.log('Order already processed or not found:', razorpayOrderId);
        return NextResponse.json({ received: true, status: 'ignored' }, { status: 200 });
      }

      console.log(`Payment successful for order: ${order.id}. Generating tickets...`);
      
      // 2. Fetch Order Items
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsError || !orderItems) {
        console.error('Failed to fetch order items', itemsError);
        return NextResponse.json({ error: 'Failed to process tickets' }, { status: 500 });
      }

      // 3. Generate Tickets & QR Tokens
      const allGeneratedTickets: { qrToken: string; typeName: string }[] = [];

      for (const item of orderItems) {
        // We need to create `item.quantity` individual tickets
        const ticketsToInsert = Array.from({ length: item.quantity }).map(() => {
          // Pre-generate a UUID so we can include it in the QR token
          const ticketId = crypto.randomUUID(); 
          const qrToken = generateQrToken(ticketId);
          
          return {
            id: ticketId,
            order_id: order.id,
            ticket_type_id: item.ticket_type_id,
            qr_token: qrToken,
            status: 'issued'
          };
        });

        // Insert tickets
        await supabase.from('tickets').insert(ticketsToInsert);

        // Record for notifications
        const { data: ticketType } = await supabase
          .from('ticket_types')
          .select('name, quantity_sold')
          .eq('id', item.ticket_type_id)
          .single();
          
        if (ticketType) {
          // Update quantity sold in ticket_types (atomic RPC is better, but this works for our simplified build)
          await supabase
            .from('ticket_types')
            .update({ quantity_sold: ticketType.quantity_sold + item.quantity })
            .eq('id', item.ticket_type_id);

          ticketsToInsert.forEach(t => {
            allGeneratedTickets.push({ qrToken: t.qr_token, typeName: ticketType.name });
          });
        }
      }

      // 4. Send Notifications (Email/WhatsApp)
      const { data: eventDetails } = await supabase.from('events').select('name').eq('id', order.event_id).single();
      
      const { sendOrderNotifications } = await import('@/lib/notifications');
      await sendOrderNotifications({
        buyerName: order.buyer_name,
        buyerEmail: order.buyer_email,
        buyerPhone: order.buyer_phone,
        eventName: eventDetails?.name || 'Nyx Event',
        tickets: allGeneratedTickets
      });

      console.log(`Tickets generated and notifications sent for order: ${order.id}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error?.message, stack: error?.stack }, { status: 500 });
  }
}
