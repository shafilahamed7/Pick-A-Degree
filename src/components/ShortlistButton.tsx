"use client";
import { useEffect, useState } from "react";

type CollegeMin = { id: string; name: string; slug: string; type: string; city: string; district: string; nirfRank?: number | null; naacGrade?: string | null };

export default function ShortlistButton({ college }: { college: CollegeMin }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const list: CollegeMin[] = JSON.parse(localStorage.getItem("pad-shortlist") ?? "[]");
      setSaved(list.some(c => c.slug === college.slug));
    } catch { /* ignore */ }
  }, [college.slug]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const list: CollegeMin[] = JSON.parse(localStorage.getItem("pad-shortlist") ?? "[]");
      const isSaved = list.some(c => c.slug === college.slug);
      const updated = isSaved ? list.filter(c => c.slug !== college.slug) : [...list, college];
      localStorage.setItem("pad-shortlist", JSON.stringify(updated));
      setSaved(!isSaved);
    } catch { /* ignore */ }
  }

  return (
    <button
      onClick={toggle}
      title={saved ? "Remove from shortlist" : "Save to shortlist"}
      className={`transition-all duration-150 ${saved ? "text-rose-500 scale-110" : "text-slate-300 hover:text-rose-400"}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
