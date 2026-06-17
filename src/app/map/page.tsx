export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import MapWrapper from "./MapWrapper";

// TN college coordinates
const COORDS: Record<string, [number, number]> = {
  "Chennai": [13.0827, 80.2707], "Coimbatore": [11.0168, 76.9558],
  "Madurai": [9.9252, 78.1198], "Tiruchirappalli": [10.7905, 78.7047],
  "Salem": [11.6643, 78.1460], "Vellore": [12.9165, 79.1325],
  "Tirunelveli": [8.7139, 77.7567], "Erode": [11.3410, 77.7172],
  "Thoothukudi": [8.7642, 78.1348], "Dindigul": [10.3673, 77.9803],
  "Thanjavur": [10.7870, 79.1378], "Kanyakumari": [8.0883, 77.5385],
  "Cuddalore": [11.7480, 79.7714], "Nagapattinam": [10.7631, 79.8420],
  "Villupuram": [11.9401, 79.4861], "Tiruvannamalai": [12.2253, 79.0747],
  "Krishnagiri": [12.5186, 78.2137], "Dharmapuri": [12.1277, 78.1580],
  "Namakkal": [11.2189, 78.1674], "Karur": [10.9601, 78.0766],
  "Pudukkottai": [10.3797, 78.8236], "Sivaganga": [9.8477, 78.4800],
  "Virudhunagar": [9.5851, 77.9624], "Ramanathapuram": [9.3639, 78.8395],
  "Theni": [10.0104, 77.4777], "Ariyalur": [11.1405, 79.0786],
  "Perambalur": [11.2334, 78.8817], "Tiruppur": [11.1085, 77.3411],
  "Ranipet": [12.9227, 79.3330], "Kallakurichi": [11.7370, 78.9609],
  "Chengalpattu": [12.6920, 80.0004], "Tenkasi": [8.9598, 77.3152],
  "Tirupattur": [12.4967, 78.5722], "Mayiladuthurai": [11.1015, 79.6516],
};

function getCoords(city: string, district: string): [number, number] | null {
  return COORDS[city] ?? COORDS[district] ?? null;
}

export default async function MapPage() {
  const colleges = await prisma.college.findMany({
    select: {
      id: true, name: true, slug: true, type: true, city: true, district: true,
      nirfRank: true,
      placements: { orderBy: { year: "desc" }, take: 1, select: { placementPercent: true } },
    },
  });

  const mapped = colleges
    .map((c) => {
      const coords = getCoords(c.city, c.district);
      if (!coords) return null;
      // Add slight random offset so pins don't stack exactly
      const [lat, lng] = coords;
      return { ...c, lat: lat + (Math.random() - 0.5) * 0.05, lng: lng + (Math.random() - 0.5) * 0.05 };
    })
    .filter(Boolean) as any[];

  const types = ["IIT", "NIT", "UNIVERSITY", "GOVERNMENT", "AUTONOMOUS", "DEEMED", "PRIVATE"];
  const TYPE_COLORS: Record<string, string> = {
    IIT: "#dc2626", NIT: "#ea580c", UNIVERSITY: "#2563eb",
    GOVERNMENT: "#059669", AUTONOMOUS: "#7c3aed", PRIVATE: "#475569", DEEMED: "#0d9488",
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">College Map — Tamil Nadu</h1>
            <p className="text-slate-500 text-sm mt-0.5">Click any pin to see college details</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <span style={{ background: TYPE_COLORS[t], width: 8, height: 8, borderRadius: "50%", display: "inline-block" }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: "calc(100vh - 120px)", width: "100%", position: "relative" }}>
        <MapWrapper colleges={mapped} />
      </div>
    </div>
  );
}
