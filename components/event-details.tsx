export default function EventDetails() {
  return (
    <section className="py-24 px-4 bg-black text-white relative z-10 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
            About the Experience
          </h2>
          <div className="space-y-6 text-neutral-400 leading-relaxed text-lg">
            <p>
              Step into a world where boundaries blur and creativity flows. Nyx After Dark is an exclusive convergence of music, art, and immersive technology.
            </p>
            <p>
              Experience live avant-garde performances, interactive light installations, and an atmosphere meticulously curated to transport you to another dimension. This isn&apos;t just a party; it&apos;s a sensory journey.
            </p>
          </div>
        </div>
        
        <div className="bg-neutral-950 p-8 rounded-3xl border border-neutral-800 shadow-2xl">
          <h2 className="text-2xl font-display font-bold mb-8 text-white">
            Venue & Info
          </h2>
          <ul className="space-y-6 text-neutral-300">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                📍
              </div>
              <div>
                <strong className="block text-white mb-1">The Grand Ballroom</strong>
                <span className="text-neutral-500 text-sm">Taj Lands End, Bandra West, Mumbai, Maharashtra 400050</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                🗓️
              </div>
              <div>
                <strong className="block text-white mb-1">September 27, 2026</strong>
                <span className="text-neutral-500 text-sm">Doors open at 7:00 PM</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                👗
              </div>
              <div>
                <strong className="block text-white mb-1">Dress Code</strong>
                <span className="text-neutral-500 text-sm">Dark, Elegant, Avant-Garde</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
