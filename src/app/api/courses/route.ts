import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Map friendly degree filter → course name keyword
const DEGREE_NAME_MAP: Record<string, string> = {
  BTECH: "B.Tech",
  BE: "B.E",
  MBBS: "MBBS",
  BDS: "BDS",
  MTECH: "M.Tech",
  ME: "M.E",
  MBA: "MBA",
  MCA: "MCA",
  BSC: "B.Sc",
  MSC: "M.Sc",
  PHD: "Ph.D",
  MD: "MD",
  MS: "M.S",
};

// These map to actual DegreeType enum values
const DEGREE_TYPE_MAP: Record<string, string> = {
  UG: "UG",
  PG: "PG",
  DIPLOMA: "DIPLOMA",
  RESEARCH: "RESEARCH",
  INTEGRATED: "INTEGRATED",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const degree = searchParams.get("degree") ?? "";

  const nameKeyword = degree ? DEGREE_NAME_MAP[degree] : null;
  const degreeType = degree ? DEGREE_TYPE_MAP[degree] : null;

  const courses = await prisma.course.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { department: { name: { contains: search, mode: "insensitive" } } },
            { department: { college: { name: { contains: search, mode: "insensitive" } } } },
          ],
        } : {},
        degree ? (
          nameKeyword
            ? { name: { contains: nameKeyword, mode: "insensitive" } }
            : degreeType
            ? { degreeType: degreeType as any }
            : {}
        ) : {},
      ],
    },
    include: {
      department: {
        include: {
          college: {
            select: { id: true, name: true, slug: true, type: true, city: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(courses);
}
