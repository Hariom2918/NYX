import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Nyx After Dark",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#85B0CE] flex items-center justify-center p-4 sm:p-6 md:p-8 relative selection:bg-orange-500/30">
      <div className="w-full max-w-lg bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
        <h1 className="text-8xl sm:text-9xl font-black font-display text-slate-900 tracking-tighter mb-2 drop-shadow-sm">
          404
        </h1>
        
        <p className="text-orange-600 font-bold uppercase tracking-widest text-sm sm:text-base mb-2">
          Lost in the Night
        </p>

        <p className="text-slate-900 text-lg sm:text-xl font-semibold mb-8">
          This page doesn&apos;t exist.
        </p>

        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-slate-900 text-white rounded-full px-8 py-4 font-bold shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          >
            ← Back to Event
          </Link>
        </div>
      </div>
    </main>
  );
}
