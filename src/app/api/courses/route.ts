import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEGREE_NAME_MAP: Record<string, string> = {
  BTECH: "B.Tech", BE: "B.E", MBBS: "MBBS", BDS: "BDS",
  MTECH: "M.Tech", ME: "M.E", MBA: "MBA", MCA: "MCA",
  BSC: "B.Sc", MSC: "M.Sc", PHD: "Ph.D", MD: "MD", MS: "M.S",
};

const DEGREE_TYPE_MAP: Record<string, string> = {
  UG: "UG", PG: "PG", DIPLOMA: "DIPLOMA", RESEARCH: "RESEARCH", INTEGRATED: "INTEGRATED",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const degree = searchParams.get("degree") ?? "";

    const nameKeyword = degree ? DEGREE_NAME_MAP[degree] : null;
    const degreeType = degree ? DEGREE_TYPE_MAP[degree] : null;

    const andClauses: any[] = [];
    if (search) {
      andClauses.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { department: { name: { contains: search, mode: "insensitive" } } },
          { department: { college: { name: { contains: search, mode: "insensitive" } } } },
        ],
      });
    }
    if (degree) {
      if (nameKeyword) andClauses.push({ name: { contains: nameKeyword, mode: "insensitive" } });
      else if (degreeType) andClauses.push({ degreeType });
    }

    const courses = await prisma.course.findMany({
      where: andClauses.length ? { AND: andClauses } : {},
      include: {
        department: {
          include: {
            college: { select: { id: true, name: true, slug: true, type: true, city: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(courses);
  } catch (err) {
    console.error("Courses API error:", err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
