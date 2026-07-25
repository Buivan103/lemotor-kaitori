import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Very rough market-price estimator (万円). Purely illustrative, like the
// "独自算出した相場価格" the real site shows.
function estimate({ makerCode, year, mileage, carStatus }) {
  let base = 80; // 万円
  const y = year ? parseInt(year, 10) : NaN;
  if (!Number.isNaN(y)) base = Math.max(5, base - (2026 - y) * 6);

  const mIdx = mileage ? parseInt(mileage, 10) : 0; // first number in "50001～"
  if (mIdx > 150000) base *= 0.4;
  else if (mIdx > 100000) base *= 0.6;
  else if (mIdx > 50000) base *= 0.8;

  if (carStatus === 2) base *= 0.6;
  if (carStatus === 3) base *= 0.35;
  if (carStatus === 4) base *= 0.25;

  const premium = ["MLEJ", "MMEG", "MBMG", "MPOG", "MADG"].includes(makerCode);
  if (premium) base *= 1.6;

  const min = Math.max(1, Math.round(base * 0.85));
  const max = Math.max(min + 1, Math.round(base * 1.25));
  return { min, max };
}

// POST /api/inquiries -> create a new appraisal request (lead)
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.makerCode && !body.makerName) {
      return NextResponse.json(
        { error: "メーカーを選択してください" },
        { status: 422 }
      );
    }

    const carStatus = Number(body.carStatus ?? 1);
    const mileageNum = body.mileage
      ? parseInt(String(body.mileage).replace(/[^0-9]/g, ""), 10)
      : 0;
    const yearNum = body.year ? parseInt(String(body.year), 10) : null;

    const { min, max } = estimate({
      makerCode: body.makerCode,
      year: yearNum,
      mileage: mileageNum,
      carStatus,
    });

    const inquiry = await prisma.inquiry.create({
      data: {
        makerCode: body.makerCode || null,
        makerName: body.makerName || null,
        modelCode: body.modelCode || null,
        modelName: body.modelName || null,
        year: body.year || null,
        mileage: body.mileage || null,
        carStatus,
        sellingTime: Number(body.sellingTime ?? 3),
        lastName: body.lastName || null,
        firstName: body.firstName || null,
        prefecture: body.prefecture || null,
        city: body.city || null,
        zipcode: body.zipcode || null,
        email: body.email || null,
        tel: body.tel || null,
        contactTime: body.contactTime || null,
        estimateMin: min,
        estimateMax: max,
        ipAddress:
          request.headers.get("x-forwarded-for")?.split(",")[0] || null,
        userAgent: request.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        id: inquiry.id,
        estimate: { min, max },
        message: "査定依頼を受け付けました。担当より順次ご連絡いたします。",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to create inquiry", err);
    return NextResponse.json(
      { error: "送信に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}

// GET /api/inquiries -> simple admin listing (latest leads)
export async function GET() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ count: inquiries.length, inquiries });
}
