"use client";
import React from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useRouter } from "next/navigation";

export function EventSearchBar() {
  const router = useRouter();
  const placeholders = [
    "Search Coachella 2027...",
    "Find stand-up comedy near you...",
    "Broadway theater tickets...",
    "Formula 1 Grand Prix access...",
    "Local jazz festivals tonight..."
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Just a UI demo for the landing page
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/tickets");
  };

  return (
    <div className="h-[20rem] flex flex-col justify-center items-center px-4 w-full max-w-4xl mx-auto rounded-xl">
      <h2 className="mb-10 text-3xl sm:text-5xl dark:text-white text-black font-display font-bold text-center">
        Discover Your Next Unforgettable Experience
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
