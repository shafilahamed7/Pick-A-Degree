import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const eventType = searchParams.get("type") ?? "";

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { college: { name: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (eventType) where.eventType = eventType;

    const events = await prisma.event.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        eventType: true,
        startDate: true,
        endDate: true,
        venue: true,
        registrationUrl: true,
        college: { select: { id: true, name: true, slug: true, type: true, city: true, website: true } },
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error("Events API error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
