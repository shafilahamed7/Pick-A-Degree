import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const type = searchParams.get("type") ?? "";

    let query = `SELECT * FROM "EntranceExam" WHERE 1=1`;
    const params: any[] = [];
    let i = 1;

    if (search) {
      query += ` AND (name ILIKE $${i} OR "shortName" ILIKE $${i} OR description ILIKE $${i})`;
      params.push(`%${search}%`); i++;
    }
    if (type) {
      query += ` AND "examType" ILIKE $${i}`;
      params.push(`%${type}%`); i++;
    }
    query += ` ORDER BY "shortName" ASC`;

    const rows = await prisma.$queryRawUnsafe(query, ...params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Entrance exams API error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
