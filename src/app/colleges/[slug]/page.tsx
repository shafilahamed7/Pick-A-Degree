export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPackage, formatFee } from "@/lib/utils";
import Link from "next/link";

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

  const typeColors: Record<string, string> = {
    IIT: "bg-red-100 text-red-700",
    NIT: "bg-orange-100 text-orange-700",
    UNIVERSITY: "bg-blue-100 text-blue-700",
    GOVERNMENT: "bg-green-100 text-green-700",
    AUTONOMOUS: "bg-purple-100 text-purple-700",
    PRIVATE: "bg-gray-100 text-gray-700",
    DEEMED: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/colleges" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to colleges
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[college.type] ?? "bg-gray-100 text-gray-700"}`}>
                {college.type}
              </span>
              {college.naacGrade && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                  NAAC {college.naacGrade}
                </span>
              )}
              {college.nirfRank && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-50 text-gray-700">
                  NIRF #{college.nirfRank}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{college.name}</h1>
            <p className="text-gray-500 mt-1">{college.address}, {college.city} — {college.district}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Website ↗
              </a>
            )}
            <Link
              href={`/compare?add=${college.slug}`}
              className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Compare
            </Link>
          </div>
        </div>

        {college.description && (
          <p className="text-gray-600 mt-4 text-sm leading-relaxed">{college.description}</p>
        )}

        <div className="mt-4 text-sm text-gray-500 flex gap-6">
          {college.established && <span>Est. {college.established}</span>}
          {college.phone && <span>📞 {college.phone}</span>}
          {college.email && <span>✉️ {college.email}</span>}
        </div>
      </div>

      {/* Placement Stats */}
      {placement && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Placement Statistics ({placement.year})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{placement.placementPercent}%</div>
              <div className="text-xs text-green-600 mt-1">Placement Rate</div>
            </div>
            {placement.averagePackage && (
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{formatPackage(placement.averagePackage)}</div>
                <div className="text-xs text-blue-600 mt-1">Average Package</div>
              </div>
            )}
            {placement.highestPackage && (
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">{formatPackage(placement.highestPackage)}</div>
                <div className="text-xs text-purple-600 mt-1">Highest Package</div>
              </div>
            )}
            {placement.placedStudents && placement.totalStudents && (
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">{placement.placedStudents}/{placement.totalStudents}</div>
                <div className="text-xs text-orange-600 mt-1">Students Placed</div>
              </div>
            )}
          </div>
          {placement.topRecruiters.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Top Recruiters</p>
              <div className="flex flex-wrap gap-2">
                {placement.topRecruiters.map((r) => (
                  <span key={r} className="text-sm px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-700">{r}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Departments & Courses */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Departments & Courses</h2>
        <div className="space-y-4">
          {college.departments.map((dept) => (
            <div key={dept.id} className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">{dept.name}</h3>
              <div className="space-y-2">
                {dept.courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{course.name}</span>
                    <div className="flex gap-4 text-gray-500">
                      <span>{course.duration}yr</span>
                      {course.totalSeats && <span>{course.totalSeats} seats</span>}
                      {course.annualFee && <span className="text-blue-600 font-medium">{formatFee(course.annualFee)}</span>}
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
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {college.events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {event.eventType === "HACKATHON" ? "💻" : event.eventType === "CULTURAL" ? "🎭" : "📚"}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
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
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {college.facilities.map((f) => (
              <span key={f.id} className="text-sm px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-700">
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
