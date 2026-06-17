"use client";
import { useEffect, useState } from "react";

type Scholarship = { id: string; name: string; provider: string; amount: string; category: string; eligibility: string; deadline: string | null; applyUrl: string | null; description: string | null; isGovernment: boolean };

const CATEGORIES = ["Merit", "BC", "MBC", "SC/ST", "OBC", "Minority", "Defence", "Government Quota", "Merit-cum-Means"];
const CAT_COLORS: Record<string, string> = {
  "Merit": "bg-amber-100 text-amber-700", "BC": "bg-blue-100 text-blue-700",
  "MBC": "bg-indigo-100 text-indigo-700", "SC/ST": "bg-purple-100 text-purple-700",
  "OBC": "bg-cyan-100 text-cyan-700", "Minority": "bg-teal-100 text-teal-700",
  "Defence": "bg-red-100 text-red-700", "Government Quota": "bg-emerald-100 text-emerald-700",
  "Merit-cum-Means": "bg-orange-100 text-orange-700",
};

export default function ScholarshipsPage() {
  const [items, setItems] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [govOnly, setGovOnly] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (category) p.set("category", category);
    if (govOnly) p.set("gov", "1");
    fetch(`/api/scholarships?${p}`)
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, category, govOnly]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Scholarship Finder</h1>
          <p className="text-slate-500 text-sm">Government and private scholarships available for Tamil Nadu college students.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search scholarships..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <select value={category} onChange={e => setCategory(e.target.value)} className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white text-slate-700">
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => setGovOnly(!govOnly)} className={`text-xs px-3 py-2 rounded-xl border font-medium transition-all ${govOnly ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}>
              🏛️ Govt. only
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400"><p className="font-medium">Loading scholarships...</p></div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">🎓</div>
            <p className="font-medium text-slate-500">No scholarships found</p>
            <button onClick={() => { setSearch(""); setCategory(""); setGovOnly(false); }} className="mt-3 text-sm text-indigo-600 hover:underline font-medium">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4 font-medium">{items.length} scholarship{items.length !== 1 ? "s" : ""} found</p>
            <div className="space-y-3">
              {items.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="w-full text-left p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLORS[s.category] ?? "bg-slate-100 text-slate-600"}`}>{s.category}</span>
                          {s.isGovernment && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">🏛️ Government</span>}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{s.name}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{s.provider}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold text-emerald-600">{s.amount}</p>
                        {s.deadline && <p className="text-xs text-slate-400 mt-0.5">Deadline: {s.deadline}</p>}
                      </div>
                    </div>
                  </button>
                  {expanded === s.id && (
                    <div className="px-5 pb-5 border-t border-slate-50 pt-4 space-y-3">
                      {s.description && <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>}
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Eligibility</p>
                        <p className="text-sm text-slate-700">{s.eligibility}</p>
                      </div>
                      {s.applyUrl && (
                        <a href={s.applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-semibold">
                          Apply Now ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
