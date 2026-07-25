import { NextResponse } from "next/server";
import { getMakers } from "@/lib/car-data";

// GET /api/makers -> list of makers grouped by category
export async function GET() {
  return NextResponse.json(getMakers());
}
