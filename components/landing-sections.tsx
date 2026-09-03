"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AuroraBackground } from "./ui/aurora-background";

// ==========================================
// 1. CINEMATIC HERO (Interactive & Dreamy)
// ==========================================
export function HeroCinematic() {
  return (
    <AuroraBackground showRadialGradient={false} className="h-screen relative border-b border-white/20">
      <div className="relative z-30 flex flex-col items-center justify-center text-center px-4 h-full pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 flex flex-col items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block border border-white/40 bg-white/40 text-slate-800 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-xl shadow-xl cursor-pointer"
          >
            A New Horizon of Sound
          </motion.div>
          
          <h1 className="text-5xl md:text-9xl font-display font-extrabold tracking-tighter text-slate-900 drop-shadow-lg mix-blend-overlay">
            NYX AFTER DARK
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-800 font-medium max-w-2xl mx-auto tracking-wide drop-shadow-sm">
            Step into a world where boundaries blur and creativity flows.
          </p>
          
          <div className="pt-8">
            <Link href="/tickets">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-white/40 backdrop-blur-2xl border border-white/60 text-slate-900 rounded-full font-bold text-lg tracking-widest hover:bg-white transition-colors shadow-2xl"
              >
                GET TICKETS
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Fade to soft background at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#85B0CE] to-transparent z-20 pointer-events-none" />
    </AuroraBackground>
  );
}

