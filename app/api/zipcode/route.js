import { NextResponse } from "next/server";

/** Lookup address from zipcode via zipcloud. */
export async function GET(req) {
  const zip = (req.nextUrl.searchParams.get("zipcode") || "").replace(/\D/g, "");
  if (zip.length < 7) {
    return NextResponse.json({ ok: false, error: "invalid" });
  }
  try {
    const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    const row = data?.results?.[0];
    if (!row) {
      return NextResponse.json({ ok: false, error: "not_found" });
    }
    return NextResponse.json({
      ok: true,
      prefecture: row.address1,
      city: row.address2 || "",
      zipcode: zip,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "fetch_failed" });
  }
}
