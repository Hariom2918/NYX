import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { verifyQrToken } from '@/lib/qr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const isScanner = cookieStore.get('nyx_api_scanner_auth')?.value === 'true' || cookieStore.get('nyx_scanner_auth')?.value === 'true';
    if (!isScanner) {
      return NextResponse.json({ error: 'Unauthorized scanner' }, { status: 401 });
    }

    const { token, deviceId = 'web_scanner' } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // 1. Verify Cryptographic Signature
    const { valid, ticketId } = verifyQrToken(token);
    const supabase = createServerSupabaseClient();
    
    if (!valid || !ticketId) {
      await supabase.from('scan_logs').insert({ scanner_device_id: deviceId, result: 'invalid' });
      return NextResponse.json({ error: 'Invalid QR signature. Fake ticket.' }, { status: 400 });
    }
    
    // 2. Atomic Check-in
    // By enforcing status = 'issued', we prevent race conditions.
    const { data: ticket, error } = await supabase
      .from('tickets')
      .update({ status: 'checked_in', checked_in_at: new Date().toISOString(), checked_in_by: deviceId })
      .eq('id', ticketId)
      .eq('status', 'issued') 
      .select('*, ticket_types(name), orders(buyer_name)')
      .single();
      
    if (error || !ticket) {
      // It failed to update. Figure out why to return accurate error.
      const { data: currentTicket } = await supabase.from('tickets').select('status, checked_in_at').eq('id', ticketId).single();
      
      const resultStatus = currentTicket?.status === 'checked_in' ? 'duplicate' : 'invalid';
      await supabase.from('scan_logs').insert({ ticket_id: ticketId, scanner_device_id: deviceId, result: resultStatus });
      
      if (resultStatus === 'duplicate') {
        const time = new Date(currentTicket?.checked_in_at || '').toLocaleTimeString();
        return NextResponse.json({ 
          error: `ALREADY SCANNED at ${time}`,
          code: 'duplicate'
        }, { status: 409 });
      }
      
      return NextResponse.json({ error: 'Ticket void or not found in DB', code: 'invalid' }, { status: 409 });
    }
    
    // 3. Success log
    await supabase.from('scan_logs').insert({ ticket_id: ticketId, scanner_device_id: deviceId, result: 'success' });
    
    return NextResponse.json({
      success: true,
      ticket: {
        type: ticket.ticket_types?.name,
        buyer: ticket.orders?.buyer_name,
      }
    });

  } catch (error) {
    console.error('Scan Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