// ==========================================
// 2. FLOATING INFO BAR (Glassmorphism)
// ==========================================
export function FloatingInfoBar() {
  return (
    <div className="w-full bg-[#85B0CE]/80 backdrop-blur-3xl border-y border-white/40 py-8 relative z-20 shadow-xl">
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-between items-center gap-6 text-center md:text-left">
        <div className="flex-1 min-w-[150px] group cursor-pointer">
          <p className="text-slate-600 text-xs font-bold tracking-widest uppercase mb-1 group-hover:text-slate-900 transition-colors">Date</p>
          <p className="text-slate-900 text-xl font-black">27 OCT 2026</p>
        </div>
        <div className="w-px h-12 bg-white/40 hidden md:block" />
        <div className="flex-1 min-w-[150px] group cursor-pointer">
          <p className="text-slate-600 text-xs font-bold tracking-widest uppercase mb-1 group-hover:text-slate-900 transition-colors">Venue</p>
          <p className="text-slate-900 text-xl font-black">The Grand Ballroom</p>
        </div>
        <div className="w-px h-12 bg-white/40 hidden md:block" />
        <div className="flex-1 min-w-[150px] group cursor-pointer">
          <p className="text-slate-600 text-xs font-bold tracking-widest uppercase mb-1 group-hover:text-slate-900 transition-colors">Time</p>
          <p className="text-slate-900 text-xl font-black">19:00 PM</p>
        </div>
        <div className="w-px h-12 bg-white/40 hidden md:block" />
        <div className="flex-1 min-w-[150px]">
          <p className="text-slate-600 text-xs font-bold tracking-widest uppercase mb-1">Status</p>
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <p className="text-slate-900 text-xl font-black">Limited Tickets</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. THE EXPERIENCE (Infinite Looping Carousel)
// ==========================================
export function ExperienceSection() {
  const cards = [
    { title: "LIVE MUSIC", desc: "Immersive soundscapes.", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop" },
    { title: "THE CROWD", desc: "Shared, vibrant energy.", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop" },
    { title: "PREMIUM VIBES", desc: "Curated mixology & arts.", img: "https://images.unsplash.com/photo-1470229722913-7c092dbbba3a?q=80&w=800&auto=format&fit=crop" },
    { title: "VIP LOUNGE", desc: "Exclusive access areas.", img: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop" },
    { title: "LIGHT SHOWS", desc: "Visual storytelling.", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop" },
  ];

  // Duplicate for seamless infinite scroll loop
  const duplicatedCards = [...cards, ...cards];

  return (
    <section className="py-32 bg-[#85B0CE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12 mb-16 text-center md:text-left">
        <h2 className="text-sm font-bold tracking-widest uppercase text-orange-600 mb-2 drop-shadow-sm">The Experience</h2>
        <h3 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 tracking-tight drop-shadow-lg">FEEL THE ENERGY</h3>
      </div>

      {/* Infinite Looping Carousel */}
      <div className="relative w-full overflow-hidden flex py-10" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="flex gap-6 px-3 animate-marquee hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
          {duplicatedCards.map((card, i) => (
            <div 
              key={i}
              className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] rounded-[2rem] p-8 flex flex-col justify-end relative overflow-hidden shadow-2xl border border-white/40 group shrink-0 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-white/80 hover:rotate-1"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image src={card.img} alt={card.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 300px, 400px" />
                {/* Gradient Overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h4 className="text-3xl md:text-4xl font-display font-black text-white mb-2 tracking-widest drop-shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {card.title}
                </h4>
                <p className="text-white/90 font-medium text-sm md:text-lg drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}} />
    </section>
  );
}

// ==========================================
// 4. THE NIGHT (TIMELINE)
// ==========================================
export function EventTimeline() {
  const schedule = [
    { time: "06:00 PM", title: "Doors Open", desc: "Arrive early, grab a drink, and find your spot." },
    { time: "07:00 PM", title: "Opening Act", desc: "Setting the tone for the night." },
    { time: "08:30 PM", title: "Main Event", desc: "The highly anticipated visual and auditory journey." },
    { time: "10:30 PM", title: "Closing Set", desc: "End the night on a high note." },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-[#85B0CE] to-[#7198B8] px-4 border-t border-white/10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase text-orange-600 mb-2">Schedule</h2>
          <h3 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight drop-shadow-lg">THE NIGHT</h3>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-white/40">
          {schedule.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              key={i} 
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-slate-100 text-orange-500 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
              </div>
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-3xl border border-white/50 bg-white/40 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/60 hover:scale-105 cursor-pointer">
                <div className="flex flex-col mb-2">
                  <span className="font-mono text-orange-600 text-sm font-bold tracking-widest">{item.time}</span>
                  <h4 className="text-2xl font-bold text-slate-900 mt-1">{item.title}</h4>
                </div>
                <p className="text-slate-700 font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. VENUE
// ==========================================
export function VenueSection() {
  return (
    <section className="py-32 bg-[#7198B8] px-4 relative overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 z-0">
        <Image src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop" alt="Concert venue atmosphere" fill className="object-cover opacity-20 mix-blend-overlay grayscale" sizes="100vw" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold tracking-widest uppercase text-orange-600 mb-2">Where It&apos;s Happening</h2>
          <h3 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 tracking-tight drop-shadow-lg">THE VENUE</h3>
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="rounded-3xl border border-white/50 bg-white/40 backdrop-blur-2xl p-12 text-center flex flex-col items-center shadow-2xl"
        >
          <h4 className="text-4xl font-bold text-slate-900 mb-4 drop-shadow-sm">The Grand Ballroom</h4>
          <p className="text-slate-800 text-xl max-w-lg font-medium">123 Entertainment Avenue, Mumbai, Maharashtra 400001, India</p>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 6. FINAL CTA
// ==========================================
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#7198B8] flex items-center justify-center text-center">
      <AuroraBackground showRadialGradient={true} className="w-full py-40 bg-[#7198B8]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto flex flex-col items-center px-4"
        >
          <h2 className="text-4xl md:text-8xl font-display font-extrabold text-slate-900 tracking-tighter mb-10 leading-tight drop-shadow-2xl">
            YOU&apos;RE NOT GOING TO WANT TO HEAR ABOUT THIS TOMORROW.
          </h2>
          <Link href="/tickets">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="px-14 py-6 bg-slate-900 text-white rounded-full font-black text-xl tracking-widest shadow-2xl"
            >
              SECURE YOUR SPOT
            </motion.button>
          </Link>
        </motion.div>
      </AuroraBackground>
    </section>
  );
}
