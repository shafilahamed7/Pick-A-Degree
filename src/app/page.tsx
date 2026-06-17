import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";

const stats = [
  { label: "Colleges", value: "1,500+", icon: "🏛️" },
  { label: "Courses", value: "5,000+", icon: "📚" },
  { label: "Scholarships", value: "15+", icon: "🎓" },
  { label: "Entrance Exams", value: "11+", icon: "📝" },
];

const features = [
  { icon: "🔍", title: "Smart college search", desc: "Filter by district, course, fee, placement %, NAAC grade and more.", href: "/colleges", iconBg: "bg-blue-100" },
  { icon: "🏆", title: "NIRF Rankings", desc: "Official NIRF 2025 rankings for Tamil Nadu colleges with NAAC grades.", href: "/rankings", iconBg: "bg-amber-100" },
  { icon: "📝", title: "Entrance Exam Guide", desc: "TNEA, JEE, NEET, TANCET — dates, eligibility, official links.", href: "/entrance-exams", iconBg: "bg-rose-100" },
  { icon: "📊", title: "Cutoff Explorer", desc: "JEE/TNEA opening and closing ranks for top TN colleges by branch.", href: "/cutoffs", iconBg: "bg-violet-100" },
  { icon: "💰", title: "Scholarship Finder", desc: "Find govt. and private scholarships for BC, MBC, SC/ST, merit students.", href: "/scholarships", iconBg: "bg-emerald-100" },
  { icon: "🎯", title: "College Recommender", desc: "Answer 5 questions about branch, budget, and priority — get your matches.", href: "/recommend", iconBg: "bg-indigo-100" },
  { icon: "⚖️", title: "Side-by-side compare", desc: "Compare up to 3 colleges across fees, placements, recruiters and rank.", href: "/compare", iconBg: "bg-teal-100" },
  { icon: "🤖", title: "AI college advisor", desc: "Tell us your marks, budget, and goals — get personalised recommendations.", href: "/ai-advisor", iconBg: "bg-pink-100" },
];

const topColleges = [
  { name: "IIT Madras", city: "Chennai", type: "IIT", rank: 1, placement: "95%", slug: "iit-madras", color: "bg-red-50 text-red-700" },
  { name: "NIT Trichy", city: "Tiruchirappalli", type: "NIT", rank: 9, placement: "90%", slug: "nit-trichy", color: "bg-orange-50 text-orange-700" },
  { name: "Anna University", city: "Chennai", type: "University", rank: 10, placement: "85%", slug: "anna-university", color: "bg-blue-50 text-blue-700" },
  { name: "VIT Vellore", city: "Vellore", type: "Deemed", rank: 16, placement: "89%", slug: "vit-vellore", color: "bg-emerald-50 text-emerald-700" },
  { name: "SRM Institute of Science and Technology", city: "Chennai", type: "Deemed", rank: 14, placement: "88%", slug: "srm-institute-of-science-and-technology", color: "bg-violet-50 text-violet-700" },
  { name: "PSG College of Technology", city: "Coimbatore", type: "Autonomous", rank: 72, placement: "92%", slug: "psg-college-of-technology", color: "bg-amber-50 text-amber-700" },
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
            Explore 1,500+ colleges, check rankings, cutoffs, scholarships, and get AI-powered recommendations — all free.
          </p>
          <HeroSearch />
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

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Everything you need to decide</h2>
          <p className="text-slate-500">Tools built for Tamil Nadu students making the most important choice of their life.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 ${f.iconBg} rounded-xl flex items-center justify-center text-xl mb-3`}>{f.icon}</div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top colleges */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Top ranked colleges</h2>
          <Link href="/rankings" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all rankings →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topColleges.map((c) => (
            <Link key={c.slug} href={`/colleges/${c.slug}`}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:border-indigo-200 hover:shadow-sm transition-all">
              <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center font-bold text-xs shrink-0 text-center leading-tight p-1`}>
                {c.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm truncate">{c.name}</div>
                <div className="text-xs text-slate-500">{c.city} · {c.type}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-amber-600">NIRF #{c.rank}</div>
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
            <Link key={q.label} href={q.href}
              className="text-sm px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all font-medium">
              {q.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
