"use client";
import { useEffect, useState } from "react";

type Exam = { id: string; name: string; shortName: string; conductedBy: string; examType: string; applicationStart: string | null; applicationEnd: string | null; examDate: string | null; resultDate: string | null; website: string | null; description: string | null; eligibility: string | null };

const TYPE_META: Record<string, { icon: string; color: string; bg: string }> = {
  "UG Engineering": { icon: "⚙️", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-100" },
  "UG Engineering – IITs": { icon: "🏆", color: "text-red-700", bg: "bg-red-50 border-red-100" },
  "PG Engineering / MBA / MCA": { icon: "🎓", color: "text-violet-700", bg: "bg-violet-50 border-violet-100" },
  "UG Medical / Dental": { icon: "🩺", color: "text-rose-700", bg: "bg-rose-50 border-rose-100" },
  "UG All Streams": { icon: "📚", color: "text-blue-700", bg: "bg-blue-50 border-blue-100" },
};

const TYPES = ["UG Engineering", "PG Engineering / MBA / MCA", "UG Medical / Dental", "UG All Streams"];

export default function EntranceExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (activeType) p.set("type", activeType);
    fetch(`/api/entrance-exams?${p}`)
      .then(r => r.json())
      .then(d => { setExams(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, activeType]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Entrance Exams</h1>
          <p className="text-slate-500 text-sm">All major entrance exams for Tamil Nadu college admissions — dates, eligibility, and links.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search exams..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveType("")} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeType === "" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}>All</button>
            {TYPES.map(t => {
              const m = TYPE_META[t] ?? { icon: "📄", color: "text-slate-600", bg: "bg-slate-50 border-slate-100" };
              return (
                <button key={t} onClick={() => setActiveType(activeType === t ? "" : t)} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeType === t ? `${m.bg} ${m.color} border-current` : "bg-white text-slate-600 border-slate-200"}`}>
                  {m.icon} {t}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400"><p className="font-medium">Loading exams...</p></div>
        ) : exams.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-medium text-slate-500">No exams found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {exams.map(exam => {
              const meta = TYPE_META[exam.examType] ?? { icon: "📄", color: "text-slate-600", bg: "bg-slate-50 border-slate-100" };
              return (
                <div key={exam.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all`}>
                  <div className={`flex items-center justify-between px-5 py-3 border-b ${meta.bg}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{meta.icon}</span>
                      <span className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>{exam.examType}</span>
                    </div>
                    <span className="text-2xl font-black text-slate-200 select-none">{exam.shortName}</span>
                  </div>
                  <div className="p-5 bg-white">
                    <h3 className="font-bold text-slate-900 text-base mb-1 leading-snug">{exam.name}</h3>
                    <p className="text-xs text-slate-400 mb-3">by {exam.conductedBy}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { label: "Application", value: exam.applicationStart ? `${exam.applicationStart} – ${exam.applicationEnd}` : "TBA" },
                        { label: "Exam Date", value: exam.examDate ?? "TBA" },
                        { label: "Result", value: exam.resultDate ?? "TBA" },
                      ].map(item => (
                        <div key={item.label} className="bg-slate-50 rounded-xl p-2.5">
                          <p className="text-xs text-slate-400 font-medium mb-0.5">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{item.value}</p>
                        </div>
                      ))}
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
                      <button onClick={() => setExpanded(expanded === exam.id ? null : exam.id)} className="text-xs text-indigo-600 hover:underline font-medium">
                        {expanded === exam.id ? "Show less" : "More details"}
                      </button>
                      {exam.website && (
                        <a href={exam.website} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                          Official site ↗
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
