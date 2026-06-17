"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type College = { id: string; name: string; slug: string; type: string; city: string; district: string; naacGrade: string | null; nirfRank: number; website: string | null; established: number | null };

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-100 text-red-700", NIT: "bg-orange-100 text-orange-700",
  GOVERNMENT: "bg-emerald-100 text-emerald-700", UNIVERSITY: "bg-blue-100 text-blue-700",
  DEEMED: "bg-violet-100 text-violet-700", AUTONOMOUS: "bg-amber-100 text-amber-700",
  PRIVATE: "bg-slate-100 text-slate-600",
};

const NAAC_COLORS: Record<string, string> = {
  "A++": "bg-emerald-500 text-white", "A+": "bg-green-500 text-white",
  "A": "bg-teal-500 text-white", "B++": "bg-blue-500 text-white",
  "B+": "bg-indigo-400 text-white", "B": "bg-slate-400 text-white",
};

const TYPES = ["IIT", "NIT", "GOVERNMENT", "DEEMED", "UNIVERSITY", "AUTONOMOUS", "PRIVATE"];

export default function RankingsPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("");

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (activeType) p.set("type", activeType);
    fetch(`/api/rankings?${p}`)
      .then(r => r.json())
      .then(d => { setColleges(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeType]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">College Rankings</h1>
          <p className="text-slate-500 text-sm">NIRF 2025 rankings for Tamil Nadu colleges. Source: National Institutional Ranking Framework.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveType("")} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeType === "" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}>All</button>
          {TYPES.map(t => (
            <button key={t} onClick={() => setActiveType(activeType === t ? "" : t)} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeType === t ? `${TYPE_COLORS[t]} border-current` : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400"><p className="font-medium">Loading rankings...</p></div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <p className="font-medium text-slate-500">No ranked colleges found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-16">Rank</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">College</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">City</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">NAAC</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((col, i) => (
                  <tr key={col.id} className={`border-b border-slate-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${col.nirfRank <= 10 ? "bg-amber-100 text-amber-700" : col.nirfRank <= 50 ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                        {col.nirfRank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/colleges/${col.slug}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                        {col.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5 md:hidden">{col.city} · {col.type}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[col.type] ?? "bg-slate-100 text-slate-600"}`}>{col.type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{col.city}</td>
                    <td className="px-4 py-3">
                      {col.naacGrade ? (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${NAAC_COLORS[col.naacGrade] ?? "bg-slate-100 text-slate-600"}`}>{col.naacGrade}</span>
                      ) : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-4 text-center">Rankings based on NIRF 2025 data. Only colleges with submitted NIRF data are shown.</p>
      </div>
    </div>
  );
}
