import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pick a Degree (PAD) — Find Colleges in Tamil Nadu",
  description:
    "Discover the best colleges and degree programs in Tamil Nadu. Compare colleges, explore courses, and get AI-powered recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-slate-100 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="font-semibold text-slate-900 text-sm">Pick a Degree</span>
              </div>
              <p className="text-sm text-slate-400">Helping Tamil Nadu students find the right college and career path.</p>
              <p className="text-xs text-slate-300">© {new Date().getFullYear()} PAD. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
