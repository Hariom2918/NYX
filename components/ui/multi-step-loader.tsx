"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = false,
}: {
  loadingStates: { text: string }[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);
    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl bg-slate-950/80">
      <div className="w-full max-w-xl mx-auto px-4 relative h-64 flex flex-col items-center justify-center">
        {loadingStates.map((state, index) => {
          const distance = Math.abs(index - currentState);
          const opacity = Math.max(1 - distance * 0.2, 0);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity, y: (index - currentState) * 40 }}
              className={cn(
                "flex items-center gap-4 py-2 absolute transition-all duration-500 ease-in-out w-full justify-center",
                index === currentState ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                {index < currentState ? (
                  <CheckIcon className="w-6 h-6 text-green-500" />
                ) : index === currentState ? (
                  <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-slate-800" />
                )}
              </div>
              <span className={cn(
                "text-lg sm:text-xl font-medium",
                index === currentState ? "text-white" : "text-slate-500"
              )}>
                {state.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
