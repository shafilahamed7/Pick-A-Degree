"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/colleges", label: "Colleges" },
  { href: "/courses", label: "Courses" },
  { href: "/rankings", label: "Rankings" },
  { href: "/entrance-exams", label: "Exams" },
  { href: "/cutoffs", label: "Cutoffs" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/jobs", label: "Jobs" },
  { href: "/events", label: "Events" },
  { href: "/compare", label: "Compare" },
  { href: "/recommend", label: "Recommend" },
  { href: "/ai-advisor", label: "AI Advisor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-6">
        <Link href="/" className="flex items-stretch shrink-0 self-stretch">
          <img src="/logo.png" alt="Pick A Degree" className="h-full w-auto object-contain" />
        </Link>

        {/* Desktop nav — scrollable */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                pathname.startsWith(l.href)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          {/* Shortlist heart */}
          <Link href="/shortlist" title="My Shortlist" className={`p-2 rounded-lg transition-colors ${pathname === "/shortlist" ? "text-rose-500 bg-rose-50" : "text-slate-400 hover:text-rose-400 hover:bg-rose-50"}`}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>
          <Link href="/admin" className="text-xs font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">Admin</Link>

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 grid grid-cols-3 gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-lg text-xs font-medium text-center transition-all ${pathname.startsWith(l.href) ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
