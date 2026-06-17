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
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Pick a Degree (PAD)</p>
            <p>Helping Tamil Nadu students find the right college and career path.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
