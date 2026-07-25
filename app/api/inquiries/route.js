import { NextResponse } from "next/server";
import { digitsOnlyPhone, isValidJapanesePhone } from "@/lib/phone";
import { appendInquiryToSheet, buildSheetRow } from "@/lib/google-sheets";
import { estimateMarketPrice } from "@/lib/estimate";

function newInquiryId() {
  return `LM-${Date.now().toString(36).toUpperCase()}`;
}

// POST /api/inquiries -> estimate + append lead to Google Sheet
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.makerCode && !body.makerName) {
      return NextResponse.json(
        { error: "メーカーを選択してください" },
        { status: 422 }
      );
    }

    if (!isValidJapanesePhone(body.tel)) {
      return NextResponse.json(
        { error: "正しい日本の電話番号を入力してください" },
        { status: 422 }
      );
    }

    const tel = digitsOnlyPhone(body.tel);

    const carStatus = Number(body.carStatus ?? 1);

    const { min, max } = estimateMarketPrice({
      makerCode: body.makerCode,
      modelName: body.modelName,
      year: body.year,
      mileage: body.mileage,
      carStatus,
      grade: body.grade,
      color: body.color,
    });

    const id = newInquiryId();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const userAgent = request.headers.get("user-agent") || null;

    const row = buildSheetRow({
      body,
      tel,
      carStatus,
      estimate: { min, max },
      ip,
      userAgent,
      id,
    });

    const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhook) {
      await appendInquiryToSheet(row);
    } else if (process.env.NODE_ENV === "production") {
      console.error("GOOGLE_SHEETS_WEBHOOK_URL is missing in production");
      return NextResponse.json(
        { error: "送信に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    } else {
      console.warn(
        "[dev] GOOGLE_SHEETS_WEBHOOK_URL unset — lead not written to Sheet:",
        row
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id,
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

// GET /api/inquiries -> leads live in Google Sheet (no local list)
export async function GET() {
  return NextResponse.json({
    count: 0,
    inquiries: [],
    message:
      "査定依頼は Google スプレッドシートで管理します。GOOGLE_SHEETS_WEBHOOK_URL を設定してください。",
  });
}
