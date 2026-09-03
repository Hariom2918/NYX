import type { Metadata } from 'next';
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { renderQrDataUrl } from "@/lib/qr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { PaymentPoller } from "@/components/payment-poller";
import { AuroraBackground } from "@/components/ui/aurora-background";

export const metadata: Metadata = {
  title: 'Booking Confirmed — Nyx After Dark',
  description: 'Your tickets are confirmed. Check your email for QR codes.',
};

// Server component fetching the order and displaying tickets
export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id: string }>;
}) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.order_id;
  
  if (!orderId) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
          <Link href="/" className="text-neutral-400 hover:text-white underline">Return home</Link>
        </div>
      </main>
    );
  }

  const supabase = createServerSupabaseClient();

  // Fetch order, its items, and tickets
  const { data: order } = await supabase.from("orders").select("*, events(*)").eq("id", orderId).single();
  const { data: tickets } = await supabase.from("tickets").select("*, ticket_types(*)").eq("order_id", orderId);

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Link href="/" className="text-neutral-400 hover:text-white underline">Return home</Link>
        </div>
      </main>
    );
  }

  const isPending = order.payment_status === "created";

  // Pre-render QR codes for display
  const ticketsWithQr = await Promise.all((tickets || []).map(async (ticket) => {
    const qrDataUrl = await renderQrDataUrl(ticket.qr_token);
    return { ...ticket, qrDataUrl };
  }));

  return (
    <main className="min-h-screen bg-[#85B0CE] text-white py-24 px-4 sm:px-6 relative overflow-hidden">
      <AuroraBackground showRadialGradient={false} className="absolute inset-0 z-0 h-full w-full fixed" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 text-center">
          {isPending ? (
            <>
              <PaymentPoller orderId={orderId} />
              <div className="w-24 h-24 bg-white/50 border border-white/60 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner animate-pulse">
                ⏳
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">PAYMENT PROCESSING</h1>
              <p className="text-slate-700 text-lg max-w-2xl mx-auto mb-8 font-medium">
                Verifying secure payment with Razorpay... Please don&apos;t close this window.
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-white/50 border border-white/60 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
                ✓
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">YOU&apos;RE GOING TO {order.events?.name.toUpperCase()}!</h1>
              <p className="text-slate-700 text-lg max-w-2xl mx-auto mb-8 font-medium">
                Your payment of <strong className="text-slate-900 bg-white/50 px-2 py-1 rounded-md">{formatCurrency(order.amount)}</strong> was successful. 
                Your tickets have also been sent to <strong className="text-slate-900">{order.buyer_email}</strong>.
              </p>

              <div className="mt-8 space-y-3 text-sm text-slate-600">
                <p className="font-bold text-slate-800 uppercase tracking-widest text-xs">Event Details</p>
                <p>📅 {order.events?.event_date ? new Date(order.events.event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '27 October 2026'}</p>
                <p>📍 {order.events?.venue || 'The Grand Ballroom'}</p>
                <p>🕖 7:00 PM onwards</p>
              </div>

              <div className="mt-6 p-4 bg-white/40 rounded-2xl border border-white/60">
                <p className="text-slate-800 font-bold text-sm mb-2">What&apos;s Next?</p>
                <ul className="text-slate-700 text-sm space-y-1">
                  <li>✉️ Check your email ({order.buyer_email}) for your ticket(s) with QR code.</li>
                  <li>📱 Show the QR code at the entrance on the day of the event.</li>
                  <li>🎫 Booking Reference: <span className="font-mono font-bold text-slate-900">{order.id.slice(0, 8).toUpperCase()}</span></li>
                </ul>
              </div>
            </>
          )}
        </div>

        {!isPending && ticketsWithQr.length > 0 && (
          <div>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-8 text-center tracking-tight drop-shadow-sm">YOUR TICKETS</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {ticketsWithQr.map((ticket, idx) => (
                <div key={ticket.id} className="bg-white text-black rounded-3xl overflow-hidden flex flex-col shadow-2xl hover:scale-[1.02] transition-transform">
                  <div className="p-8 text-center border-b-2 border-dashed border-neutral-300 relative bg-gradient-to-br from-white to-neutral-50">
                    {/* Perforated ticket edge effect */}
                    <div className="absolute -left-5 -bottom-5 w-10 h-10 bg-[#85B0CE] rounded-full shadow-inner" />
                    <div className="absolute -right-5 -bottom-5 w-10 h-10 bg-[#85B0CE] rounded-full shadow-inner" />
                    
                    <h3 className="text-xl font-black mb-1 uppercase tracking-widest text-orange-400">TICKET {idx + 1}</h3>
                    <p className="text-4xl font-display font-extrabold tracking-tighter">{ticket.ticket_types?.name}</p>
                    <p className="mt-4 text-sm font-bold uppercase tracking-wider text-neutral-500">{order.buyer_name}</p>
                  </div>
                  <div className="p-8 bg-neutral-100 flex flex-col items-center justify-center relative">
                    <img 
                      src={ticket.qrDataUrl} 
                      alt="Ticket QR Code" 
                      className="w-48 h-48 mb-6 rounded-2xl shadow-md mix-blend-multiply"
                    />
                    <p className="text-xs text-neutral-400 text-center uppercase tracking-widest font-bold">
                      Scan at entrance
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/" className="text-slate-800 hover:text-slate-600 font-bold text-sm tracking-widest uppercase transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
