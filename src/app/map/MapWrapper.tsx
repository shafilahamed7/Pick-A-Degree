"use client";
import nextDynamic from "next/dynamic";

const CollegeMap = nextDynamic(() => import("./CollegeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapWrapper({ colleges }: { colleges: any[] }) {
  return <CollegeMap colleges={colleges} />;
}
