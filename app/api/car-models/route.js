import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/car-models?maker=MTOJ -> models for a maker
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const makerCode = searchParams.get("maker");
  if (!makerCode) {
    return NextResponse.json({ error: "maker is required" }, { status: 400 });
  }
  const maker = await prisma.maker.findUnique({ where: { code: makerCode } });
  if (!maker) return NextResponse.json({ models: [] });

  const models = await prisma.carModel.findMany({
    where: { makerId: maker.id },
    orderBy: { id: "asc" },
  });
  return NextResponse.json({ maker, models });
}
