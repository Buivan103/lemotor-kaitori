import { NextResponse } from "next/server";
import { digitsOnlyPhone, isValidJapanesePhone } from "@/lib/phone";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { appendInquiryToSheet, buildSheetRow } from "@/lib/google-sheets";
import { estimateMarketPrice, estimateCommercialPrice } from "@/lib/estimate";
import {
  checkRequestBurst,
  checkInquirySpam,
  recordInquirySpamHit,
} from "@/lib/anti-spam";
import {
  isAllowedOrigin,
  isJsonContentType,
  readJsonBody,
} from "@/lib/request-guard";
import { allowOnly, cleanText, clampInt, sheetSafe } from "@/lib/sanitize";
import {
  COMMERCIAL_CATEGORIES,
  COMMERCIAL_USAGE,
  COMMERCIAL_YEARS,
  YEARS,
  MILEAGES,
  PREFECTURES,
  COLORS,
  GRADES,
} from "@/lib/constants";

function newInquiryId() {
  return `LM-${Date.now().toString(36).toUpperCase()}`;
}

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

function sanitizeBody(raw) {
  const isCommercial = raw.vehicleKind === "commercial";
  const colorValues = COLORS.map((c) => c.value);

  return {
    vehicleKind: isCommercial ? "commercial" : "passenger",
    makerCode: cleanText(raw.makerCode, 40),
    makerName: sheetSafe(raw.makerName, 80),
    modelCode: cleanText(raw.modelCode, 40),
    modelName: sheetSafe(raw.modelName, 80),
    commercialCategory: allowOnly(raw.commercialCategory, COMMERCIAL_CATEGORIES),
    chassisModel: sheetSafe(raw.chassisModel, 60),
    year: cleanText(raw.year, 20),
    yearLabel: isCommercial
      ? allowOnly(raw.yearLabel, COMMERCIAL_YEARS)
      : allowOnly(raw.yearLabel, YEARS) || cleanText(raw.yearLabel, 40),
    grade: allowOnly(raw.grade, GRADES) || sheetSafe(raw.grade, 40),
    mileage: isCommercial
      ? allowOnly(raw.mileage, COMMERCIAL_USAGE)
      : allowOnly(raw.mileage, MILEAGES),
    color: allowOnly(raw.color, colorValues) || cleanText(raw.color, 40),
    colorLabel: sheetSafe(raw.colorLabel, 40),
    carStatus: clampInt(raw.carStatus, { min: 1, max: 4, fallback: 1 }),
    sellingTime: clampInt(raw.sellingTime, { min: 0, max: 5, fallback: 3 }),
    lastName: sheetSafe(raw.lastName, 40),
    firstName: sheetSafe(raw.firstName, 40),
    prefecture: allowOnly(raw.prefecture, PREFECTURES),
    city: sheetSafe(raw.city, 60),
    zipcode: cleanText(String(raw.zipcode || "").replace(/[^\d-]/g, ""), 10),
    email: normalizeEmail(raw.email),
    tel: cleanText(raw.tel, 20),
    contactTime: sheetSafe(raw.contactTime, 40),
    website: typeof raw.website === "string" ? raw.website : "",
    companyUrl: typeof raw.companyUrl === "string" ? raw.companyUrl : "",
    _startedAt: raw._startedAt,
    welcomeIntent: allowOnly(raw.welcomeIntent, [
      "不要な車がある",
      "乗換を検討中",
      "提案は必要ない",
    ]),
  };
}

function resolveEstimate(body) {
  if (body.vehicleKind === "commercial") {
    return estimateCommercialPrice({
      commercialCategory: body.commercialCategory,
      year: body.yearLabel || body.year,
      mileage: body.mileage,
    });
  }
  return estimateMarketPrice({
    makerCode: body.makerCode,
    modelName: body.modelName,
    year: body.year,
    mileage: body.mileage,
    carStatus: Number(body.carStatus ?? 1),
    grade: body.grade,
    color: body.color,
  });
}

// POST /api/inquiries -> estimate + append lead to Google Sheet
export async function POST(request) {
  try {
    const ip = clientIp(request);

    const burst = checkRequestBurst(ip);
    if (!burst.ok) {
      return NextResponse.json({ error: burst.error }, { status: 429 });
    }

    if (!isJsonContentType(request)) {
      return NextResponse.json(
        { error: "不正なリクエストです。" },
        { status: 415 }
      );
    }

    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        { error: "不正なリクエストです。" },
        { status: 403 }
      );
    }

    const parsed = await readJsonBody(request);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error },
        { status: parsed.status }
      );
    }

    const body = sanitizeBody(parsed.body);
    const userAgent = cleanText(request.headers.get("user-agent") || "", 300);
    const isCommercial = body.vehicleKind === "commercial";

    if (isCommercial) {
      if (!body.commercialCategory) {
        return NextResponse.json(
          { error: "車種を選択してください" },
          { status: 422 }
        );
      }
      if (!body.year && !body.yearLabel) {
        return NextResponse.json(
          { error: "年式を選択してください" },
          { status: 422 }
        );
      }
      if (!body.mileage) {
        return NextResponse.json(
          { error: "走行距離 / 稼働時間を選択してください" },
          { status: 422 }
        );
      }
      if (!body.prefecture) {
        return NextResponse.json(
          { error: "都道府県を選択してください" },
          { status: 422 }
        );
      }
    } else if (!body.makerCode && !body.makerName) {
      return NextResponse.json(
        { error: "メーカーを選択してください" },
        { status: 422 }
      );
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "正しいメールアドレスを入力してください" },
        { status: 422 }
      );
    }

    if (!isValidJapanesePhone(body.tel)) {
      return NextResponse.json(
        { error: "正しい日本の電話番号を入力してください" },
        { status: 422 }
      );
    }

    const email = body.email;
    const tel = digitsOnlyPhone(body.tel);

    // Honeypot / rate / timing — bots get fake OK; humans get 429.
    const spam = checkInquirySpam({
      ip,
      tel,
      email,
      honeypot: body.website || body.companyUrl || "",
      startedAt: body._startedAt,
    });
    if (!spam.ok) {
      if (spam.reason === "honeypot" || spam.reason === "timing") {
        const { min, max } = resolveEstimate(body);
        return NextResponse.json(
          {
            ok: true,
            id: newInquiryId(),
            estimate: { min, max },
            message: "査定依頼を受け付けました。担当より順次ご連絡いたします。",
          },
          { status: 201 }
        );
      }
      return NextResponse.json({ error: spam.error }, { status: 429 });
    }

    const carStatus = body.carStatus;
    const { min, max } = resolveEstimate(body);
    const id = newInquiryId();

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

    recordInquirySpamHit({ ip, tel, email });

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

// GET /api/inquiries — do not expose leads
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
