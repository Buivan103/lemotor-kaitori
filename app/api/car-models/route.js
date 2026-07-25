import { NextResponse } from "next/server";
import { findMaker, getCarModelsByMaker } from "@/lib/car-data";

// GET /api/car-models?maker=MTOJ -> models for a maker
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const makerCode = searchParams.get("maker");
  if (!makerCode) {
    return NextResponse.json({ error: "maker is required" }, { status: 400 });
  }

  const maker = findMaker(makerCode);
  if (!maker) return NextResponse.json({ models: [] });

  const models = getCarModelsByMaker(makerCode);
  return NextResponse.json({ maker, models });
}
