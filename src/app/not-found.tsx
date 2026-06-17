import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-black text-indigo-500/20 leading-none mb-2 select-none">404</div>
        <h1 className="text-2xl font-extrabold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Go home
          </Link>
          <Link href="/colleges" className="bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/10">
            Browse colleges
          </Link>
          <Link href="/ai-advisor" className="bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/10">
            Ask AI advisor
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs text-slate-600">
          {[
            { label: "Rankings", href: "/rankings" },
            { label: "Scholarships", href: "/scholarships" },
            { label: "Exams", href: "/entrance-exams" },
            { label: "Cutoffs", href: "/cutoffs" },
            { label: "Compare", href: "/compare" },
            { label: "Map", href: "/map" },
          ].map(l => (
            <Link key={l.href} href={l.href} className="hover:text-slate-400 transition-colors">{l.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
