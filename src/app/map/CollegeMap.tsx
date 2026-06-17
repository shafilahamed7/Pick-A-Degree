"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type MapCollege = {
  id: string;
  name: string;
  slug: string;
  type: string;
  city: string;
  lat: number;
  lng: number;
  nirfRank: number | null;
  placements: { placementPercent: number }[];
};

const TYPE_COLORS: Record<string, string> = {
  IIT: "#dc2626", NIT: "#ea580c", UNIVERSITY: "#2563eb",
  GOVERNMENT: "#059669", AUTONOMOUS: "#7c3aed", PRIVATE: "#475569", DEEMED: "#0d9488",
};

export default function CollegeMap({ colleges }: { colleges: MapCollege[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current, {
        center: [11.1, 78.6],
        zoom: 7,
        scrollWheelZoom: true,
      });
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      colleges.forEach((c) => {
        const color = TYPE_COLORS[c.type] ?? "#475569";
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:16px;height:16px;
            background:${color};
            border:2.5px solid white;
            border-radius:50%;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            cursor:pointer;
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        const placement = c.placements[0]?.placementPercent;
        L.marker([c.lat, c.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:190px;font-family:system-ui,sans-serif;padding:2px">
              <div style="font-weight:700;font-size:14px;color:#0f172a;margin-bottom:4px;line-height:1.3">${c.name}</div>
              <div style="font-size:12px;color:#64748b;margin-bottom:8px">${c.city}</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:11px;margin-bottom:10px">
                <span style="background:${color}22;color:${color};padding:2px 8px;border-radius:20px;font-weight:700;border:1px solid ${color}44">${c.type}</span>
                ${c.nirfRank ? `<span style="background:#fef3c7;color:#d97706;padding:2px 8px;border-radius:20px;font-weight:700">NIRF #${c.nirfRank}</span>` : ""}
                ${placement ? `<span style="background:#d1fae5;color:#059669;padding:2px 8px;border-radius:20px;font-weight:700">${placement}% placed</span>` : ""}
              </div>
              <a href="/colleges/${c.slug}" style="display:inline-block;background:#4f46e5;color:white;padding:5px 14px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none">View Profile →</a>
            </div>
          `, { maxWidth: 240 });
      });
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [ready, colleges]);

  if (!ready) return (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium">Loading map...</p>
      </div>
    </div>
  );

  return <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "500px" }} />;
}
