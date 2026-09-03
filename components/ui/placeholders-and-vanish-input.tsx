"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    setValue(""); // Simulate vanish effect
  };

  return (
    <form
      className="w-full max-w-2xl relative mx-auto bg-slate-900 border border-slate-800 rounded-full overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.15)] focus-within:shadow-[0_0_60px_rgba(79,70,229,0.3)] transition-shadow duration-500"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e);
        }}
        className="w-full h-16 pl-8 pr-20 bg-transparent text-white text-lg outline-none z-10 relative placeholder-transparent"
      />
      <AnimatePresence mode="wait">
        {!value && (
          <motion.p
            initial={{ y: 5, opacity: 0 }}
            key={`current-placeholder-${currentPlaceholder}`}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }}
            className="text-slate-500 text-lg absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            {placeholders[currentPlaceholder]}
          </motion.p>
        )}
      </AnimatePresence>
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-colors z-20 group"
      >
        <svg className="transform group-hover:scale-110 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>
    </form>
  );
}
