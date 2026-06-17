"use client";
import { useState } from "react";
import Link from "next/link";

type College = { id: string; name: string; slug: string; type: string; city: string; district: string; website: string | null; nirfRank: number | null; naacGrade: string | null };

const BRANCHES = ["Computer Science Engineering", "Electronics & Communication Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Information Technology", "Chemical Engineering", "Biomedical Engineering", "Automobile Engineering", "Artificial Intelligence & Data Science"];
const DISTRICTS = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", "Thanjavur", "Any district"];
const TYPES = ["Government / NIT / IIT", "Deemed University", "Autonomous College", "Private College", "Any type"];

const BUDGET_RANGES = [
  { label: "Under ₹50,000/year", max: 50000 },
  { label: "₹50k – ₹1 lakh/year", max: 100000 },
  { label: "₹1 lakh – ₹2 lakh/year", max: 200000 },
  { label: "₹2 lakh – ₹5 lakh/year", max: 500000 },
  { label: "Above ₹5 lakh/year", max: 9999999 },
];

const PRIORITIES = ["Good placements", "Low fee", "Good research", "Campus life", "Close to home", "NIRF ranking", "NAAC grade"];

type Step = "branch" | "district" | "budget" | "type" | "priority" | "result";

export default function RecommendPage() {
  const [step, setStep] = useState<Step>("branch");
  const [branch, setBranch] = useState("");
  const [district, setDistrict] = useState("");
  const [budget, setBudget] = useState("");
  const [colType, setColType] = useState("");
  const [priority, setPriority] = useState("");
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  const steps: Step[] = ["branch", "district", "budget", "type", "priority", "result"];
  const stepIdx = steps.indexOf(step);
  const progress = ((stepIdx) / (steps.length - 1)) * 100;

  const STEP_LABELS: Record<Step, string> = {
    branch: "Preferred Branch", district: "Preferred Location",
    budget: "Annual Budget", type: "College Type", priority: "Your Priority", result: "Results",
  };

  async function getRecommendations() {
    setLoading(true);
    try {
      const typeMap: Record<string, string> = {
        "Government / NIT / IIT": "GOVERNMENT",
        "Deemed University": "DEEMED",
        "Autonomous College": "AUTONOMOUS",
        "Private College": "PRIVATE",
      };
      const params = new URLSearchParams();
      if (district && district !== "Any district") params.set("district", district);
      if (colType && colType !== "Any type") params.set("type", typeMap[colType] ?? "");
      const r = await fetch(`/api/colleges?${params}`);
      const data = await r.json();
      const budgetMax = BUDGET_RANGES.find(b => b.label === budget)?.max ?? 9999999;

      let filtered: College[] = Array.isArray(data) ? data : [];

      // Sort by priority
      if (priority === "Good placements" || priority === "NIRF ranking") {
        filtered.sort((a, b) => (a.nirfRank ?? 9999) - (b.nirfRank ?? 9999));
      } else if (priority === "Low fee") {
        filtered.sort((a, b) => (a.nirfRank ?? 9999) - (b.nirfRank ?? 9999));
      } else if (priority === "NAAC grade") {
        const gradeOrder = ["A++", "A+", "A", "B++", "B+", "B", "C"];
        filtered.sort((a, b) => (gradeOrder.indexOf(a.naacGrade ?? "C")) - (gradeOrder.indexOf(b.naacGrade ?? "C")));
      }

      setResults(filtered.slice(0, 10));
      setStep("result");
    } catch (e) {
      setResults([]);
      setStep("result");
    }
    setLoading(false);
  }

  const TYPE_COLORS: Record<string, string> = {
    IIT: "bg-red-100 text-red-700", NIT: "bg-orange-100 text-orange-700",
    GOVERNMENT: "bg-emerald-100 text-emerald-700", UNIVERSITY: "bg-blue-100 text-blue-700",
    DEEMED: "bg-violet-100 text-violet-700", AUTONOMOUS: "bg-amber-100 text-amber-700",
    PRIVATE: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-slate-900">College Recommendation Quiz</h1>
          <p className="text-slate-500 text-sm mt-1">Answer 5 quick questions to find your ideal college</p>
          {step !== "result" && (
            <div className="mt-4 bg-slate-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        {step === "branch" && (
          <QuizStep title="Which branch interests you?" subtitle="Choose your preferred engineering stream">
            <div className="grid grid-cols-2 gap-2">
              {BRANCHES.map(b => (
                <button key={b} onClick={() => setBranch(b)} className={`text-sm px-4 py-3 rounded-xl border text-left font-medium transition-all ${branch === b ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"}`}>{b}</button>
              ))}
            </div>
            <NavBtn disabled={!branch} onNext={() => setStep("district")} />
          </QuizStep>
        )}

        {step === "district" && (
          <QuizStep title="Preferred location?" subtitle="Where do you want to study in Tamil Nadu?">
            <div className="grid grid-cols-2 gap-2">
              {DISTRICTS.map(d => (
                <button key={d} onClick={() => setDistrict(d)} className={`text-sm px-4 py-3 rounded-xl border text-left font-medium transition-all ${district === d ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"}`}>{d}</button>
              ))}
            </div>
            <NavBtn disabled={!district} onNext={() => setStep("budget")} onBack={() => setStep("branch")} />
          </QuizStep>
        )}

        {step === "budget" && (
          <QuizStep title="What's your annual budget?" subtitle="Total tuition fee you can afford per year">
            <div className="space-y-2">
              {BUDGET_RANGES.map(b => (
                <button key={b.label} onClick={() => setBudget(b.label)} className={`w-full text-sm px-4 py-4 rounded-xl border text-left font-medium transition-all ${budget === b.label ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"}`}>{b.label}</button>
              ))}
            </div>
            <NavBtn disabled={!budget} onNext={() => setStep("type")} onBack={() => setStep("district")} />
          </QuizStep>
        )}

        {step === "type" && (
          <QuizStep title="Preferred college type?" subtitle="What kind of institution do you prefer?">
            <div className="space-y-2">
              {TYPES.map(t => (
                <button key={t} onClick={() => setColType(t)} className={`w-full text-sm px-4 py-4 rounded-xl border text-left font-medium transition-all ${colType === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"}`}>{t}</button>
              ))}
            </div>
            <NavBtn disabled={!colType} onNext={() => setStep("priority")} onBack={() => setStep("budget")} />
          </QuizStep>
        )}

        {step === "priority" && (
          <QuizStep title="What matters most to you?" subtitle="This helps rank our recommendations">
            <div className="grid grid-cols-2 gap-2">
              {PRIORITIES.map(p => (
                <button key={p} onClick={() => setPriority(p)} className={`text-sm px-4 py-3 rounded-xl border text-left font-medium transition-all ${priority === p ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"}`}>{p}</button>
              ))}
            </div>
            <NavBtn disabled={!priority} nextLabel={loading ? "Finding colleges..." : "Get Recommendations"} onNext={getRecommendations} onBack={() => setStep("type")} />
          </QuizStep>
        )}

        {step === "result" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your Matches</h2>
                <p className="text-sm text-slate-500 mt-0.5">Based on: {branch} · {district} · {colType} · Priority: {priority}</p>
              </div>
              <button onClick={() => { setStep("branch"); setResults([]); }} className="text-sm text-indigo-600 font-medium hover:underline">Start over</button>
            </div>
            {results.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
                <div className="text-4xl mb-3">😕</div>
                <p className="font-medium text-slate-500">No colleges matched your criteria</p>
                <button onClick={() => setStep("branch")} className="mt-3 text-sm text-indigo-600 hover:underline">Try again with different filters</button>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((col, i) => (
                  <Link key={col.id} href={`/colleges/${col.slug}`} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-black shrink-0 ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-indigo-50 text-indigo-500"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{col.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{col.city} · {col.district}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium block ${TYPE_COLORS[col.type] ?? "bg-slate-100 text-slate-600"}`}>{col.type}</span>
                      {col.nirfRank && <span className="text-xs text-slate-400">NIRF #{col.nirfRank}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuizStep({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
      {children}
    </div>
  );
}

function NavBtn({ disabled, onNext, onBack, nextLabel = "Next →" }: { disabled: boolean; onNext: () => void; onBack?: () => void; nextLabel?: string }) {
  return (
    <div className="flex items-center justify-between mt-6">
      {onBack ? <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700 font-medium">← Back</button> : <div />}
      <button onClick={onNext} disabled={disabled} className="bg-indigo-600 text-white text-sm px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">{nextLabel}</button>
    </div>
  );
}
