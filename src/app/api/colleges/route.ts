import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const district = searchParams.get("district");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const minPlacement = searchParams.get("minPlacement");

    const where: any = {};

    if (city) where.city = { contains: city, mode: "insensitive" };
    if (district) where.district = { contains: district, mode: "insensitive" };
    if (type) where.type = { in: type.split(",") };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { district: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const colleges = await prisma.college.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        city: true,
        district: true,
        naacGrade: true,
        nirfRank: true,
        website: true,
        description: true,
        placements: {
          orderBy: { year: "desc" },
          take: 1,
          select: {
            placementPercent: true,
            averagePackage: true,
            highestPackage: true,
            topRecruiters: true,
          },
        },
        departments: {
          select: {
            name: true,
            courses: {
              select: { name: true, annualFee: true },
            },
          },
        },
        facilities: {
          select: { name: true },
        },
      },
      orderBy: [{ name: "asc" }],
    });

    const filtered = minPlacement
      ? colleges.filter(
          (c) => (c.placements[0]?.placementPercent ?? 0) >= parseFloat(minPlacement)
        )
      : colleges;

    return NextResponse.json(filtered);
  } catch (err) {
    console.error("Colleges API error:", err);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}
