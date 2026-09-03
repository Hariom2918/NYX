"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import CountdownTimer from "./countdown-timer";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden w-full">
      {/* Background glow effect (Aceternity style ambient motion) */}
      <div className="absolute inset-0 bg-black z-0" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-900/30 blur-[120px] rounded-full z-0" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full z-0" />

      {/* Main Content Spotlight */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center px-4 w-full max-w-5xl flex flex-col items-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 tracking-tight mb-6">
            Nyx After Dark
          </h1>
        </motion.div>
        
        <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 mb-2 font-medium">
          The Grand Ballroom, Mumbai
        </p>
        <p className="text-neutral-500 mb-8 tracking-wide">
          September 27, 2026 &middot; 7:00 PM
        </p>

        <CountdownTimer targetDate="2026-09-27T19:00:00+05:30" />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Link
            href="/tickets"
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-12 font-medium text-black transition-all hover:scale-105 active:scale-95"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white via-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative font-bold tracking-wide">Get Tickets</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
