"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatPackage } from "@/lib/utils";

type College = {
  id: string;
  name: string;
  slug: string;
  type: string;
  city: string;
  district: string;
  naacGrade: string | null;
  nirfRank: number | null;
  established: number | null;
  website: string | null;
  placements: { placementPercent: number; averagePackage: number | null; highestPackage: number | null; topRecruiters: string[] }[];
  departments: { name: string; courses: { name: string; annualFee: number | null; degreeType: string }[] }[];
  facilities: { name: string }[];
};

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-50 text-red-700",
  NIT: "bg-orange-50 text-orange-700",
  UNIVERSITY: "bg-blue-50 text-blue-700",
  GOVERNMENT: "bg-emerald-50 text-emerald-700",
  AUTONOMOUS: "bg-violet-50 text-violet-700",
  PRIVATE: "bg-slate-100 text-slate-700",
  DEEMED: "bg-teal-50 text-teal-700",
};

function CompareContent() {
  const searchParams = useSearchParams();
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selected, setSelected] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<College[]>([]);

  useEffect(() => {
    fetch("/api/colleges")
      .then((r) => r.json())
      .then((data: College[]) => {
        setAllColleges(data);
        const addSlug = searchParams.get("add");
        if (addSlug) {
          const found = data.find((c) => c.slug === addSlug);
          if (found) setSelected([found]);
        }
      });
  }, [searchParams]);

  const doSearch = useCallback((q: string) => {
    setSearch(q);
    if (!q.trim()) { setResults([]); return; }
    const filtered = allColleges.filter(
      (c) =>
        !selected.find((s) => s.id === c.id) &&
        (c.name.toLowerCase().includes(q.toLowerCase()) || c.city.toLowerCase().includes(q.toLowerCase()))
    );
    setResults(filtered.slice(0, 6));
  }, [allColleges, selected]);

  const addCollege = (c: College) => {
    if (selected.length >= 3 || selected.find((s) => s.id === c.id)) return;
    setSelected((prev) => [...prev, c]);
    setSearch("");
    setResults([]);
  };

  const removeCollege = (id: string) => setSelected((prev) => prev.filter((c) => c.id !== id));

  const rows: { label: string; render: (c: College) => React.ReactNode }[] = [
    { label: "NIRF Rank", render: (c) => c.nirfRank ? <span className="font-semibold text-indigo-700">#{c.nirfRank}</span> : <span className="text-slate-300">—</span> },
    { label: "NAAC Grade", render: (c) => c.naacGrade ? <span className="font-semibold text-slate-900">{c.naacGrade}</span> : <span className="text-slate-300">—</span> },
    { label: "Established", render: (c) => c.established ? <span className="text-slate-700">{c.established}</span> : <span className="text-slate-300">—</span> },
    {
      label: "Placement %", render: (c) => {
        const p = c.placements[0];
        return p ? <span className="font-bold text-emerald-600 text-base">{p.placementPercent}%</span> : <span className="text-slate-300">—</span>;
      }
    },
    {
      label: "Avg package", render: (c) => {
        const p = c.placements[0];
        return p?.averagePackage ? <span className="font-semibold text-slate-900">{formatPackage(p.averagePackage)}</span> : <span className="text-slate-300">—</span>;
      }
    },
    {
      label: "Highest package", render: (c) => {
        const p = c.placements[0];
        return p?.highestPackage ? <span className="font-semibold text-violet-700">{formatPackage(p.highestPackage)}</span> : <span className="text-slate-300">—</span>;
      }
    },
    {
      label: "Top recruiters", render: (c) => {
        const p = c.placements[0];
        return p?.topRecruiters.length ? (
          <div className="flex flex-wrap gap-1">
            {p.topRecruiters.slice(0, 3).map((r) => (
              <span key={r} className="text-xs px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-600">{r}</span>
            ))}
          </div>
        ) : <span className="text-slate-300">—</span>;
      }
    },
    {
      label: "Departments", render: (c) => (
        <div className="flex flex-wrap gap-1">
          {c.departments.slice(0, 3).map((d) => (
            <span key={d.name} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">{d.name}</span>
          ))}
          {c.departments.length > 3 && <span className="text-xs text-slate-400">+{c.departments.length - 3}</span>}
        </div>
      )
    },
    { label: "Facilities", render: (c) => <span className="text-slate-700 text-sm">{c.facilities.length} facilities</span> },
    {
      label: "Website", render: (c) => c.website ? (
        <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline font-medium">Visit ↗</a>
      ) : <span className="text-slate-300">—</span>
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Compare colleges</h1>
          <p className="text-slate-500 text-sm">Select up to 3 colleges for a side-by-side comparison</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Slots */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[0, 1, 2].map((i) => {
            const c = selected[i];
            return (
              <div key={i} className={`rounded-2xl border-2 border-dashed p-5 transition-all ${c ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50/50"}`}>
                {c ? (
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${TYPE_COLORS[c.type] ?? "bg-slate-100 text-slate-700"}`}>
                      {c.name.split(" ").map((w) => w[0]).join("").slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{c.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.city}</p>
                    </div>
                    <button onClick={() => removeCollege(c.id)} className="text-slate-300 hover:text-red-400 transition-colors text-xl leading-none shrink-0">×</button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <div className="text-2xl text-slate-200 mb-1">+</div>
                    <p className="text-xs text-slate-400">Add college {i + 1}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Search */}
        {selected.length < 3 && (
          <div className="relative mb-8 max-w-md">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search to add a college..."
                value={search}
                onChange={(e) => doSearch(e.target.value)}
                className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
              />
            </div>
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden z-20">
                {results.map((c) => (
                  <button key={c.id} onClick={() => addCollege(c)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${TYPE_COLORS[c.type] ?? "bg-slate-100 text-slate-700"}`}>
                      {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.city} · {c.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table */}
        {selected.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 text-slate-400 font-medium w-44 bg-slate-50/50">Criteria</th>
                  {selected.map((c) => (
                    <th key={c.id} className="p-4 text-left border-l border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${TYPE_COLORS[c.type] ?? "bg-slate-100 text-slate-700"}`}>
                          {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-tight">{c.name}</div>
                          <div className="text-xs text-slate-400 font-normal">{c.city}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={row.label} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50/30"}>
                    <td className="p-4 border-r border-slate-50">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{row.label}</span>
                    </td>
                    {selected.map((c) => (
                      <td key={c.id} className="p-4 border-l border-slate-50">{row.render(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected.length === 0 && (
          <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100">
            <div className="text-5xl mb-4">⚖️</div>
            <p className="font-semibold text-slate-500 text-lg mb-1">Start comparing</p>
            <p className="text-sm">Search and add up to 3 colleges above to see a detailed side-by-side comparison.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}
