import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("collegeId") ?? "";
    const branch = searchParams.get("branch") ?? "";

    const where: any = {};
    if (collegeId) where.collegeId = collegeId;
    if (branch) where.branch = { contains: branch, mode: "insensitive" };

    const rows = await (prisma as any).cutoff.findMany({
      where,
      orderBy: [{ year: "desc" }, { category: "asc" }],
    });
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
