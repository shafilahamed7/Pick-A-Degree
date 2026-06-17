import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("collegeId") ?? "";

    const where: any = {};
    if (collegeId) where.collegeId = collegeId;

    const rows = await (prisma as any).collegeReview.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
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
    const review = await (prisma as any).collegeReview.create({
      data: { collegeId, authorName, batchYear: batchYear ? Number(batchYear) : null, branch, rating: Number(rating), academics: academics ? Number(academics) : null, placements: placements ? Number(placements) : null, campus: campus ? Number(campus) : null, faculty: faculty ? Number(faculty) : null, content },
    });
    return NextResponse.json(review);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
