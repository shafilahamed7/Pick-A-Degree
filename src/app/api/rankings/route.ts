import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? "";
    const district = searchParams.get("district") ?? "";

    const where: any = { nirfRank: { not: null } };
    if (type) where.type = type;
    if (district) where.district = { contains: district, mode: "insensitive" };

    const colleges = await prisma.college.findMany({
      where,
      select: { id: true, name: true, slug: true, type: true, city: true, district: true, naacGrade: true, nirfRank: true, website: true, established: true },
      orderBy: { nirfRank: "asc" },
    });
    return NextResponse.json(colleges);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
