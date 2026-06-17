"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  department: string;
  jobType: string;
  staffCategory: string;
  qualification: string;
  experience: string | null;
  salary: string | null;
  lastDate: string | null;
  description: string | null;
  applyUrl: string | null;
  college: { id: string; name: string; slug: string; type: string; city: string };
};

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  VISITING: "Visiting",
  GUEST: "Guest",
};

const JOB_TYPE_COLORS: Record<string, string> = {
  FULL_TIME: "bg-emerald-50 text-emerald-700",
  PART_TIME: "bg-blue-50 text-blue-700",
  CONTRACT: "bg-amber-50 text-amber-700",
  VISITING: "bg-violet-50 text-violet-700",
  GUEST: "bg-slate-100 text-slate-600",
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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (jobType) params.set("jobType", jobType);
    setLoading(true);
    fetch(`/api/jobs?${params}`)
      .then((r) => r.json())
      .then((data) => { setJobs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setJobs([]); setLoading(false); });
  }, [search, category, jobType]);

  const daysLeft = (date: string | null) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    if (diff < 0) return "Closed";
    if (diff === 0) return "Last day!";
    return `${diff} days left`;
  };

  const daysClass = (date: string | null) => {
    if (!date) return "";
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    if (diff < 0) return "text-red-500";
    if (diff <= 3) return "text-amber-600 font-semibold";
    return "text-slate-400";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Faculty & Staff Openings</h1>
          <p className="text-slate-500 text-sm">Teaching and non-teaching positions across Tamil Nadu colleges</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="flex-1 min-w-52 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search job title, department, college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All staff</option>
            <option value="TEACHING">Teaching</option>
            <option value="NON_TEACHING">Non-Teaching</option>
          </select>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="VISITING">Visiting</option>
            <option value="GUEST">Guest</option>
          </select>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 mb-5">
          <button onClick={() => setCategory("")}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${category === "" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200"}`}>
            All
          </button>
          <button onClick={() => setCategory("TEACHING")}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${category === "TEACHING" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200"}`}>
            🎓 Teaching
          </button>
          <button onClick={() => setCategory("NON_TEACHING")}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${category === "NON_TEACHING" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200"}`}>
            🏢 Non-Teaching
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400">
            <div className="text-4xl mb-3">💼</div>
            <p className="font-medium">Loading openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">😕</div>
            <p className="font-medium">No openings found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4 font-medium">{jobs.length} opening{jobs.length !== 1 ? "s" : ""} found</p>
            <div className="space-y-3">
              {jobs.map((job) => {
                const isOpen = expanded === job.id;
                const deadline = daysLeft(job.lastDate);
                return (
                  <div key={job.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-100 transition-all">
                    {/* Card header */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : job.id)}
                      className="w-full text-left p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${job.staffCategory === "TEACHING" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700"}`}>
                              {job.staffCategory === "TEACHING" ? "🎓 Teaching" : "🏢 Non-Teaching"}
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${JOB_TYPE_COLORS[job.jobType] ?? "bg-slate-100 text-slate-600"}`}>
                              {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{job.title}</h3>
                          <p className="text-sm text-slate-500">{job.department}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-xs ${daysClass(job.lastDate)}`}>
                            {deadline ?? ""}
                          </div>
                          <div className="text-slate-300 text-lg mt-1">{isOpen ? "▲" : "▼"}</div>
                        </div>
                      </div>

                      {/* College row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${COLLEGE_TYPE_COLORS[job.college.type] ?? "bg-slate-100 text-slate-600"}`}>
                            {job.college.name[0]}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{job.college.name}</span>
                          <span className="text-xs text-slate-400">· {job.college.city}</span>
                        </div>
                        {job.salary && (
                          <span className="text-sm font-semibold text-emerald-600">{job.salary}</span>
                        )}
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-slate-50">
                        <div className="grid md:grid-cols-2 gap-4 mt-4 mb-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Qualification</p>
                            <p className="text-sm text-slate-700">{job.qualification}</p>
                          </div>
                          {job.experience && (
                            <div>
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Experience</p>
                              <p className="text-sm text-slate-700">{job.experience}</p>
                            </div>
                          )}
                          {job.lastDate && (
                            <div>
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Last date to apply</p>
                              <p className="text-sm text-slate-700 font-semibold">
                                {new Date(job.lastDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                              </p>
                            </div>
                          )}
                        </div>
                        {job.description && (
                          <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-600 leading-relaxed">
                            {job.description}
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Link href={`/colleges/${job.college.slug}`}
                            className="text-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                            View college
                          </Link>
                          {job.applyUrl ? (
                            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                              className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-semibold">
                              Apply now →
                            </a>
                          ) : (
                            <Link href={`/colleges/${job.college.slug}`}
                              className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-semibold">
                              Apply via college →
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
