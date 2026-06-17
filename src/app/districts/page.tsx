export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const DISTRICT_META: Record<string, { emoji: string; tagline: string }> = {
  "Chennai": { emoji: "🏙️", tagline: "Capital city · Most colleges" },
  "Coimbatore": { emoji: "🏭", tagline: "Manchester of South India" },
  "Madurai": { emoji: "🏛️", tagline: "Temple city · Cultural hub" },
  "Tiruchirappalli": { emoji: "🎓", tagline: "Education & tech hub" },
  "Salem": { emoji: "⚡", tagline: "Steel city" },
  "Vellore": { emoji: "🔬", tagline: "Medical & tech colleges" },
  "Tirunelveli": { emoji: "🌾", tagline: "Southern TN hub" },
  "Erode": { emoji: "🧵", tagline: "Textile city" },
  "Thoothukudi": { emoji: "⚓", tagline: "Port city" },
  "Dindigul": { emoji: "🔒", tagline: "Lock city" },
  "Thanjavur": { emoji: "🎵", tagline: "Cultural capital" },
  "Kanyakumari": { emoji: "🌊", tagline: "Southernmost tip" },
  "Villupuram": { emoji: "🌿", tagline: "Gateway to Pondicherry" },
  "Krishnagiri": { emoji: "🥭", tagline: "Mango capital" },
  "Namakkal": { emoji: "🚛", tagline: "Trucking & poultry hub" },
  "Tiruppur": { emoji: "👕", tagline: "Knitwear capital" },
};

export default async function DistrictsPage() {
  const districtCounts = await prisma.college.groupBy({
    by: ["district"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Explore by District</h1>
          <p className="text-slate-500 text-sm">Browse colleges across all 38 districts of Tamil Nadu</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {districtCounts.map(({ district, _count }) => {
            const meta = DISTRICT_META[district];
            return (
              <Link
                key={district}
                href={`/colleges?district=${encodeURIComponent(district)}`}
                className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="text-3xl mb-3">{meta?.emoji ?? "🏫"}</div>
                <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors text-sm leading-tight mb-1">{district}</div>
                {meta?.tagline && <div className="text-xs text-slate-400 mb-3">{meta.tagline}</div>}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
                  <span className="text-xs text-slate-500">{_count.id} college{_count.id !== 1 ? "s" : ""}</span>
                  <span className="text-xs text-indigo-500 font-semibold group-hover:translate-x-0.5 transition-transform">View →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
