import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const eventType = searchParams.get("type") ?? "";

  const events = await prisma.event.findMany({
    where: {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { college: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(eventType && { eventType: eventType as any }),
    },
    include: {
      college: { select: { id: true, name: true, slug: true, type: true, city: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(events);
}
