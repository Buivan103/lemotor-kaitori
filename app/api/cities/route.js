import { NextResponse } from "next/server";

/** Proxy HeartRails city list for a prefecture. */
export async function GET(req) {
  const pref = req.nextUrl.searchParams.get("prefecture") || "";
  if (!pref) {
    return NextResponse.json({ cities: [] });
  }
  try {
    const url = `https://geoapi.heartrails.com/api/json?method=getCities&prefecture=${encodeURIComponent(pref)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    const cities = (data?.response?.location || []).map((c) => c.city).filter(Boolean);
    // unique preserve order
    const uniq = [...new Set(cities)];
    return NextResponse.json({ cities: uniq });
  } catch {
    return NextResponse.json({ cities: [] });
  }
}
