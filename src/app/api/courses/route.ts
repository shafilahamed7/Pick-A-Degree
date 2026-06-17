import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const courses = await prisma.course.findMany({
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
