import { NextResponse } from "next/server";
import { getApplications } from "@/lib/car-data";

// GET /api/applications -> recent applications ticker
export async function GET() {
  return NextResponse.json({ applications: getApplications(30) });
}
