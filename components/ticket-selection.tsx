"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { TicketType } from "@/lib/supabase/types";
import Link from "next/link";
import BuyerForm from "./buyer-form";

interface TicketSelectionProps {
  ticketTypes: TicketType[];
  eventId: string;
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function TicketSelection({ ticketTypes, eventId }: TicketSelectionProps) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [step, setStep] = useState<1 | 2>(1);

  const totalAmount = ticketTypes.reduce((acc, type) => {
    return acc + (selected[type.id] || 0) * type.price;
  }, 0);

  const handleSelect = (id: string, qty: number) => {
    setSelected(prev => ({ ...prev, [id]: qty }));
  };

  const totalTickets = Object.values(selected).reduce((a, b) => a + b, 0);

  if (step === 2) {
    return (
      <BuyerForm
        eventId={eventId}
        selectedTickets={selected}
        totalAmount={totalAmount}
        onBack={() => setStep(1)}
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-32">
      <div className="mb-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-600 font-bold text-sm tracking-widest uppercase transition-colors mb-6 drop-shadow-md"
        >
          &larr; Back to Home
        </Link>
        <div className="text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase text-orange-600 mb-2 drop-shadow-sm">Tickets</h2>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight drop-shadow-lg">CHOOSE YOUR EXPERIENCE</h1>
        </div>
      </div>

      <div className="space-y-6">
        {ticketTypes.map((type) => {
          const available = type.quantity_total - type.quantity_sold;
          const isSoldOut = available <= 0;
          const currentQty = selected[type.id] || 0;
          const isActive = currentQty > 0;
          const isVVIP = type.name.toUpperCase().includes('VVIP');
          const isVIP = type.name.toUpperCase().includes('VIP') && !isVVIP;
          const isGeneral = !isVIP && !isVVIP;

          return (
            <motion.div
              key={type.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={!isSoldOut && !isActive ? { y: -2 } : {}}
              transition={{ duration: 0.2 }}
              className={`relative p-6 md:p-8 rounded-3xl border transition-all duration-300 overflow-hidden backdrop-blur-xl shadow-2xl
                ${isSoldOut ? 'border-white/10 bg-white/10 opacity-60' : ''}
                ${!isSoldOut && !isActive && isGeneral ? 'border-white/40 bg-white/30 hover:bg-white/40' : ''}
                ${!isSoldOut && !isActive && isVIP ? 'border-orange-300/50 bg-gradient-to-br from-orange-400/20 to-pink-500/10 hover:border-orange-300' : ''}
                ${!isSoldOut && !isActive && isVVIP ? 'border-orange-500/40 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-orange-400' : ''}
                ${isActive && !isVVIP ? 'border-orange-400 bg-white/60 shadow-[0_0_40px_rgba(255,255,255,0.4)]' : ''}
                ${isActive && isVVIP ? 'border-orange-400 bg-slate-800 shadow-[0_0_40px_rgba(249,115,22,0.4)]' : ''}
              `}
              onClick={() => {
                if (!isSoldOut && currentQty === 0) handleSelect(type.id, 1);
              }}
            >
              <div className={`relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 ${isVVIP ? 'text-white' : 'text-slate-900'}`}>
                <div className="flex-1 cursor-pointer">
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight drop-shadow-sm">{type.name}</h3>
                    {isVIP && (
                      <span className="px-3 py-1 rounded-full bg-slate-900 text-orange-400 text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Recommended
                      </span>
                    )}
                    {isVVIP && (
                      <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Extremely Limited
                      </span>
                    )}
                  </div>
                  <p className={`text-3xl font-light mb-4 drop-shadow-sm ${isVVIP ? 'text-orange-400 font-medium' : ''}`}>{formatCurrency(type.price)}</p>
                  
                  <ul className={`space-y-2 text-sm mb-6 font-medium ${isVVIP ? 'text-slate-300' : 'text-slate-800'}`}>
                    {isVVIP ? (
                      <>
                        <li className="flex items-start gap-2 font-bold text-white"><CheckIcon /> Access to Exclusive VVIP Lounge</li>
                        <li className="flex items-start gap-2 font-bold text-white"><CheckIcon /> Skip-the-line Dedicated Entry Lane</li>
                        <li className="flex items-start gap-2"><CheckIcon /> Complimentary premium welcome drinks</li>
                        <li className="flex items-start gap-2"><CheckIcon /> Priority bar service & dedicated concierge</li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2"><CheckIcon /> Entry to the event</li>
                        <li className="flex items-center gap-2"><CheckIcon /> {isVIP ? 'Priority fast-track access' : 'General access areas'}</li>
                        {isVIP && <li className="flex items-center gap-2"><CheckIcon /> Exclusive VIP bar access</li>}
                      </>
                    )}
                  </ul>

                  <p className="text-xs font-bold uppercase tracking-widest">
                    {isSoldOut ? (
                      <span className="text-red-500">Sold Out</span>
                    ) : (
                      <span className={isVVIP ? "text-orange-400" : (available < 20 ? "text-orange-600" : "text-slate-700")}>
                        {isVVIP ? `${available} of ${type.quantity_total} VVIP left` : (available < 20 ? `Only ${available} left` : 'Available')}
                      </span>
                    )}
                  </p>
                </div>

                {!isSoldOut && (
                  <div className="flex flex-col items-end justify-center min-w-[120px]" onClick={e => e.stopPropagation()}>
                    <AnimatePresence mode="popLayout">
                      {!isActive ? (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => handleSelect(type.id, 1)}
                          className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-lg
                            ${isVVIP 
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : isVIP
                                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                                : 'bg-white/60 text-slate-900 hover:bg-white border border-white/60'}`}
                        >
                          SELECT
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 w-full shadow-inner"
                        >
                          <button
                            onClick={() => handleSelect(type.id, Math.max(0, currentQty - 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-xl hover:bg-slate-900 text-slate-900 hover:text-white font-bold text-xl transition-colors"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-black text-lg text-slate-900 drop-shadow-sm">{currentQty}</span>
                          <button
                            onClick={() => handleSelect(type.id, Math.min(available, 10, currentQty + 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-xl hover:bg-slate-900 text-slate-900 hover:text-white font-bold text-xl transition-colors"
                          >
                            +
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky Bottom Booking Bar */}
      <AnimatePresence>
        {totalTickets > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-3xl border border-white/80 p-4 md:p-6 rounded-3xl shadow-[0_-10px_60px_rgba(0,0,0,0.1)] flex flex-row justify-between items-center gap-4">
              <div className="flex flex-col text-slate-900 drop-shadow-sm">
                <span className="text-slate-700 text-sm font-bold tracking-wider uppercase">{totalTickets} {totalTickets === 1 ? 'Ticket' : 'Tickets'}</span>
                <span className="text-2xl md:text-3xl font-black">{formatCurrency(totalAmount)}</span>
              </div>
              <button
                onClick={() => setStep(2)}
                className="px-10 py-4 bg-slate-900 text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-2xl tracking-widest text-sm"
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
