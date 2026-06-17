import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CollegeType } from ".prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const district = searchParams.get("district");
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const minPlacement = searchParams.get("minPlacement");
  const maxFee = searchParams.get("maxFee");

  const colleges = await prisma.college.findMany({
    where: {
      ...(city && { city: { contains: city, mode: "insensitive" } }),
      ...(district && { district: { contains: district, mode: "insensitive" } }),
      ...(type && { type: { in: type.split(",") as CollegeType[] } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { district: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      placements: { orderBy: { year: "desc" }, take: 1 },
      departments: { include: { courses: true } },
      facilities: true,
    },
    orderBy: [{ nirfRank: "asc" }, { name: "asc" }],
  });

  const filtered = minPlacement
    ? colleges.filter((c: typeof colleges[0]) =>
        (c.placements[0]?.placementPercent ?? 0) >= parseFloat(minPlacement)
      )
    : colleges;

  return NextResponse.json(filtered);
}
