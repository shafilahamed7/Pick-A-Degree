"use client";
import { useEffect, useState } from "react";

type Exam = {
  id: string; name: string; shortName: string; conductedBy: string;
  examType: string; applicationStart: string | null; applicationEnd: string | null;
  examDate: string | null; resultDate: string | null; website: string | null;
  description: string | null; eligibility: string | null;
};

const TYPE_META: Record<string, { icon: string; color: string; bg: string }> = {
  "School / Board":          { icon: "🏫", color: "text-sky-700",    bg: "bg-sky-50 border-sky-100" },
  "Olympiad / Talent":       { icon: "🏅", color: "text-amber-700",  bg: "bg-amber-50 border-amber-100" },
  "UG Engineering":          { icon: "⚙️", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-100" },
  "UG Engineering – IITs":   { icon: "🏆", color: "text-red-700",    bg: "bg-red-50 border-red-100" },
  "UG Medical / Dental":     { icon: "🩺", color: "text-rose-700",   bg: "bg-rose-50 border-rose-100" },
  "UG Law":                  { icon: "⚖️", color: "text-teal-700",   bg: "bg-teal-50 border-teal-100" },
  "UG All Streams":          { icon: "📚", color: "text-blue-700",   bg: "bg-blue-50 border-blue-100" },
  "PG Engineering / MBA / MCA": { icon: "🎓", color: "text-violet-700", bg: "bg-violet-50 border-violet-100" },
  "PG Medical":              { icon: "🏥", color: "text-pink-700",   bg: "bg-pink-50 border-pink-100" },
  "Defence":                 { icon: "🪖", color: "text-green-800",  bg: "bg-green-50 border-green-100" },
  "Past Results":            { icon: "📋", color: "text-slate-700",  bg: "bg-slate-50 border-slate-200" },
};

const UPCOMING_TYPES = [
  "School / Board", "Olympiad / Talent",
  "UG Engineering", "UG Engineering – IITs", "UG Medical / Dental",
  "UG Law", "UG All Streams",
  "PG Engineering / MBA / MCA", "PG Medical", "Defence",
];

export default function EntranceExamsPage() {
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("");
  const [tab, setTab] = useState<"upcoming" | "results">("upcoming");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/entrance-exams")
      .then(r => r.json())
      .then(d => { setAllExams(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const isResults = (e: Exam) => e.examType === "Past Results";

  const filtered = allExams.filter(e => {
    if (tab === "upcoming" && isResults(e)) return false;
    if (tab === "results" && !isResults(e)) return false;
    const q = search.toLowerCase();
    if (q && !e.name.toLowerCase().includes(q) && !e.shortName.toLowerCase().includes(q) && !(e.description ?? "").toLowerCase().includes(q)) return false;
    if (activeType && e.examType !== activeType) return false;
    return true;
  });

  const upcomingCount = allExams.filter(e => !isResults(e)).length;
  const resultsCount  = allExams.filter(e =>  isResults(e)).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Entrance Exams</h1>
          <p className="text-slate-500 text-sm">School boards, olympiads, engineering, medical, law, defence — upcoming exams &amp; check past results.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setTab("upcoming"); setActiveType(""); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === "upcoming" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"}`}
          >
            📅 Upcoming Exams
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tab === "upcoming" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{upcomingCount}</span>
          </button>
          <button
            onClick={() => { setTab("results"); setActiveType(""); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === "results" ? "bg-emerald-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"}`}
          >
            ✅ Check Results
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tab === "results" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{resultsCount}</span>
          </button>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text" placeholder="Search exams…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
            />
          </div>
          {tab === "upcoming" && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveType("")}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeType === "" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}
              >All</button>
              {UPCOMING_TYPES.map(t => {
                const m = TYPE_META[t] ?? { icon: "📄", color: "text-slate-600", bg: "bg-slate-50" };
                return (
                  <button
                    key={t}
                    onClick={() => setActiveType(activeType === t ? "" : t)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeType === t ? `${m.bg} ${m.color}` : "bg-white text-slate-600 border-slate-200"}`}
                  >
                    {m.icon} {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {tab === "results" && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Past 18 Months — Results Available</p>
              <p className="text-xs text-emerald-700 mt-0.5">Click the official site button to check your scorecard/rank on the exam authority's website. Have your application number and date of birth ready.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-24 text-slate-400"><p className="font-medium">Loading exams…</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-medium text-slate-500">No exams found</p>
            <p className="text-sm mt-1">Try clearing filters or searching differently.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map(exam => {
              const meta = TYPE_META[exam.examType] ?? { icon: "📄", color: "text-slate-600", bg: "bg-slate-50 border-slate-100" };
              const isPast = exam.examType === "Past Results";
              return (
                <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className={`flex items-center justify-between px-5 py-3 border-b ${meta.bg}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{meta.icon}</span>
                      <span className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>{exam.examType}</span>
                    </div>
                    {isPast && (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">✓ Results Out</span>
                    )}
                    {!isPast && (
                      <span className="text-2xl font-black text-slate-200 select-none">{exam.shortName}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-base mb-1 leading-snug">{exam.name}</h3>
                    <p className="text-xs text-slate-400 mb-3">by {exam.conductedBy}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {isPast ? (
                        <>
                          <div className="bg-slate-50 rounded-xl p-2.5 col-span-2">
                            <p className="text-xs text-slate-400 font-medium mb-0.5">Exam Date</p>
                            <p className="text-sm font-semibold text-slate-800">{exam.examDate ?? "—"}</p>
                          </div>
                          <div className="bg-emerald-50 rounded-xl p-2.5 col-span-2 border border-emerald-100">
                            <p className="text-xs text-emerald-600 font-medium mb-0.5">Result Status</p>
                            <p className="text-sm font-semibold text-emerald-800">{exam.resultDate ?? "—"}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-slate-50 rounded-xl p-2.5">
                            <p className="text-xs text-slate-400 font-medium mb-0.5">Application</p>
                            <p className="text-sm font-semibold text-slate-800 leading-tight">
                              {exam.applicationStart ? `${exam.applicationStart} – ${exam.applicationEnd}` : "TBA"}
                            </p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-2.5">
                            <p className="text-xs text-slate-400 font-medium mb-0.5">Exam Date</p>
                            <p className="text-sm font-semibold text-slate-800 leading-tight">{exam.examDate ?? "TBA"}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-2.5 col-span-2">
                            <p className="text-xs text-slate-400 font-medium mb-0.5">Result</p>
                            <p className="text-sm font-semibold text-slate-800">{exam.resultDate ?? "TBA"}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {expanded === exam.id && (
                      <div className="mb-4 space-y-2">
                        {exam.description && <p className="text-sm text-slate-600 leading-relaxed">{exam.description}</p>}
                        {exam.eligibility && (
                          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                            <p className="text-xs font-semibold text-amber-700 mb-1">Eligibility</p>
                            <p className="text-sm text-slate-700">{exam.eligibility}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpanded(expanded === exam.id ? null : exam.id)}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        {expanded === exam.id ? "Show less" : "More details"}
                      </button>
                      {exam.website && (
                        <a
                          href={exam.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`ml-auto text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${isPast ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                        >
                          {isPast ? "Check Result ↗" : "Official site ↗"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
