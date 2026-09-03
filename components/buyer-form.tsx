"use client";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface BuyerFormProps {
  eventId: string;
  selectedTickets: Record<string, number>;
  totalAmount: number;
  onBack: () => void;
}

export default function BuyerForm({ eventId, selectedTickets, totalAmount, onBack }: BuyerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { name, email, phone } = formData;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    
    if (!trimmedName || trimmedName.length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    const digits = trimmedPhone.replace(/[^0-9]/g, '');
    if (!digits || digits.length < 10) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits).';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    setLoading(true);

    try {
      // In a real app we'd validate phone formatting robustly here
      // Save order info to session storage so checkout page can read it
      const orderData = { 
        eventId, 
        selectedTickets, 
        totalAmount, 
        buyer: formData 
      };
      sessionStorage.setItem("nyx_pending_order", JSON.stringify(orderData));
      
      // Navigate to checkout phase
      router.push("/checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto pb-32"
    >
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="text-slate-800 hover:text-slate-600 flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-colors mb-6 drop-shadow-md"
        >
          &larr; Back to tickets
        </button>
        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-2 drop-shadow-xl tracking-tight">ALMOST THERE</h2>
        <p className="text-slate-700 font-medium">Please provide your details to receive your tickets.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-3xl shadow-2xl">
        <div className="space-y-2">
          <label className="text-sm font-bold tracking-widest uppercase text-slate-800 drop-shadow-sm">Full Name</label>
          <input
            required
            className="w-full bg-white/50 border border-white/40 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all shadow-inner font-medium"
            placeholder="John Doe"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold tracking-widest uppercase text-slate-800 drop-shadow-sm">Email Address</label>
          <input
            required
            type="email"
            className="w-full bg-white/50 border border-white/40 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all shadow-inner font-medium"
            placeholder="john@example.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold tracking-widest uppercase text-slate-800 drop-shadow-sm">WhatsApp Number</label>
          <input
            required
            type="tel"
            className="w-full bg-white/50 border border-white/40 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all shadow-inner font-medium"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-slate-600 text-sm font-bold tracking-widest uppercase">Total Amount</span>
            <span className="text-3xl font-black text-slate-900 drop-shadow-md">{formatCurrency(totalAmount)}</span>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-black rounded-xl tracking-widest text-sm shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'PROCESSING...' : 'PROCEED TO PAY'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
