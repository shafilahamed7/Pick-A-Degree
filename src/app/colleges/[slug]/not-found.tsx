import Link from "next/link";

export default function CollegeNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-lg bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">🏛️</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 mb-2">College not found</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          This college profile doesn't exist or may have been removed from our database.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/colleges" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Browse all colleges
          </Link>
          <Link href="/recommend" className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
            Get recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}
