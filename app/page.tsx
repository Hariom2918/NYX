import { 
  HeroCinematic, 
  ExperienceSection, 
  EventTimeline, 
  VenueSection, 
  FinalCTA 
} from "@/components/landing-sections";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#85B0CE] selection:bg-orange-500/30">
      <HeroCinematic />
      <ExperienceSection />
      <EventTimeline />
      <VenueSection />
      <FinalCTA />
      
      {/* Minimal Footer */}
      <footer className="py-8 text-center bg-[#7198B8] border-t border-white/20 text-white/60 font-medium text-sm relative z-20">
        <p>&copy; 2026 Nyx Events. All rights reserved.</p>
      </footer>
    </main>
  );
}
