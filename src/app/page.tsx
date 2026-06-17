import Link from "next/link";

const stats = [
  { label: "Colleges", value: "1,500+" },
  { label: "Courses", value: "5,000+" },
  { label: "Districts", value: "38" },
  { label: "Students Helped", value: "50,000+" },
];

const quickLinks = [
  { label: "Top Engineering Colleges in Chennai", href: "/colleges?city=Chennai&type=PRIVATE" },
  { label: "Government Medical Colleges in TN", href: "/colleges?type=GOVERNMENT&course=MBBS" },
  { label: "Best CSE colleges with 80%+ placement", href: "/colleges?course=CSE&minPlacement=80" },
  { label: "IITs & NITs in Tamil Nadu", href: "/colleges?type=IIT,NIT" },
  { label: "MBA Colleges in Coimbatore", href: "/colleges?city=Coimbatore&course=MBA" },
  { label: "Autonomous Arts & Science Colleges", href: "/colleges?type=AUTONOMOUS" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect College in Tamil Nadu
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Explore 1,500+ colleges, compare courses, check placements, and get AI-powered
            recommendations — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder='Try "CSE colleges in Chennai" or "Best medical college"'
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Link
              href="/colleges"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Search Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-blue-700">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main CTA cards */}
      <section className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-6">
        <Link
          href="/colleges"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-2xl">🏛️</div>
          <h2 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
            Explore Colleges
          </h2>
          <p className="text-sm text-gray-500">
            Browse IITs, NITs, government, autonomous, and private colleges across all 38
            districts.
          </p>
        </Link>

        <Link
          href="/compare"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-2xl">⚖️</div>
          <h2 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
            Compare Colleges
          </h2>
          <p className="text-sm text-gray-500">
            Side-by-side comparison of fees, placement percentages, top recruiters, and
            rankings.
          </p>
        </Link>

        <Link
          href="/ai-advisor"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 text-2xl">🤖</div>
          <h2 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
            AI College Advisor
          </h2>
          <p className="text-sm text-gray-500">
            Enter your marks, preferred course, and goals — get personalised college
            recommendations.
          </p>
        </Link>
      </section>

      {/* Quick search links */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              {q.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
