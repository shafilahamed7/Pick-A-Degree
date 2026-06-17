export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroSearch from "@/components/HeroSearch";
import AnimatedStats from "@/components/AnimatedStats";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  { icon: "🔍", title: "Smart Search", desc: "Filter by district, fee, placement % and NAAC grade.", href: "/colleges", gradient: "from-blue-500 to-cyan-400" },
  { icon: "🏆", title: "NIRF Rankings", desc: "Official 2025 rankings with NAAC grades.", href: "/rankings", gradient: "from-amber-500 to-orange-400" },
  { icon: "📝", title: "Entrance Exams", desc: "TNEA, JEE, NEET, TANCET — dates & links.", href: "/entrance-exams", gradient: "from-rose-500 to-pink-400" },
  { icon: "📊", title: "Cutoff Explorer", desc: "JEE/TNEA opening & closing ranks by branch.", href: "/cutoffs", gradient: "from-violet-500 to-purple-400" },
  { icon: "💰", title: "Scholarships", desc: "Govt & private scholarships for all categories.", href: "/scholarships", gradient: "from-emerald-500 to-teal-400" },
  { icon: "🗺️", title: "College Map", desc: "See all colleges on an interactive TN map.", href: "/map", gradient: "from-sky-500 to-blue-400" },
  { icon: "🎯", title: "Recommender", desc: "Answer 5 questions — get your perfect match.", href: "/recommend", gradient: "from-indigo-500 to-blue-400" },
  { icon: "🏘️", title: "By District", desc: "Explore colleges across all 38 TN districts.", href: "/districts", gradient: "from-fuchsia-500 to-pink-400" },
  { icon: "⚖️", title: "Compare", desc: "Side-by-side: fees, placements, recruiters.", href: "/compare", gradient: "from-teal-500 to-cyan-400" },
  { icon: "🤖", title: "AI Advisor", desc: "Tell us your marks & goals — get tailored advice.", href: "/ai-advisor", gradient: "from-pink-500 to-rose-400" },
];

const quickLinks = [
  { label: "Top CSE colleges in Chennai", href: "/colleges?search=chennai" },
  { label: "Government engineering colleges", href: "/colleges?type=GOVERNMENT" },
  { label: "IITs & NITs in Tamil Nadu", href: "/rankings?type=IIT" },
  { label: "Scholarships for SC/ST students", href: "/scholarships?category=SC/ST" },
  { label: "MBA colleges in Coimbatore", href: "/colleges?search=coimbatore" },
  { label: "NAAC A++ colleges", href: "/rankings" },
  { label: "JEE cutoffs 2024", href: "/cutoffs" },
  { label: "TNEA exam details", href: "/entrance-exams" },
];

const TYPE_GRADIENT: Record<string, string> = {
  IIT: "from-red-600 to-orange-500",
  NIT: "from-orange-600 to-amber-500",
  UNIVERSITY: "from-blue-600 to-cyan-500",
  GOVERNMENT: "from-emerald-600 to-teal-500",
  AUTONOMOUS: "from-amber-600 to-yellow-500",
  DEEMED: "from-violet-600 to-purple-500",
  PRIVATE: "from-slate-500 to-slate-600",
};

const COLLEGE_FACTS: Record<string, string> = {
  "iit-madras": "Ranked #1 in NIRF every year since 2016",
  "nit-trichy": "90%+ placements with top global recruiters",
  "anna-university": "Affiliating university for 500+ colleges in TN",
  "vit-vellore-main": "Largest private university campus in India",
  "psg-college-of-technology": "92% placement rate with industry-leading labs",
  "srm-institute-of-science-and-technology": "Top 50 in NIRF with 88% placement rate",
  "amrita-school-of-engineering-coimbatore": "Top-ranked research university in South India",
  "sastra-deemed-university": "NAAC A++ grade with excellent research output",
  "karunya-institute-of-technology-and-sciences": "Known for strong industry connections & placements",
  "sathyabama-institute-of-science-and-technology": "Strong focus on research & innovation",
  "ssn-college-of-engineering": "One of the top autonomous colleges in Chennai",
  "thiagarajar-college-of-engineering": "Premier autonomous college since 1957",
};

