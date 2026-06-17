import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("collegeId") ?? "";

    let query = `SELECT * FROM "CollegeReview" WHERE 1=1`;
    const params: any[] = [];

    if (collegeId) {
      query += ` AND "collegeId" = $1`;
      params.push(collegeId);
    }
    query += ` ORDER BY "createdAt" DESC`;

    const rows = await prisma.$queryRawUnsafe(query, ...params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Reviews GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collegeId, authorName, batchYear, branch, rating, academics, placements, campus, faculty, content } = body;

    if (!collegeId || !authorName || !content || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await prisma.$queryRawUnsafe(
      `INSERT INTO "CollegeReview" ("collegeId","authorName","batchYear",branch,rating,academics,placements,campus,faculty,content)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      collegeId,
      authorName,
      batchYear ? Number(batchYear) : null,
      branch || null,
      Number(rating),
      academics ? Number(academics) : null,
      placements ? Number(placements) : null,
      campus ? Number(campus) : null,
      faculty ? Number(faculty) : null,
      content
    );
    return NextResponse.json((result as any[])[0]);
  } catch (err) {
    console.error("Reviews POST error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
