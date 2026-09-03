"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { formatCurrency } from "@/lib/utils";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadingStates = [
  { text: "Verifying seat allocation availability..." },
  { text: "Securing inventory hold for 10 minutes..." },
  { text: "Encrypting point-of-sale payload transaction..." },
  { text: "Authorizing gateway card processor clearance..." },
  { text: "Generating cryptographically secure ticket QR codes..." },
  { text: "Dispatching booking confirmations to your email inbox..." },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = sessionStorage.getItem("nyx_pending_order");
    if (!data) {
      router.push("/tickets");
      return;
    }
    setOrderData(JSON.parse(data));
  }, [router]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const order = await res.json();

      if (!res.ok) throw new Error(order.error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "Nyx Events",
        description: "Tickets for Nyx After Dark",
        order_id: order.id,
        handler: function (response: any) {
          sessionStorage.removeItem("nyx_pending_order");
          router.push(`/confirmation?order_id=${order.dbOrderId}`);
        },
        prefill: {
          name: orderData.buyer.name,
          email: orderData.buyer.email,
          contact: orderData.buyer.phone,
        },
        theme: {
          color: "#0f172a", // slate-900
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Payment initiation failed");
      setLoading(false);
    }
  };

  if (!orderData) return null;

  return (
    <main className="min-h-screen bg-[#85B0CE] text-white py-24 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* Background decoration */}
      <AuroraBackground showRadialGradient={false} className="absolute inset-0 z-0 h-full w-full fixed" />

      <div className="w-full max-w-md bg-white/40 backdrop-blur-3xl border border-white/60 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-700 mb-2 drop-shadow-sm">Secure Checkout</h2>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight drop-shadow-sm">COMPLETE BOOKING</h1>
        </div>
        
        <div className="space-y-4 mb-8 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-inner">
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-sm font-bold uppercase tracking-wider">Name</span>
            <span className="text-slate-900 font-bold">{orderData.buyer.name}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-sm font-bold uppercase tracking-wider">Email</span>
            <span className="text-slate-900 font-bold">{orderData.buyer.email}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-sm font-bold uppercase tracking-wider">Phone</span>
            <span className="text-slate-900 font-bold">{orderData.buyer.phone}</span>
          </div>
          <hr className="border-slate-300 my-4" />
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Total Amount</span>
            <span className="font-black text-2xl text-slate-900 drop-shadow-sm">{formatCurrency(orderData.totalAmount)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-900 p-4 rounded-xl mb-6 text-sm font-bold shadow-lg text-center">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-5 bg-slate-900 text-white font-black tracking-widest text-sm sm:text-base rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:shadow-none disabled:scale-100"
        >
          {loading ? "PROCESSING..." : `PAY ${formatCurrency(orderData.totalAmount)}`}
        </button>
        
        <div className="mt-6 flex justify-center items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Encrypted & Secure
        </div>

        <button 
          onClick={() => router.push("/tickets")}
          disabled={loading}
          className="w-full mt-6 text-slate-500 hover:text-slate-900 transition-colors text-xs font-bold tracking-widest uppercase drop-shadow-sm"
        >
          CANCEL AND RETURN
        </button>
      </div>
    </main>
  );
}
