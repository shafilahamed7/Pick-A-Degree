"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/colleges", label: "Colleges" },
  { href: "/courses", label: "Courses" },
  { href: "/compare", label: "Compare" },
  { href: "/ai-advisor", label: "AI Advisor" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-8">
        <Link href="/" className="font-bold text-blue-600 text-lg tracking-tight">
          PAD
        </Link>
        <div className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith(l.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <Link
            href="/admin"
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
