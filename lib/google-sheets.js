import { sheetSafe, cleanText } from "@/lib/sanitize";
import { CAR_STATUS, SELLING_TIME } from "@/lib/constants";

function labelFromOptions(value, options, fallback = "") {
  const hit = options.find((o) => Number(o.value) === Number(value));
  return hit ? hit.label : fallback;
}

/**
 * Append an inquiry row via Google Apps Script Web App webhook.
 * Set GOOGLE_SHEETS_WEBHOOK_URL to the deployed script URL.
 *
 * Expected sheet columns (row 1 headers):
 * 日時 | 受付番号 | 区分 | 提案希望 | メーカー | 車種 | 型式 | 年式 | 走行距離 | グレード | 色 |
 * 車両状態 | 売却時期 | 姓 | 名 | 都道府県 | 市区町村 | 郵便番号 |
 * メール | 電話 | 相場下限(万円) | 相場上限(万円) | IP | UA
 *
 * Optional: GOOGLE_SHEETS_WEBHOOK_SECRET (also set WEBHOOK_SECRET in Apps Script)
 */
export async function appendInquiryToSheet(row) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not configured");
  }

  const secret = String(process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .pop(); // if pasted with labels, keep last non-empty line
  const payload = secret ? { ...row, webhookSecret: secret } : row;

  const headers = { "Content-Type": "application/json" };
  if (secret) headers["X-Webhook-Secret"] = secret;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Sheet webhook failed (${res.status}): ${text.slice(0, 200)}`);
  }

  return true;
}

export function buildSheetRow({ body, tel, carStatus, estimate, ip, userAgent, id }) {
  const now = new Date();
  const isCommercial = body.vehicleKind === "commercial";
  return {
    timestamp: now.toISOString(),
    timestampJa: now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    id: cleanText(id, 40),
    vehicleKind: isCommercial ? "トラック・重機" : "乗用車",
    welcomeIntent: sheetSafe(body.welcomeIntent || "", 40),
    makerCode: cleanText(body.makerCode, 40),
    makerName: sheetSafe(body.makerName, 80),
    modelCode: cleanText(body.modelCode, 40),
    modelName: sheetSafe(
      isCommercial
        ? body.commercialCategory || body.modelName || ""
        : body.modelName || "",
      80
    ),
    chassisModel: sheetSafe(body.chassisModel, 60),
    year: sheetSafe(body.yearLabel || body.year || "", 40),
    mileage: sheetSafe(body.mileage, 40),
    grade: sheetSafe(body.grade, 40),
    color: sheetSafe(body.colorLabel || body.color || "", 40),
    carStatus: sheetSafe(
      labelFromOptions(carStatus, CAR_STATUS, String(carStatus ?? "")),
      40
    ),
    sellingTime: sheetSafe(
      labelFromOptions(body.sellingTime ?? 3, SELLING_TIME, String(body.sellingTime ?? "")),
      40
    ),
    lastName: sheetSafe(body.lastName, 40),
    firstName: sheetSafe(body.firstName, 40),
    prefecture: sheetSafe(body.prefecture, 20),
    city: sheetSafe(body.city, 60),
    zipcode: cleanText(body.zipcode, 10),
    email: cleanText(body.email, 120),
    tel: cleanText(tel, 20),
    estimateMin: estimate.min,
    estimateMax: estimate.max,
    ipAddress: cleanText(ip, 64),
    userAgent: cleanText(userAgent, 300),
  };
}
