import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const staffCategory = searchParams.get("category") ?? "";
    const jobType = searchParams.get("jobType") ?? "";

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { college: { name: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (staffCategory) where.staffCategory = staffCategory;
    if (jobType) where.jobType = jobType;

    const jobs = await prisma.jobOpening.findMany({
      where,
      include: {
        college: { select: { id: true, name: true, slug: true, type: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (err) {
    console.error("Jobs API error:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
