import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("collegeId") ?? "";
    const branch = searchParams.get("branch") ?? "";

    let query = `SELECT * FROM "Cutoff" WHERE 1=1`;
    const params: any[] = [];
    let i = 1;

    if (collegeId) {
      query += ` AND "collegeId" = $${i}`;
      params.push(collegeId); i++;
    }
    if (branch) {
      query += ` AND branch ILIKE $${i}`;
      params.push(`%${branch}%`); i++;
    }
    query += ` ORDER BY year DESC, category ASC`;

    const rows = await prisma.$queryRawUnsafe(query, ...params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Cutoffs API error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