export default async function HomePage() {
  // Fetch top colleges by NIRF rank from DB — real slugs, always correct
  const topColleges = await prisma.college.findMany({
    where: { nirfRank: { not: null } },
    orderBy: { nirfRank: "asc" },
    take: 6,
    select: {
      id: true, name: true, slug: true, type: true, city: true, nirfRank: true,
      placements: { orderBy: { year: "desc" }, take: 1, select: { placementPercent: true } },
    },
  });

  // Fetch featured colleges — rotate daily using real DB slugs
  const allFeaturable = await prisma.college.findMany({
    where: { OR: [{ nirfRank: { not: null } }, { naacGrade: { not: null } }] },
    orderBy: { nirfRank: "asc" },
    take: 15,
    select: { id: true, name: true, slug: true, type: true, city: true, nirfRank: true },
  });

  const day = new Date().getDate();
  const start = (day * 3) % allFeaturable.length;
  const featured = [0, 1, 2].map(i => allFeaturable[(start + i) % allFeaturable.length]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative bg-slate-900 pt-16 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-indigo-500/30 backdrop-blur-sm">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            Tamil Nadu&apos;s #1 college discovery platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Find your perfect college<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              in Tamil Nadu
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore 119+ colleges, check rankings, cutoffs, scholarships and get AI-powered recommendations — completely free.
          </p>
          <HeroSearch />
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { label: "🗺️ College Map", href: "/map" },
              { label: "🏆 Rankings", href: "/rankings" },
              { label: "💰 Scholarships", href: "/scholarships" },
              { label: "🤖 AI Advisor", href: "/ai-advisor" },
            ].map((q) => (
              <Link key={q.href} href={q.href}
                className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 rounded-full transition-all backdrop-blur-sm font-medium">
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AnimatedStats />

      {/* Featured Colleges of the Day — slugs from DB, never hardcoded */}
      <ScrollReveal className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">⭐ Featured Colleges · Today</div>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map((c, i) => {
            const color = TYPE_GRADIENT[c.type] ?? "from-indigo-600 to-violet-500";
            const fact = COLLEGE_FACTS[c.slug] ?? `${c.type} college in ${c.city}, Tamil Nadu`;
            return (
              <ScrollReveal key={c.slug} delay={i * 80}>
                <div className={`relative bg-gradient-to-br ${color} rounded-2xl p-6 overflow-hidden`}>
                  <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-2">
                    <div className="text-[100px] font-black text-white leading-none">
                      {c.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                    </div>
                  </div>
                  <div className="relative">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{c.type} · {c.city}</span>
                    {c.nirfRank && <span className="ml-2 text-xs font-bold text-white/80">NIRF #{c.nirfRank}</span>}
                    <h2 className="text-lg font-extrabold text-white mt-1 mb-2 leading-snug">{c.name}</h2>
                    <p className="text-white/70 text-xs mb-5 italic leading-relaxed">&ldquo;{fact}&rdquo;</p>
                    <Link href={`/colleges/${c.slug}`}
                      className="inline-flex items-center gap-1.5 bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs hover:bg-white/90 transition-all shadow-md">
                      View Profile →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Features grid */}
      <ScrollReveal className="max-w-7xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Everything you need to decide</h2>
          <p className="text-slate-500 text-sm">Tools built for Tamil Nadu students making the most important choice of their life.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.href} delay={i * 40}>
              <Link href={f.href}
                className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group block h-full">
                <div className={`w-11 h-11 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center text-xl mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {/* Top colleges — from DB, real slugs */}
      <ScrollReveal className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-slate-900">Top ranked colleges</h2>
          <Link href="/rankings" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View all rankings <span>→</span>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topColleges.map((c, i) => {
            const color = TYPE_GRADIENT[c.type] ?? "from-slate-500 to-slate-600";
            const placement = c.placements[0]?.placementPercent;
            return (
              <ScrollReveal key={c.slug} delay={i * 60}>
                <Link href={`/colleges/${c.slug}`}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group block">
                  <div className={`h-1.5 bg-gradient-to-r ${color}`} />
                  <div className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center font-extrabold text-xs text-white shrink-0 shadow-md`}>
                      {c.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-700 transition-colors">{c.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{c.city} · {c.type}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-amber-600">#{c.nirfRank}</div>
                      {placement && <div className="text-xs text-emerald-600 font-semibold">{placement}%</div>}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Quick search pills */}
      <ScrollReveal className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular searches</h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((q) => (
            <Link key={q.label} href={q.href}
              className="text-sm px-4 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all font-medium shadow-sm">
              {q.label}
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
