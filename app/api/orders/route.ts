import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, selectedTickets, totalAmount, buyer } = body;
    
    if (!eventId || !selectedTickets || !buyer || !totalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // 1. Create the Razorpay Order
    const options = {
      amount: totalAmount, // already in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { eventId },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 2. Save the order in Supabase
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      event_id: eventId,
      buyer_name: buyer.name,
      buyer_email: buyer.email,
      buyer_phone: buyer.phone,
      amount: totalAmount,
      razorpay_order_id: razorpayOrder.id,
      payment_status: 'created'
    }).select().single();

    if (orderError) throw orderError;

    // 3. Save order items
    const orderItems = Object.entries(selectedTickets).map(([ticketTypeId, qty]) => {
      return {
        order_id: order.id,
        ticket_type_id: ticketTypeId,
        quantity: qty as number,
        unit_price: 0 // Simplification for test build
      };
    });
    
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    return NextResponse.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order.id
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
