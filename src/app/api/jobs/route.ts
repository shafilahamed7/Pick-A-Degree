import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const staffCategory = searchParams.get("category") ?? "";
  const jobType = searchParams.get("jobType") ?? "";

  const jobs = await prisma.jobOpening.findMany({
    where: {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { department: { contains: search, mode: "insensitive" } },
          { college: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(staffCategory && { staffCategory: staffCategory as any }),
      ...(jobType && { jobType: jobType as any }),
    },
    include: {
      college: { select: { id: true, name: true, slug: true, type: true, city: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}
