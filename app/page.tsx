import Link from "next/link";
import type { Metadata } from 'next';
import { 
  HeroCinematic, 
  ExperienceSection, 
  EventTimeline, 
  VenueSection, 
  FinalCTA 
} from "@/components/landing-sections";

export const metadata: Metadata = {
  title: 'Nyx After Dark — An Exclusive Night of Music & Art',
  description: 'Step into a world where boundaries blur and creativity flows. Get your tickets for the most anticipated event of 2026.',
  openGraph: {
    title: 'Nyx After Dark — An Exclusive Night of Music & Art',
    description: 'Step into a world where boundaries blur and creativity flows.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#85B0CE] selection:bg-orange-500/30">
      <HeroCinematic />
      <ExperienceSection />
      <EventTimeline />
      <VenueSection />
      <FinalCTA />
      
      {/* Minimal Footer */}
      <footer className="py-8 text-center bg-[#7198B8] border-t border-white/20 text-slate-700 font-medium text-sm relative z-20">
        <p>&copy; 2026 Nyx Events. All rights reserved.</p>
        <Link href="/privacy" className="text-slate-600 hover:text-slate-900 underline text-xs mt-2 inline-block">Privacy & Terms</Link>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden">
        <Link href="/tickets">
          <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl tracking-widest text-sm shadow-2xl active:scale-[0.98] transition-transform">
            GET TICKETS
          </button>
        </Link>
      </div>
    </main>
  );
}
