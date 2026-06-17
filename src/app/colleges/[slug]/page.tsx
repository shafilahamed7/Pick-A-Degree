export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPackage, formatFee } from "@/lib/utils";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-50 text-red-700",
  NIT: "bg-orange-50 text-orange-700",
  UNIVERSITY: "bg-blue-50 text-blue-700",
  GOVERNMENT: "bg-emerald-50 text-emerald-700",
  AUTONOMOUS: "bg-violet-50 text-violet-700",
  PRIVATE: "bg-slate-100 text-slate-700",
  DEEMED: "bg-teal-50 text-teal-700",
};

export default async function CollegePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      placements: { orderBy: { year: "desc" }, take: 1 },
      departments: { include: { courses: true } },
      facilities: true,
      events: { orderBy: { startDate: "asc" }, take: 5 },
      university: true,
    },
  });

  if (!college) notFound();

  const placement = college.placements[0];
  const initials = college.name.split(" ").map((w: string) => w[0]).join("").slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/colleges" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-5">
            ← Back to colleges
          </Link>

          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-base font-bold shrink-0 ${TYPE_COLORS[college.type] ?? "bg-slate-100 text-slate-700"}`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[college.type] ?? "bg-slate-100 text-slate-700"}`}>
                  {college.type}
                </span>
                {college.naacGrade && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    NAAC {college.naacGrade}
                  </span>
                )}
                {college.nirfRank && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                    NIRF #{college.nirfRank}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{college.name}</h1>
              <p className="text-sm text-slate-500">📍 {college.address}, {college.city} — {college.district}</p>
              {college.established && (
                <p className="text-xs text-slate-400 mt-1">Established {college.established}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              {college.website && (
                <a href={college.website} target="_blank" rel="noopener noreferrer"
                  className="text-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                  Website ↗
                </a>
              )}
              <Link href={`/compare?add=${college.slug}`}
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                + Compare
              </Link>
            </div>
          </div>

          {college.description && (
            <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-3xl">{college.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        {/* Placement stats */}
        {placement && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Placement statistics · {placement.year}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-700">{placement.placementPercent}%</div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">Placement rate</div>
              </div>
              {placement.averagePackage && (
                <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-700">{formatPackage(placement.averagePackage)}</div>
                  <div className="text-xs text-indigo-600 mt-1 font-medium">Average package</div>
                </div>
              )}
              {placement.highestPackage && (
                <div className="bg-violet-50 rounded-xl p-4 text-center border border-violet-100">
                  <div className="text-2xl font-bold text-violet-700">{formatPackage(placement.highestPackage)}</div>
                  <div className="text-xs text-violet-600 mt-1 font-medium">Highest package</div>
                </div>
              )}
              {placement.placedStudents && placement.totalStudents && (
                <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                  <div className="text-2xl font-bold text-amber-700">{placement.placedStudents}/{placement.totalStudents}</div>
                  <div className="text-xs text-amber-600 mt-1 font-medium">Students placed</div>
                </div>
              )}
            </div>
            {placement.topRecruiters.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Top recruiters</p>
                <div className="flex flex-wrap gap-2">
                  {placement.topRecruiters.map((r: string) => (
                    <span key={r} className="text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">{r}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Departments & Courses */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Departments & courses</h2>
          <div className="space-y-3">
            {college.departments.map((dept: any) => (
              <div key={dept.id} className="border border-slate-100 rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 mb-3 text-sm">{dept.name}</h3>
                <div className="space-y-2">
                  {dept.courses.map((course: any) => (
                    <div key={course.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                      <span className="text-slate-700">{course.name}</span>
                      <div className="flex gap-4 text-slate-400 text-xs shrink-0 ml-4">
                        <span>{course.duration}yr</span>
                        {course.totalSeats && <span>{course.totalSeats} seats</span>}
                        {course.annualFee && <span className="text-indigo-600 font-semibold">{formatFee(course.annualFee)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        {college.events.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Upcoming events</h2>
            <div className="space-y-3">
              {college.events.map((event: any) => (
                <div key={event.id} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl shrink-0">
                    {event.eventType === "HACKATHON" ? "💻" : event.eventType === "CULTURAL" ? "🎭" : event.eventType === "WORKSHOP" ? "🛠️" : "📚"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{event.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {event.venue && ` · ${event.venue}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        {college.facilities.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Facilities</h2>
            <div className="flex flex-wrap gap-2">
              {college.facilities.map((f: any) => (
                <span key={f.id} className="text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
