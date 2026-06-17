export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPackage, formatFee } from "@/lib/utils";
import Link from "next/link";
import CollegeClientSection from "./CollegeClientSection";

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-50 text-red-700", NIT: "bg-orange-50 text-orange-700",
  UNIVERSITY: "bg-blue-50 text-blue-700", GOVERNMENT: "bg-emerald-50 text-emerald-700",
  AUTONOMOUS: "bg-violet-50 text-violet-700", PRIVATE: "bg-slate-100 text-slate-700",
  DEEMED: "bg-teal-50 text-teal-700",
};

const NAAC_COLORS: Record<string, string> = {
  "A++": "bg-emerald-500 text-white", "A+": "bg-green-500 text-white",
  "A": "bg-teal-500 text-white", "B++": "bg-blue-500 text-white",
};

export default async function CollegePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let college;
  try {
    college = await prisma.college.findUnique({
      where: { slug },
      select: {
        id: true, name: true, slug: true, type: true, city: true, district: true,
        address: true, established: true, website: true, description: true,
        naacGrade: true, nirfRank: true, phone: true, email: true,
        placements: { orderBy: { year: "desc" }, take: 3 },
        departments: {
          select: {
            id: true, name: true,
            courses: { select: { id: true, name: true, duration: true, totalSeats: true, annualFee: true, degreeType: true } },
          },
        },
        facilities: { select: { id: true, name: true, type: true } },
        events: {
          orderBy: { startDate: "asc" },
          take: 5,
          select: { id: true, title: true, eventType: true, startDate: true, venue: true, registrationUrl: true },
        },
        jobOpenings: {
          take: 5,
          select: { id: true, title: true, department: true, jobType: true, staffCategory: true, lastDate: true, salary: true },
        },
      },
    });
  } catch (err) {
    console.error("College page error:", err);
    notFound();
  }

  if (!college) notFound();

  const placement = college.placements[0];
  const initials = college.name.split(" ").map((w: string) => w[0]).join("").slice(0, 3);
  const allCourses = college.departments.flatMap((d: any) => d.courses.map((c: any) => ({ ...c, deptName: d.name })));
  const minFee = allCourses.reduce((m: number, c: any) => c.annualFee && c.annualFee < m ? c.annualFee : m, Infinity);

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
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[college.type] ?? "bg-slate-100 text-slate-700"}`}>{college.type}</span>
                {college.naacGrade && <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${NAAC_COLORS[college.naacGrade] ?? "bg-slate-100 text-slate-700"}`}>NAAC {college.naacGrade}</span>}
                {college.nirfRank && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">NIRF #{college.nirfRank}</span>}
                {college.established && <span className="text-xs text-slate-400">Est. {college.established}</span>}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{college.name}</h1>
              <p className="text-sm text-slate-500">📍 {college.city} — {college.district}, Tamil Nadu</p>
            </div>
            <div className="flex gap-2 shrink-0 flex-wrap justify-end">
              {college.website && (
                <a href={college.website} target="_blank" rel="noopener noreferrer"
                  className="text-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                  Website ↗
                </a>
              )}
              <Link href={`/compare?add=${college.slug}`} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                + Compare
              </Link>
            </div>
          </div>

          {college.description && (
            <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-3xl">{college.description}</p>
          )}

          {/* Quick stats bar */}
          <div className="mt-5 flex flex-wrap gap-4">
            {placement && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-sm font-semibold text-slate-700">{placement.placementPercent}% placed</span>
                </div>
                {placement.averagePackage && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="text-sm font-semibold text-slate-700">{formatPackage(placement.averagePackage)} avg pkg</span>
                  </div>
                )}
              </>
            )}
            {minFee < Infinity && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="text-sm font-semibold text-slate-700">From {formatFee(minFee)}/yr</span>
              </div>
            )}
            {college.departments.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                <span className="text-sm font-semibold text-slate-700">{college.departments.length} departments</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        {/* Placement */}
        {placement && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">📊 Placement statistics · {placement.year}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
        {college.departments.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">📚 Departments & Courses</h2>
            <div className="space-y-3">
              {college.departments.map((dept: any) => (
                <div key={dept.id} className="border border-slate-100 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 text-sm">{dept.name}</h3>
                  {dept.courses.length > 0 ? (
                    <div className="space-y-2">
                      {dept.courses.map((course: any) => (
                        <div key={course.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                          <div>
                            <span className="text-slate-700">{course.name}</span>
                            <span className="ml-2 text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{course.degreeType}</span>
                          </div>
                          <div className="flex gap-4 text-slate-400 text-xs shrink-0 ml-4">
                            <span>{course.duration}yr</span>
                            {course.totalSeats && <span>{course.totalSeats} seats</span>}
                            {course.annualFee && <span className="text-indigo-600 font-semibold">{formatFee(course.annualFee)}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-slate-400">No courses listed</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews section (client component) */}
        <CollegeClientSection
          collegeId={college.id}
          collegeName={college.name}
          collegeSlug={college.slug}
          collegeType={college.type}
          collegeCity={college.city}
          collegeDistrict={college.district}
          nirfRank={college.nirfRank ?? null}
          naacGrade={college.naacGrade ?? null}
        />

        {/* Events */}
        {college.events.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">🗓️ Upcoming Events</h2>
            <div className="space-y-3">
              {college.events.map((event: any) => (
                <div key={event.id} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl shrink-0">
                    {event.eventType === "HACKATHON" ? "💻" : event.eventType === "CULTURAL" ? "🎭" : event.eventType === "WORKSHOP" ? "🛠️" : event.eventType === "SEMINAR" ? "🎤" : "📚"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">{event.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {event.venue && ` · ${event.venue}`}
                    </p>
                  </div>
                  {event.registrationUrl && (
                    <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg shrink-0 hover:bg-indigo-700">Register</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs */}
        {college.jobOpenings.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">💼 Job Openings</h2>
              <Link href="/jobs" className="text-xs text-indigo-600 font-medium hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {college.jobOpenings.map((job: any) => (
                <div key={job.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.department} · {job.staffCategory} · {job.jobType}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    {job.salary && <p className="text-xs font-semibold text-emerald-600">{job.salary}</p>}
                    {job.lastDate && <p className="text-xs text-slate-400">Due: {new Date(job.lastDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        {college.facilities.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">🏗️ Facilities</h2>
            <div className="flex flex-wrap gap-2">
              {college.facilities.map((f: any) => (
                <span key={f.id} className="text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        {(college.phone || college.email || college.website) && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">📞 Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {college.phone && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                  <a href={`tel:${college.phone}`} className="text-sm font-semibold text-slate-900 hover:text-indigo-600">{college.phone}</a>
                </div>
              )}
              {college.email && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <a href={`mailto:${college.email}`} className="text-sm font-semibold text-slate-900 hover:text-indigo-600 truncate block">{college.email}</a>
                </div>
              )}
              {college.website && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Website</p>
                  <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline truncate block">{college.website.replace(/^https?:\/\//, "")}</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
