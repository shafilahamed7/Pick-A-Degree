export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-50 text-red-700",
  NIT: "bg-orange-50 text-orange-700",
  UNIVERSITY: "bg-blue-50 text-blue-700",
  GOVERNMENT: "bg-emerald-50 text-emerald-700",
  AUTONOMOUS: "bg-violet-50 text-violet-700",
  PRIVATE: "bg-slate-100 text-slate-700",
  DEEMED: "bg-teal-50 text-teal-700",
};

export default async function AdminPage() {
  const [totalColleges, totalCourses, totalEvents] = await Promise.all([
    prisma.college.count(),
    prisma.course.count(),
    prisma.event.count(),
  ]);

  const recentColleges = await prisma.college.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, name: true, slug: true, type: true, city: true, createdAt: true },
  });

  const stats = [
    { label: "Total colleges", value: totalColleges, icon: "🏛️", color: "indigo" },
    { label: "Total courses", value: totalCourses, icon: "📚", color: "emerald" },
    { label: "Total events", value: totalEvents, icon: "📅", color: "violet" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage colleges, courses, and platform data</p>
          </div>
          <Link href="/colleges"
            className="text-sm bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-semibold">
            View colleges
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-${s.color}-50`}>
                {s.icon}
              </div>
              <div>
                <div className={`text-3xl font-bold text-${s.color}-600`}>{s.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent colleges */}
        <div className="bg-white rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="font-bold text-slate-900">Recent colleges</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {recentColleges.map((c) => (
              <Link key={c.id} href={`/colleges/${c.slug}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${TYPE_COLORS[c.type] ?? "bg-slate-100 text-slate-700"}`}>
                    {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[c.type] ?? "bg-slate-100 text-slate-700"}`}>
                    {c.type}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Browse colleges", href: "/colleges", icon: "🏛️" },
              { label: "Compare tool", href: "/compare", icon: "⚖️" },
              { label: "AI Advisor", href: "/ai-advisor", icon: "🤖" },
              { label: "Home", href: "/", icon: "🏠" },
            ].map((q) => (
              <Link key={q.href} href={q.href}
                className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 font-medium hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 transition-all">
                <span>{q.icon}</span>
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
