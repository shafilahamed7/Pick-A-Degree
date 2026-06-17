"use client";

import { useEffect, useState } from "react";
import { formatPackage, formatFee } from "@/lib/utils";

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
  placements: { placementPercent: number; averagePackage: number | null; highestPackage: number | null; topRecruiters: string[] }[];
  departments: { name: string; courses: { name: string; annualFee: number | null; degreeType: string }[] }[];
  facilities: { name: string }[];
};

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selected, setSelected] = useState<College[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/colleges").then((r) => r.json()).then(setAllColleges);
  }, []);

  const filtered = allColleges.filter(
    (c) =>
      !selected.find((s) => s.id === c.id) &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  function addCollege(college: College) {
    if (selected.length < 3) setSelected([...selected, college]);
  }

  function remove(id: string) {
    setSelected(selected.filter((c) => c.id !== id));
  }

  const rows = [
    { label: "Type", key: (c: College) => c.type },
    { label: "Location", key: (c: College) => `${c.city}, ${c.district}` },
    { label: "Established", key: (c: College) => c.established ?? "—" },
    { label: "NAAC Grade", key: (c: College) => c.naacGrade ?? "—" },
    { label: "NIRF Rank", key: (c: College) => c.nirfRank ? `#${c.nirfRank}` : "—" },
    { label: "Placement %", key: (c: College) => c.placements[0] ? `${c.placements[0].placementPercent}%` : "—" },
    { label: "Avg Package", key: (c: College) => c.placements[0]?.averagePackage ? formatPackage(c.placements[0].averagePackage) : "—" },
    { label: "Highest Package", key: (c: College) => c.placements[0]?.highestPackage ? formatPackage(c.placements[0].highestPackage) : "—" },
    { label: "Departments", key: (c: College) => c.departments.length },
    { label: "Facilities", key: (c: College) => c.facilities.map((f) => f.name).join(", ") || "—" },
    { label: "Top Recruiters", key: (c: College) => c.placements[0]?.topRecruiters.slice(0, 3).join(", ") || "—" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Compare Colleges</h1>
      <p className="text-sm text-gray-500 mb-6">Select up to 3 colleges to compare side by side.</p>

      {/* Search to add */}
      {selected.length < 3 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <input
            type="text"
            placeholder="Search and add a college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {search && (
            <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
              {filtered.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  onClick={() => { addCollege(c); setSearch(""); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 text-gray-700 transition-colors"
                >
                  <span className="font-medium">{c.name}</span>{" "}
                  <span className="text-gray-400">— {c.city} ({c.type})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selected.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100">
          Search and add colleges above to start comparing.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-gray-500 font-medium w-40">Criteria</th>
                {selected.map((c) => (
                  <th key={c.id} className="p-4 text-left">
                    <div className="font-semibold text-gray-900 leading-tight">{c.name}</div>
                    <button
                      onClick={() => remove(c.id)}
                      className="text-xs text-red-400 hover:text-red-600 mt-1"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-4 font-medium text-gray-600">{row.label}</td>
                  {selected.map((c) => (
                    <td key={c.id} className="p-4 text-gray-900">
                      {String(row.key(c))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
