"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export function PaymentPoller({ orderId }: { orderId: string }) {
  const router = useRouter();

  useEffect(() => {
    // We can just use the anon client here since we are only reading the order status publicly
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("id", orderId)
        .single();
        
      if (data && data.payment_status === "captured") {
        router.refresh();
        clearInterval(intervalId);
      }
    };

    // Check every 2 seconds
    intervalId = setInterval(checkStatus, 2000);

    return () => clearInterval(intervalId);
  }, [orderId, router]);

  return null;
}
