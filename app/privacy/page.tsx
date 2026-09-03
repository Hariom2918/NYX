import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & Terms — Nyx After Dark",
  description: "Privacy policy and terms of service for Nyx After Dark event.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#85B0CE] py-12 sm:py-16 px-4 sm:px-6 md:px-8 selection:bg-orange-500/30">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-900 hover:text-slate-700 font-bold transition-colors"
          >
            ← Back to Event
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900 tracking-tight mb-2">
            Privacy Policy &amp; Terms of Service
          </h1>
          <p className="text-slate-700 text-base leading-relaxed mb-8">
            Please read these terms and privacy guidelines carefully before purchasing tickets for Nyx After Dark.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
              1. Information We Collect
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              Name, email, phone number, and payment details (processed securely via Razorpay).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
              2. How We Use Your Information
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              To process ticket purchases, send booking confirmations and QR codes via email, and communicate event updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
              3. Data Sharing
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              We do not sell or share your personal data with third parties, except as required to process payments through Razorpay.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
              4. Data Security
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              All payment transactions are encrypted and processed securely through Razorpay&apos;s PCI-DSS compliant infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
              5. Refunds &amp; Cancellations
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              All ticket sales are final. In the event of cancellation by the organizer, full refunds will be issued to the original payment method within 7-10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
              6. Contact Us
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              For any questions regarding your data or this policy, please reach out to the event organizers.
            </p>
          </section>

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-white/60 text-slate-600 text-sm">
            Last updated: September 2026
          </div>
        </div>
      </div>
    </main>
  );
}
