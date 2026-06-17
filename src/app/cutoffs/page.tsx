"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Cutoff = { id: string; collegeId: string; year: number; branch: string; category: string; openRank: number | null; closeRank: number | null };
type College = { id: string; name: string; slug: string; city: string };

const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS"];

export default function CutoffsPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [search, setSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);

  useEffect(() => {
    if (search.length < 2) { setShowDrop(false); return; }
    fetch(`/api/colleges?search=${encodeURIComponent(search)}&limit=8`)
      .then(r => r.json())
      .then(d => { setColleges(Array.isArray(d) ? d.slice(0, 8) : []); setShowDrop(true); })
      .catch(() => {});
  }, [search]);

  useEffect(() => {
    if (!selectedCollege) return;
    setLoading(true);
    fetch(`/api/cutoffs?collegeId=${selectedCollege.id}`)
      .then(r => r.json())
      .then(d => { setCutoffs(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedCollege]);

  const branches = [...new Set(cutoffs.map(c => c.branch))];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Cutoff Explorer</h1>
          <p className="text-slate-500 text-sm">JEE/TNEA opening and closing ranks for Tamil Nadu colleges. Year: 2024.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">Search for a college</p>
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Type college name..."
                value={selectedCollege ? selectedCollege.name : search}
                onChange={e => { setSearch(e.target.value); setSelectedCollege(null); setCutoffs([]); }}
                onFocus={() => search.length >= 2 && setShowDrop(true)}
                className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
              />
              {selectedCollege && <button onClick={() => { setSelectedCollege(null); setSearch(""); setCutoffs([]); }} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>}
            </div>
            {showDrop && colleges.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {colleges.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCollege(c); setSearch(""); setShowDrop(false); }} className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0">
                    <p className="text-sm font-medium text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.city}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!selectedCollege && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium text-slate-500">Search for a college to see cutoff ranks</p>
            <p className="text-sm mt-1">Available for IIT Madras, NIT Trichy, VIT, Anna University and more</p>
          </div>
        )}

        {selectedCollege && loading && (
          <div className="text-center py-20 text-slate-400"><p className="font-medium">Loading cutoffs...</p></div>
        )}

        {selectedCollege && !loading && cutoffs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">📊</div>
            <p className="font-medium text-slate-500">No cutoff data available for this college yet</p>
          </div>
        )}

        {selectedCollege && !loading && cutoffs.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900">{selectedCollege.name}</h2>
                <p className="text-xs text-slate-400">JEE Advanced / JEE Main cutoff ranks · 2024</p>
              </div>
              <Link href={`/colleges/${colleges.find(c => c.id === selectedCollege.id)?.slug ?? ""}`} className="text-xs text-indigo-600 font-medium hover:underline">View college →</Link>
            </div>
            {branches.map(branch => {
              const branchCutoffs = cutoffs.filter(c => c.branch === branch);
              return (
                <div key={branch} className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-sm">{branch}</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="text-left border-b border-slate-50">
                      <th className="px-5 py-2 text-xs font-semibold text-slate-400 uppercase">Category</th>
                      <th className="px-5 py-2 text-xs font-semibold text-slate-400 uppercase">Opening Rank</th>
                      <th className="px-5 py-2 text-xs font-semibold text-slate-400 uppercase">Closing Rank</th>
                    </tr></thead>
                    <tbody>
                      {branchCutoffs.map(c => (
                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">{c.category}</td>
                          <td className="px-5 py-3 text-emerald-600 font-semibold">{c.openRank?.toLocaleString("en-IN") ?? "—"}</td>
                          <td className="px-5 py-3 text-red-500 font-semibold">{c.closeRank?.toLocaleString("en-IN") ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
            <p className="text-xs text-slate-400 text-center mt-2">Ranks are indicative. Verify with official JoSAA/TNEA portals before applying.</p>
          </>
        )}
      </div>
    </div>
  );
}
