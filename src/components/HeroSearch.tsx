"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const q = query.trim();
    router.push(q ? `/colleges?search=${encodeURIComponent(q)}` : "/colleges");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
      <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-white/30 transition-all">
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search colleges, courses, districts..."
          className="bg-transparent text-white placeholder-slate-400 text-sm outline-none w-full"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm whitespace-nowrap"
      >
        Explore colleges →
      </button>
    </div>
  );
}
