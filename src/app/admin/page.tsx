export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const [totalColleges, totalCourses, totalEvents] = await Promise.all([
    prisma.college.count(),
    prisma.course.count(),
    prisma.event.count(),
  ]);

  const recentColleges = await prisma.college.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, name: true, type: true, city: true, createdAt: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Colleges", value: totalColleges, color: "blue" },
          { label: "Total Courses", value: totalCourses, color: "green" },
          { label: "Total Events", value: totalEvents, color: "purple" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className={`text-3xl font-bold text-${s.color}-600`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Colleges</h2>
          <Link href="/admin/colleges/new" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            + Add College
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="text-left py-2 pr-4">Name</th>
              <th className="text-left py-2 pr-4">Type</th>
              <th className="text-left py-2 pr-4">City</th>
              <th className="text-left py-2">Added</th>
            </tr>
          </thead>
          <tbody>
            {recentColleges.map((c) => (
              <tr key={c.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-900">{c.name}</td>
                <td className="py-3 pr-4 text-gray-500">{c.type}</td>
                <td className="py-3 pr-4 text-gray-500">{c.city}</td>
                <td className="py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
