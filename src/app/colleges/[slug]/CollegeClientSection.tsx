"use client";
import { useEffect, useState } from "react";
import ShortlistButton from "@/components/ShortlistButton";

type Review = { id: string; authorName: string; batchYear: number | null; branch: string | null; rating: number; academics: number | null; placements: number | null; campus: number | null; faculty: number | null; content: string; createdAt: string };
type Cutoff = { id: string; year: number; branch: string; category: string; openRank: number | null; closeRank: number | null };

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(value) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-1">{value.toFixed(1)}</span>
    </div>
  );
}

function RatingInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => onChange(String(n))}
            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${Number(value) >= n ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-400 hover:bg-amber-100"}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CollegeClientSection({ collegeId, collegeName, collegeSlug, collegeType, collegeCity, collegeDistrict, nirfRank, naacGrade }: {
  collegeId: string; collegeName: string; collegeSlug: string;
  collegeType: string; collegeCity: string; collegeDistrict: string;
  nirfRank: number | null; naacGrade: string | null;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "cutoffs">("reviews");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({ authorName: "", batchYear: "", branch: "", rating: "5", academics: "5", placements: "5", campus: "5", faculty: "5", content: "" });

  useEffect(() => {
    fetch(`/api/reviews?collegeId=${collegeId}`).then(r => r.json()).then(d => setReviews(Array.isArray(d) ? d : [])).catch(() => {});
    fetch(`/api/cutoffs?collegeId=${collegeId}`).then(r => r.json()).then(d => setCutoffs(Array.isArray(d) ? d : [])).catch(() => {});
  }, [collegeId]);

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
  const branches = [...new Set(cutoffs.map(c => c.branch))];

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId, ...form, batchYear: form.batchYear || null }),
      });
      const updated = await fetch(`/api/reviews?collegeId=${collegeId}`).then(r => r.json());
      setReviews(Array.isArray(updated) ? updated : []);
      setShowForm(false);
      setSubmitted(true);
      setForm({ authorName: "", batchYear: "", branch: "", rating: "5", academics: "5", placements: "5", campus: "5", faculty: "5", content: "" });
    } catch (e) { /* ignore */ }
    setSubmitting(false);
  }

  return (
    <div className="space-y-5">
      {/* Shortlist row */}
      <div className="bg-white rounded-2xl border border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShortlistButton college={{ id: collegeId, name: collegeName, slug: collegeSlug, type: collegeType, city: collegeCity, district: collegeDistrict, nirfRank, naacGrade }} />
          <span className="text-sm font-medium text-slate-700">Save to my shortlist</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); }} className="text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors font-medium">
            📋 Copy link
          </button>
        </div>
      </div>

      {/* Reviews & Cutoffs tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button onClick={() => setActiveTab("reviews")} className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === "reviews" ? "text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/40" : "text-slate-500 hover:text-slate-700"}`}>
            ⭐ Reviews {reviews.length > 0 && `(${reviews.length})`}
          </button>
          <button onClick={() => setActiveTab("cutoffs")} className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === "cutoffs" ? "text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/40" : "text-slate-500 hover:text-slate-700"}`}>
            📊 Cutoff Ranks {cutoffs.length > 0 && `(${cutoffs.length})`}
          </button>
        </div>

        <div className="p-6">
          {activeTab === "reviews" && (
            <div>
              {/* Avg rating summary */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-6 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-center">
                    <p className="text-4xl font-black text-amber-600">{avgRating.toFixed(1)}</p>
                    <StarRating value={avgRating} />
                    <p className="text-xs text-slate-500 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {["academics", "placements", "campus", "faculty"].map(key => {
                      const avg = reviews.filter(r => (r as any)[key] != null).reduce((s, r) => s + ((r as any)[key] ?? 0), 0) / reviews.filter(r => (r as any)[key] != null).length;
                      if (!avg) return null;
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 w-16 capitalize">{key}</span>
                          <div className="flex-1 bg-white rounded-full h-1.5">
                            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${(avg / 5) * 100}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 w-6">{avg.toFixed(1)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Review cards */}
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <div className="text-3xl mb-2">💬</div>
                  <p className="font-medium text-slate-500">No reviews yet</p>
                  <p className="text-sm mt-1">Be the first to review this college!</p>
                </div>
              ) : (
                <div className="space-y-4 mb-5">
                  {reviews.map(r => (
                    <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{r.authorName}</p>
                          <p className="text-xs text-slate-400">{r.branch ? `${r.branch} · ` : ""}{r.batchYear ? `Batch ${r.batchYear}` : ""}</p>
                        </div>
                        <StarRating value={r.rating} />
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{r.content}</p>
                      {(r.academics || r.placements || r.campus || r.faculty) && (
                        <div className="flex flex-wrap gap-3 mt-3">
                          {r.academics && <span className="text-xs text-slate-500">Academics: <span className="font-semibold text-slate-700">{r.academics}/5</span></span>}
                          {r.placements && <span className="text-xs text-slate-500">Placements: <span className="font-semibold text-slate-700">{r.placements}/5</span></span>}
                          {r.campus && <span className="text-xs text-slate-500">Campus: <span className="font-semibold text-slate-700">{r.campus}/5</span></span>}
                          {r.faculty && <span className="text-xs text-slate-500">Faculty: <span className="font-semibold text-slate-700">{r.faculty}/5</span></span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Write review */}
              {submitted && <p className="text-sm text-emerald-600 font-medium mb-3">✅ Thank you! Your review has been submitted.</p>}
              {!showForm ? (
                <button onClick={() => setShowForm(true)} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                  ✍️ Write a review
                </button>
              ) : (
                <form onSubmit={submitReview} className="space-y-4 border border-slate-200 rounded-xl p-4">
                  <p className="font-semibold text-slate-900 text-sm">Write a review</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 font-medium mb-1 block">Your name *</label>
                      <input required value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Name" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-medium mb-1 block">Batch year</label>
                      <input type="number" value={form.batchYear} onChange={e => setForm(f => ({ ...f, batchYear: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. 2023" min={2000} max={2030} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium mb-1 block">Branch / Department</label>
                    <input value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. Computer Science Engineering" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <RatingInput label="Overall rating *" value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                    <RatingInput label="Academics" value={form.academics} onChange={v => setForm(f => ({ ...f, academics: v }))} />
                    <RatingInput label="Placements" value={form.placements} onChange={v => setForm(f => ({ ...f, placements: v }))} />
                    <RatingInput label="Campus" value={form.campus} onChange={v => setForm(f => ({ ...f, campus: v }))} />
                    <RatingInput label="Faculty" value={form.faculty} onChange={v => setForm(f => ({ ...f, faculty: v }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium mb-1 block">Your review *</label>
                    <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none" placeholder="Share your experience — academics, placements, campus life..." minLength={50} />
                    <p className="text-xs text-slate-400 mt-1">Minimum 50 characters</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={submitting} className="bg-indigo-600 text-white text-sm px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
                      {submitting ? "Submitting..." : "Submit review"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-500 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === "cutoffs" && (
            <div>
              {cutoffs.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="font-medium text-slate-500">No cutoff data available</p>
                  <p className="text-sm mt-1">Check the <a href="/cutoffs" className="text-indigo-600 hover:underline">Cutoff Explorer</a> for more colleges</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {branches.map(branch => {
                    const branchCutoffs = cutoffs.filter(c => c.branch === branch);
                    return (
                      <div key={branch} className="border border-slate-100 rounded-xl overflow-hidden">
                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                          <h3 className="font-semibold text-slate-900 text-sm">{branch}</h3>
                          <p className="text-xs text-slate-400">Year: {branchCutoffs[0]?.year}</p>
                        </div>
                        <table className="w-full text-sm">
                          <thead><tr className="text-left border-b border-slate-50">
                            <th className="px-4 py-2 text-xs font-semibold text-slate-400">Category</th>
                            <th className="px-4 py-2 text-xs font-semibold text-slate-400">Opening Rank</th>
                            <th className="px-4 py-2 text-xs font-semibold text-slate-400">Closing Rank</th>
                          </tr></thead>
                          <tbody>
                            {branchCutoffs.map(c => (
                              <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                <td className="px-4 py-2.5 font-medium text-slate-700">{c.category}</td>
                                <td className="px-4 py-2.5 text-emerald-600 font-semibold">{c.openRank?.toLocaleString("en-IN") ?? "—"}</td>
                                <td className="px-4 py-2.5 text-red-500 font-semibold">{c.closeRank?.toLocaleString("en-IN") ?? "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                  <p className="text-xs text-slate-400 text-center">Indicative ranks only. Verify with official JoSAA/TNEA portals.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
