import Link from "next/link";

const stats = [
  { label: "Colleges", value: "1,500+", icon: "🏛️" },
  { label: "Courses", value: "5,000+", icon: "📚" },
  { label: "Districts", value: "38", icon: "📍" },
  { label: "Students helped", value: "50,000+", icon: "🎓" },
];

const features = [
  {
    icon: "🔍",
    title: "Smart college search",
    desc: "Filter by district, course, fee, placement %, NAAC grade and more.",
    href: "/colleges",
    color: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: "⚖️",
    title: "Side-by-side compare",
    desc: "Compare up to 3 colleges across fees, placements, recruiters and rank.",
    href: "/compare",
    color: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: "🤖",
    title: "AI college advisor",
    desc: "Tell us your marks, budget, and goals — get personalised recommendations.",
    href: "/ai-advisor",
    color: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
];

const quickLinks = [
  { label: "Top CSE colleges in Chennai", href: "/colleges?city=Chennai&type=PRIVATE" },
  { label: "Government medical colleges", href: "/colleges?type=GOVERNMENT" },
  { label: "IITs & NITs in Tamil Nadu", href: "/colleges?type=IIT,NIT" },
  { label: "80%+ placement colleges", href: "/colleges?minPlacement=80" },
  { label: "MBA colleges in Coimbatore", href: "/colleges?city=Coimbatore" },
  { label: "NAAC A++ colleges", href: "/colleges?naac=A++" },
  { label: "Low fee engineering", href: "/colleges?type=GOVERNMENT" },
  { label: "Autonomous colleges TN", href: "/colleges?type=AUTONOMOUS" },
];

const topColleges = [
  { name: "IIT Madras", city: "Chennai", type: "IIT", rank: 1, placement: "95%", pkg: "₹22 L avg", initials: "IIT", color: "bg-red-50 text-red-700" },
  { name: "NIT Trichy", city: "Tiruchirappalli", type: "NIT", rank: 9, placement: "90%", pkg: "₹14 L avg", initials: "NIT", color: "bg-orange-50 text-orange-700" },
  { name: "VIT University", city: "Vellore", type: "Deemed", rank: 11, placement: "89%", pkg: "₹11 L avg", initials: "VIT", color: "bg-emerald-50 text-emerald-700" },
  { name: "SSN College of Engineering", city: "Chennai", type: "Autonomous", rank: 52, placement: "92%", pkg: "₹12 L avg", initials: "SSN", color: "bg-indigo-50 text-indigo-700" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-900 pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-500/30">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
            Tamil Nadu&apos;s #1 college discovery platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 tracking-tight">
            Find your perfect college<br />
            <span className="text-indigo-400">in Tamil Nadu</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore 1,500+ colleges, compare courses, check placements, and get
            AI-powered recommendations — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur border border-white/10 rounded-xl px-4 py-3.5">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="text-slate-400 text-sm">Search colleges, courses, districts...</span>
            </div>
            <Link
              href="/colleges"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              Explore colleges →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          {stats.map((s) => (
            <div key={s.label} className="py-6 px-8 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Everything you need to decide</h2>
          <p className="text-slate-500">Tools built for Tamil Nadu students making the most important choice of their life.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-indigo-200 hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top colleges */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Top ranked colleges</h2>
          <Link href="/colleges" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {topColleges.map((c) => (
            <Link
              key={c.name}
              href={`/colleges/${c.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center font-bold text-sm shrink-0`}>
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 truncate">{c.name}</div>
                <div className="text-sm text-slate-500">{c.city} · {c.type}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-slate-900">NIRF #{c.rank}</div>
                <div className="text-xs text-emerald-600 font-medium">{c.placement} placed</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick search pills */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Popular searches</h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className="text-sm px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all font-medium"
            >
              {q.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
