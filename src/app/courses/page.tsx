"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatFee } from "@/lib/utils";

type Course = {
  id: string;
  name: string;
  degreeType: string;
  duration: number;
  annualFee: number | null;
  totalSeats: number | null;
  department: {
    name: string;
    college: {
      id: string;
      name: string;
      slug: string;
      type: string;
      city: string;
    };
  };
};

const DEGREE_OPTIONS = [
  { value: "", label: "All Degrees" },
  { value: "BTECH", label: "B.Tech" },
  { value: "BE", label: "B.E" },
  { value: "MBBS", label: "MBBS" },
  { value: "BDS", label: "BDS" },
  { value: "BSC", label: "B.Sc" },
  { value: "MTECH", label: "M.Tech" },
  { value: "ME", label: "M.E" },
  { value: "MBA", label: "MBA" },
  { value: "MCA", label: "MCA" },
  { value: "MSC", label: "M.Sc" },
  { value: "MD", label: "MD" },
  { value: "PHD", label: "Ph.D" },
  { value: "UG", label: "UG (all)" },
  { value: "PG", label: "PG (all)" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "RESEARCH", label: "Research" },
];

const DEGREE_COLORS: Record<string, string> = {
  UG: "bg-blue-50 text-blue-700",
  PG: "bg-violet-50 text-violet-700",
  DIPLOMA: "bg-amber-50 text-amber-700",
  RESEARCH: "bg-slate-100 text-slate-700",
  INTEGRATED: "bg-teal-50 text-teal-700",
};

const COLLEGE_TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-50 text-red-700",
  NIT: "bg-orange-50 text-orange-700",
  UNIVERSITY: "bg-blue-50 text-blue-700",
  GOVERNMENT: "bg-emerald-50 text-emerald-700",
  AUTONOMOUS: "bg-violet-50 text-violet-700",
  PRIVATE: "bg-slate-100 text-slate-700",
  DEEMED: "bg-teal-50 text-teal-700",
};

function getDegreeLabel(course: Course): string {
  const n = course.name;
  if (n.includes("B.Tech")) return "B.Tech";
  if (n.includes("B.E")) return "B.E";
  if (n.includes("MBBS")) return "MBBS";
  if (n.includes("BDS")) return "BDS";
  if (n.includes("M.Tech")) return "M.Tech";
  if (n.includes("M.E")) return "M.E";
  if (n.includes("MBA")) return "MBA";
  if (n.includes("MCA")) return "MCA";
  if (n.includes("Ph.D") || n.includes("PhD")) return "Ph.D";
  if (n.includes("MD")) return "MD";
  if (n.includes("M.Sc")) return "M.Sc";
  if (n.includes("B.Sc")) return "B.Sc";
  return course.degreeType;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [degree, setDegree] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (degree) params.set("degree", degree);
    setLoading(true);
    fetch(`/api/courses?${params}`)
      .then((r) => r.json())
      .then((data) => { setCourses(data); setLoading(false); });
  }, [debouncedSearch, degree]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Courses in Tamil Nadu</h1>
          <p className="text-slate-500 text-sm">Browse courses across all colleges — filter by degree to find what you need</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="flex-1 min-w-52 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search course name, department, college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
            />
          </div>
          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-36"
          >
            {DEGREE_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Quick degree pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {["", "BTECH", "BE", "MBBS", "MBA", "MTECH", "PHD"].map((v) => {
            const label = DEGREE_OPTIONS.find((d) => d.value === v)?.label ?? "All";
            return (
              <button
                key={v}
                onClick={() => setDegree(v)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  degree === v
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400">
            <div className="text-4xl mb-3">📚</div>
            <p className="font-medium">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">😕</div>
            <p className="font-medium text-slate-500">No courses found for this filter</p>
            <p className="text-sm mt-1">Try a different degree or search term</p>
            <button onClick={() => { setDegree(""); setSearch(""); }}
              className="mt-4 text-sm text-indigo-600 hover:underline font-medium">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4 font-medium">
              {courses.length} course{courses.length !== 1 ? "s" : ""} found
              {degree ? ` · ${DEGREE_OPTIONS.find((d) => d.value === degree)?.label}` : ""}
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const degreeLabel = getDegreeLabel(course);
                const colorClass = DEGREE_COLORS[course.degreeType] ?? "bg-slate-100 text-slate-600";
                return (
                  <Link
                    key={course.id}
                    href={`/colleges/${course.department.college.slug}`}
                    className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-md transition-all block group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-indigo-700 transition-colors">
                        {course.name}
                      </h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${colorClass}`}>
                        {degreeLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3">{course.department.name}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${COLLEGE_TYPE_COLORS[course.department.college.type] ?? "bg-slate-100 text-slate-600"}`}>
                        {course.department.college.name[0]}
                      </div>
                      <span className="text-xs text-slate-700 font-medium truncate">{course.department.college.name}</span>
                      <span className="text-xs text-slate-400 shrink-0">· {course.department.college.city}</span>
                    </div>

                    <div className="flex gap-4 pt-3 border-t border-slate-50 text-xs text-slate-400">
                      <span>{course.duration} yr</span>
                      {course.totalSeats && <span>{course.totalSeats} seats</span>}
                      {course.annualFee && (
                        <span className="text-indigo-600 font-semibold ml-auto">{formatFee(course.annualFee)}/yr</span>
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
