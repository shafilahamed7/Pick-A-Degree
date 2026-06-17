"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startDate: string;
  endDate: string | null;
  venue: string | null;
  registrationUrl: string | null;
  college: { id: string; name: string; slug: string; type: string; city: string; website: string | null };
};

const EVENT_META: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  HACKATHON:  { icon: "💻", label: "Hackathon",   color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-100" },
  WORKSHOP:   { icon: "🛠️", label: "Workshop",    color: "text-amber-700",  bg: "bg-amber-50 border-amber-100"  },
  CULTURAL:   { icon: "🎭", label: "Cultural",    color: "text-pink-700",   bg: "bg-pink-50 border-pink-100"    },
  TECHNICAL:  { icon: "⚙️", label: "Technical",   color: "text-blue-700",   bg: "bg-blue-50 border-blue-100"    },
  SEMINAR:    { icon: "🎤", label: "Seminar",     color: "text-violet-700", bg: "bg-violet-50 border-violet-100"},
  CONFERENCE: { icon: "🏛️", label: "Conference",  color: "text-teal-700",   bg: "bg-teal-50 border-teal-100"   },
  SPORTS:     { icon: "🏆", label: "Sports",      color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-100"},
  OTHER:      { icon: "📌", label: "Other",       color: "text-slate-600",  bg: "bg-slate-50 border-slate-100"  },
};

const COLLEGE_TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-50 text-red-700",
  NIT: "bg-orange-50 text-orange-700",
  UNIVERSITY: "bg-blue-50 text-blue-700",
  GOVERNMENT: "bg-emerald-50 text-emerald-700",
  AUTONOMOUS: "bg-violet-50 text-violet-700",
  PRIVATE: "bg-slate-100 text-slate-700",
  DEEMED: "bg-teal-50 text-teal-700",
};

function parseEntryFee(desc: string | null): string | null {
  if (!desc) return null;
  const match = desc.match(/Entry fee:\s*([^|]+)/i);
  return match ? match[1].trim() : null;
}

function parseMainDesc(desc: string | null): string {
  if (!desc) return "";
  return desc.replace(/\s*\|?\s*Entry fee:[^|]*/i, "").trim();
}

function daysUntil(date: string) {
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: "Past event", class: "text-slate-400" };
  if (diff === 0) return { label: "Today!", class: "text-emerald-600 font-bold" };
  if (diff <= 3) return { label: `In ${diff} day${diff > 1 ? "s" : ""}`, class: "text-amber-600 font-semibold" };
  return { label: `In ${diff} days`, class: "text-slate-400" };
}

const ALL_TYPES = Object.keys(EVENT_META);

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (activeType) params.set("type", activeType);
    setLoading(true);
    fetch(`/api/events?${params}`)
      .then((r) => r.json())
      .then((data) => { setEvents(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setEvents([]); setLoading(false); });
  }, [search, activeType]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Events & Activities</h1>
          <p className="text-slate-500 text-sm">Workshops, hackathons, cultural fests, seminars and more across Tamil Nadu colleges</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 shadow-sm">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search events, college, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
            />
          </div>
        </div>

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveType("")}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeType === "" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
          >
            All events
          </button>
          {ALL_TYPES.map((t) => {
            const m = EVENT_META[t];
            return (
              <button
                key={t}
                onClick={() => setActiveType(activeType === t ? "" : t)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeType === t ? `${m.bg} ${m.color} border-current` : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
              >
                {m.icon} {m.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400">
            <div className="text-4xl mb-3">🗓️</div>
            <p className="font-medium">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <div className="text-4xl mb-3">😕</div>
            <p className="font-medium text-slate-500">No events found</p>
            <button onClick={() => { setSearch(""); setActiveType(""); }}
              className="mt-3 text-sm text-indigo-600 hover:underline font-medium">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4 font-medium">{events.length} event{events.length !== 1 ? "s" : ""} found</p>
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event) => {
                const meta = EVENT_META[event.eventType] ?? EVENT_META.OTHER;
                const countdown = daysUntil(event.startDate);
                const entryFee = parseEntryFee(event.description);
                const mainDesc = parseMainDesc(event.description);
                const startDate = new Date(event.startDate);
                const endDate = event.endDate ? new Date(event.endDate) : null;
                const isMultiDay = endDate && endDate.toDateString() !== startDate.toDateString();

                return (
                  <div key={event.id} className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all ${meta.bg}`}>
                    {/* Top strip */}
                    <div className={`flex items-center justify-between px-5 py-3 border-b ${meta.bg}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{meta.icon}</span>
                        <span className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>{meta.label}</span>
                      </div>
                      <span className={`text-xs ${countdown.class}`}>{countdown.label}</span>
                    </div>

                    <div className="p-5 bg-white">
                      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">{event.title}</h3>

                      {mainDesc && (
                        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">{mainDesc}</p>
                      )}

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 mb-0.5 font-medium">Date</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            {isMultiDay && ` – ${endDate!.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                          </p>
                          <p className="text-xs text-slate-400">{startDate.getFullYear()}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 mb-0.5 font-medium">Entry fee</p>
                          <p className={`text-sm font-bold ${entryFee === "Free" ? "text-emerald-600" : "text-slate-800"}`}>
                            {entryFee ?? "Check college"}
                          </p>
                        </div>
                        {event.venue && (
                          <div className="col-span-2 bg-slate-50 rounded-xl p-3">
                            <p className="text-xs text-slate-400 mb-0.5 font-medium">Venue</p>
                            <p className="text-sm text-slate-700">{event.venue}</p>
                          </div>
                        )}
                      </div>

                      {/* College */}
                      <div className="flex items-center justify-between">
                        <Link href={`/colleges/${event.college.slug}`} className="flex items-center gap-2 group">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${COLLEGE_TYPE_COLORS[event.college.type] ?? "bg-slate-100 text-slate-600"}`}>
                            {event.college.name[0]}
                          </div>
                          <span className="text-xs text-slate-600 font-medium group-hover:text-indigo-600 transition-colors truncate max-w-48">
                            {event.college.name}
                          </span>
                          <span className="text-xs text-slate-400 shrink-0">· {event.college.city}</span>
                        </Link>
                        {event.registrationUrl || event.college.website ? (
                          <a
                            href={event.registrationUrl ?? event.college.website!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shrink-0"
                          >
                            Register ↗
                          </a>
                        ) : (
                          <Link href={`/colleges/${event.college.slug}`}
                            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shrink-0">
                            View college →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
