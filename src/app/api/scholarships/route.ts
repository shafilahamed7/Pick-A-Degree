import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const govOnly = searchParams.get("gov") === "1";

    let query = `SELECT * FROM "Scholarship" WHERE 1=1`;
    const params: any[] = [];
    let i = 1;

    if (search) {
      query += ` AND (name ILIKE $${i} OR provider ILIKE $${i} OR eligibility ILIKE $${i})`;
      params.push(`%${search}%`); i++;
    }
    if (category) {
      query += ` AND category ILIKE $${i}`;
      params.push(`%${category}%`); i++;
    }
    if (govOnly) {
      query += ` AND "isGovernment" = true`;
    }
    query += ` ORDER BY name ASC`;

    const rows = await prisma.$queryRawUnsafe(query, ...params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Scholarships API error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
