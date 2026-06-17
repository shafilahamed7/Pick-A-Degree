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

const DEGREE_COLORS: Record<string, string> = {
  BTECH: "bg-blue-50 text-blue-700",
  BE: "bg-indigo-50 text-indigo-700",
  MTECH: "bg-violet-50 text-violet-700",
  ME: "bg-purple-50 text-purple-700",
  MBA: "bg-amber-50 text-amber-700",
  MCA: "bg-orange-50 text-orange-700",
  BSC: "bg-emerald-50 text-emerald-700",
  MSC: "bg-teal-50 text-teal-700",
  MBBS: "bg-red-50 text-red-700",
  BDS: "bg-rose-50 text-rose-700",
  PHD: "bg-slate-100 text-slate-700",
};

const DEGREE_OPTIONS = [
  { value: "", label: "All degrees" },
  { value: "BTECH", label: "B.Tech" },
  { value: "BE", label: "B.E" },
  { value: "MTECH", label: "M.Tech" },
  { value: "MBA", label: "MBA" },
  { value: "MCA", label: "MCA" },
  { value: "MBBS", label: "MBBS" },
  { value: "BSC", label: "B.Sc" },
  { value: "MSC", label: "M.Sc" },
  { value: "PHD", label: "Ph.D" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [degree, setDegree] = useState("");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => { setCourses(data); setLoading(false); });
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.department.name.toLowerCase().includes(search.toLowerCase()) ||
      c.department.college.name.toLowerCase().includes(search.toLowerCase());
    const matchDegree = !degree || c.degreeType === degree;
    return matchSearch && matchDegree;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Courses in Tamil Nadu</h1>
          <p className="text-slate-500 text-sm">Browse 5,000+ courses across all colleges and disciplines</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="flex-1 min-w-52 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search course, department, college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
            />
          </div>
          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {DEGREE_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400">
            <div className="text-4xl mb-3">📚</div>
            <p className="font-medium">Loading courses...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">😕</div>
            <p className="font-medium">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4 font-medium">{filtered.length} courses found</p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <Link
                  key={course.id}
                  href={`/colleges/${course.department.college.slug}`}
                  className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-md transition-all block group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-indigo-700 transition-colors">
                      {course.name}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${DEGREE_COLORS[course.degreeType] ?? "bg-slate-100 text-slate-600"}`}>
                      {course.degreeType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">{course.department.name}</p>

                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      {course.department.college.name[0]}
                    </div>
                    <span className="text-xs text-slate-600 font-medium truncate">{course.department.college.name}</span>
                  </div>

                  <div className="flex gap-4 pt-3 border-t border-slate-50 text-xs text-slate-400">
                    <span>{course.duration} yr</span>
                    {course.totalSeats && <span>{course.totalSeats} seats</span>}
                    {course.annualFee && (
                      <span className="text-indigo-600 font-semibold ml-auto">{formatFee(course.annualFee)}/yr</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
