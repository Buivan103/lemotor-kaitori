import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/applications -> recent applications ticker
export async function GET() {
  const apps = await prisma.application.findMany({
    orderBy: { appliedOn: "desc" },
    take: 30,
  });
  return NextResponse.json({ applications: apps });
}
