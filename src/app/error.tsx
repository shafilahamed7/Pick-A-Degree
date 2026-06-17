"use client";
import Link from "next/link";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-black text-rose-500/20 leading-none mb-2 select-none">Oops</div>
        <h1 className="text-2xl font-extrabold text-white mb-3">Something went wrong</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          A temporary error occurred. Try refreshing — it usually fixes itself.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Try again
          </button>
          <Link href="/" className="bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/10">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
