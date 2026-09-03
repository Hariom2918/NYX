import type { Metadata } from 'next';
import { createServerSupabaseClient } from "@/lib/supabase/server";
import TicketSelection from "@/components/ticket-selection";
import { notFound } from "next/navigation";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { formatShortDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'Get Tickets — Nyx After Dark',
  description: 'Choose your experience. General admission or VIP — secure your spot for Nyx After Dark.',
};

// Opt out of caching so ticket availability is always fresh
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const supabase = createServerSupabaseClient();
  
  // Assuming a single event setup. Using the hardcoded seeded ID.
  const EVENT_ID = "550e8400-e29b-41d4-a716-446655440000";
  
  const [eventRes, ticketsRes] = await Promise.all([
    supabase.from("events").select("*").eq("id", EVENT_ID).single(),
    supabase.from("ticket_types").select("*").eq("event_id", EVENT_ID).order("price", { ascending: true })
  ]);

  if (eventRes.error || !eventRes.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-neutral-400">Could not load event data from the database.</p>
        </div>
      </div>
    );
  }

  const event = eventRes.data;
  const ticketTypes = ticketsRes.data || [];

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#85B0CE] selection:bg-orange-500/30">
      <AuroraBackground showRadialGradient={false} className="absolute inset-0 z-0 h-full w-full fixed" />
      
      <div className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {ticketTypes.length > 0 ? (
            <TicketSelection ticketTypes={ticketTypes} eventId={event.id} />
          ) : (
            <div className="p-12 border border-white/20 rounded-3xl text-center bg-white/10 backdrop-blur-xl shadow-2xl">
              <p className="text-white/80 text-lg font-medium">No tickets are currently available for this event.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
