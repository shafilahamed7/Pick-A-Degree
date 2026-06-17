"use client";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, { center: [11.0, 78.6], zoom: 7, zoomControl: true });
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      colleges.forEach((c) => {
        const color = TYPE_COLORS[c.type] ?? "#475569";
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const placement = c.placements[0]?.placementPercent;
        L.marker([c.lat, c.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:180px;font-family:sans-serif">
              <div style="font-weight:700;font-size:14px;color:#0f172a;margin-bottom:4px">${c.name}</div>
              <div style="font-size:12px;color:#64748b;margin-bottom:6px">${c.city}</div>
              <div style="display:flex;gap:8px;font-size:12px">
                <span style="background:${color}20;color:${color};padding:2px 8px;border-radius:20px;font-weight:600">${c.type}</span>
                ${c.nirfRank ? `<span style="color:#d97706;font-weight:600">NIRF #${c.nirfRank}</span>` : ""}
                ${placement ? `<span style="color:#059669;font-weight:600">${placement}%</span>` : ""}
              </div>
              <a href="/colleges/${c.slug}" style="display:inline-block;margin-top:8px;font-size:12px;color:#4f46e5;font-weight:600">View profile →</a>
            </div>
          `);
      });
    });

    return () => { mapInstance.current?.remove(); mapInstance.current = null; };
  }, [colleges]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
