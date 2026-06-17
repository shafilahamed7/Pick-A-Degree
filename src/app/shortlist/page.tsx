"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type SavedCollege = { id: string; name: string; slug: string; type: string; city: string; district: string; nirfRank: number | null; naacGrade: string | null };

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-100 text-red-700", NIT: "bg-orange-100 text-orange-700",
  GOVERNMENT: "bg-emerald-100 text-emerald-700", UNIVERSITY: "bg-blue-100 text-blue-700",
  DEEMED: "bg-violet-100 text-violet-700", AUTONOMOUS: "bg-amber-100 text-amber-700",
  PRIVATE: "bg-slate-100 text-slate-600",
};

export default function ShortlistPage() {
  const [colleges, setColleges] = useState<SavedCollege[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pad-shortlist") ?? "[]");
      setColleges(saved);
    } catch { setColleges([]); }
  }, []);

  function remove(slug: string) {
    const updated = colleges.filter(c => c.slug !== slug);
    setColleges(updated);
    localStorage.setItem("pad-shortlist", JSON.stringify(updated));
  }

  function clearAll() {
    setColleges([]);
    localStorage.removeItem("pad-shortlist");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">My Shortlist</h1>
            <p className="text-slate-500 text-sm">Colleges you saved while browsing. Stored locally on your device.</p>
          </div>
          {colleges.length > 0 && (
            <div className="flex gap-2">
              <Link href={`/compare?ids=${colleges.slice(0, 3).map(c => c.id).join(",")}`} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Compare top 3
              </Link>
              <button onClick={clearAll} className="text-sm text-slate-500 hover:text-red-500 px-3 py-2 rounded-xl border border-slate-200 hover:border-red-200 transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {colleges.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-5xl mb-4">💛</div>
            <p className="font-semibold text-slate-600 text-lg">Your shortlist is empty</p>
            <p className="text-sm mt-2">Click the heart icon on any college to save it here</p>
            <Link href="/colleges" className="mt-6 inline-block bg-indigo-600 text-white text-sm px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Browse colleges →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4 font-medium">{colleges.length} college{colleges.length !== 1 ? "s" : ""} saved</p>
            <div className="grid gap-3 md:grid-cols-2">
              {colleges.map(col => (
                <div key={col.slug} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-start gap-4 hover:border-indigo-200 transition-all group">
                  <div className="flex-1 min-w-0">
                    <Link href={`/colleges/${col.slug}`}>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-1">{col.name}</h3>
                    </Link>
                    <p className="text-xs text-slate-400">{col.city} · {col.district}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[col.type] ?? "bg-slate-100 text-slate-600"}`}>{col.type}</span>
                      {col.nirfRank && <span className="text-xs text-slate-400">NIRF #{col.nirfRank}</span>}
                      {col.naacGrade && <span className="text-xs text-emerald-600 font-semibold">{col.naacGrade}</span>}
                    </div>
                  </div>
                  <button onClick={() => remove(col.slug)} className="text-slate-300 hover:text-red-400 transition-colors text-xl leading-none shrink-0 mt-0.5" title="Remove">×</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
