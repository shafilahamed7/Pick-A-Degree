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
  placements: { placementPercent: number; averagePackage: number | null; highestPackage: number | null }[];
  departments: { name: string; courses: { name: string; annualFee: number | null }[] }[];
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

  const typeColors: Record<string, string> = {
    IIT: "bg-red-50 text-red-700",
    NIT: "bg-orange-50 text-orange-700",
    UNIVERSITY: "bg-blue-50 text-blue-700",
    GOVERNMENT: "bg-green-50 text-green-700",
    AUTONOMOUS: "bg-purple-50 text-purple-700",
    PRIVATE: "bg-gray-100 text-gray-700",
    DEEMED: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Colleges in Tamil Nadu</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search college name, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="">All Types</option>
          {COLLEGE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select
          value={minPlacement}
          onChange={(e) => setMinPlacement(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="">Any Placement %</option>
          <option value="70">70%+</option>
          <option value="80">80%+</option>
          <option value="90">90%+</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading colleges...</div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No colleges found. Try adjusting your filters.</div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{colleges.length} colleges found</p>
          <div className="grid gap-4 md:grid-cols-2">
            {colleges.map((college) => {
              const placement = college.placements[0];
              return (
                <Link
                  key={college.id}
                  href={`/colleges/${college.slug}`}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all block"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="font-semibold text-gray-900 leading-tight">{college.name}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{college.city}, {college.district}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${typeColors[college.type] ?? "bg-gray-100 text-gray-700"}`}>
                      {college.type}
                    </span>
                  </div>

                  {college.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{college.description}</p>
                  )}

                  <div className="flex gap-4 text-sm">
                    {placement && (
                      <>
                        <div>
                          <span className="text-gray-400 text-xs">Placement</span>
                          <div className="font-semibold text-green-700">{placement.placementPercent}%</div>
                        </div>
                        {placement.averagePackage && (
                          <div>
                            <span className="text-gray-400 text-xs">Avg Package</span>
                            <div className="font-semibold text-gray-900">{formatPackage(placement.averagePackage)}</div>
                          </div>
                        )}
                      </>
                    )}
                    {college.nirfRank && (
                      <div>
                        <span className="text-gray-400 text-xs">NIRF Rank</span>
                        <div className="font-semibold text-gray-900">#{college.nirfRank}</div>
                      </div>
                    )}
                    {college.naacGrade && (
                      <div>
                        <span className="text-gray-400 text-xs">NAAC</span>
                        <div className="font-semibold text-blue-700">{college.naacGrade}</div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {college.departments.slice(0, 4).map((d) => (
                      <span key={d.name} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">
                        {d.name}
                      </span>
                    ))}
                    {college.departments.length > 4 && (
                      <span className="text-xs text-gray-400">+{college.departments.length - 4} more</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
