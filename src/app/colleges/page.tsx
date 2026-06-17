"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DISTRICTS, COLLEGE_TYPES, formatPackage } from "@/lib/utils";

type College = {
  id: string;
  name: string;
  slug: string;
  type: string;
  city: string;
  district: string;
  naacGrade: string | null;
  nirfRank: number | null;
  website: string | null;
  description: string | null;
  placements: { placementPercent: number; averagePackage: number | null; highestPackage: number | null; topRecruiters: string[] }[];
  departments: { name: string; courses: { name: string; annualFee: number | null }[] }[];
};

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-50 text-red-700 border-red-100",
  NIT: "bg-orange-50 text-orange-700 border-orange-100",
  UNIVERSITY: "bg-blue-50 text-blue-700 border-blue-100",
  GOVERNMENT: "bg-emerald-50 text-emerald-700 border-emerald-100",
  AUTONOMOUS: "bg-violet-50 text-violet-700 border-violet-100",
  PRIVATE: "bg-slate-50 text-slate-700 border-slate-100",
  DEEMED: "bg-teal-50 text-teal-700 border-teal-100",
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [type, setType] = useState("");
  const [minPlacement, setMinPlacement] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (district) params.set("district", district);
    if (type) params.set("type", type);
    if (minPlacement) params.set("minPlacement", minPlacement);
    setLoading(true);
    fetch(`/api/colleges?${params}`)
      .then((r) => r.json())
      .then((data) => { setColleges(data); setLoading(false); });
  }, [search, district, type, minPlacement]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Colleges in Tamil Nadu</h1>
          <p className="text-slate-500 text-sm">Find and compare the best colleges across all 38 districts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="flex-1 min-w-52 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search college, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
            />
          </div>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All Types</option>
            {COLLEGE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select
            value={minPlacement}
            onChange={(e) => setMinPlacement(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Any Placement %</option>
            <option value="70">70%+</option>
            <option value="80">80%+</option>
            <option value="90">90%+</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">Loading colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-24 text-slate-400 bg-white rounded-2xl border border-slate-100">
            <div className="text-4xl mb-3">😕</div>
            <p className="font-medium">No colleges found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4 font-medium">{colleges.length} colleges found</p>
            <div className="grid gap-4 md:grid-cols-2">
              {colleges.map((college) => {
                const placement = college.placements[0];
                return (
                  <Link
                    key={college.id}
                    href={`/colleges/${college.slug}`}
                    className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-md transition-all block group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${TYPE_COLORS[college.type] ?? "bg-slate-50 text-slate-700"}`}>
                          {college.name.split(" ").map(w => w[0]).join("").slice(0, 3)}
                        </div>
                        <div>
                          <h2 className="font-semibold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors">{college.name}</h2>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            📍 {college.city}, {college.district}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${TYPE_COLORS[college.type] ?? "bg-slate-50 text-slate-700 border-slate-100"}`}>
                        {college.type}
                      </span>
                    </div>

                    {college.description && (
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{college.description}</p>
                    )}

                    <div className="flex gap-5 mb-3">
                      {placement && (
                        <>
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Placement</div>
                            <div className="text-sm font-bold text-emerald-600">{placement.placementPercent}%</div>
                          </div>
                          {placement.averagePackage && (
                            <div>
                              <div className="text-xs text-slate-400 mb-0.5">Avg package</div>
                              <div className="text-sm font-bold text-slate-900">{formatPackage(placement.averagePackage)}</div>
                            </div>
                          )}
                          {placement.highestPackage && (
                            <div>
                              <div className="text-xs text-slate-400 mb-0.5">Highest</div>
                              <div className="text-sm font-bold text-slate-900">{formatPackage(placement.highestPackage)}</div>
                            </div>
                          )}
                        </>
                      )}
                      {college.nirfRank && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">NIRF Rank</div>
                          <div className="text-sm font-bold text-indigo-600">#{college.nirfRank}</div>
                        </div>
                      )}
                      {college.naacGrade && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">NAAC</div>
                          <div className="text-sm font-bold text-slate-900">{college.naacGrade}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-50">
                      {college.departments.slice(0, 4).map((d) => (
                        <span key={d.name} className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100">
                          {d.name}
                        </span>
                      ))}
                      {college.departments.length > 4 && (
                        <span className="text-xs text-slate-400 px-2 py-1">+{college.departments.length - 4} more</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
