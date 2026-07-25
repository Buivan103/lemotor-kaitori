import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/makers -> list of makers grouped by category
export async function GET() {
  const makers = await prisma.maker.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({
    domestic: makers.filter((m) => m.category === "domestic"),
    imported: makers.filter((m) => m.category === "imported"),
  });
}
