/**
 * Append an inquiry row via Google Apps Script Web App webhook.
 * Set GOOGLE_SHEETS_WEBHOOK_URL to the deployed script URL.
 *
 * Expected sheet columns (row 1 headers):
 * 日時 | 受付番号 | メーカー | 車種 | 年式 | 走行距離 | グレード | 色 |
 * 車両状態 | 売却時期 | 姓 | 名 | 都道府県 | 市区町村 | 郵便番号 |
 * メール | 電話 | 相場下限(万円) | 相場上限(万円) | IP | UA
 */
export async function appendInquiryToSheet(row) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not configured");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
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
  return {
    timestamp: now.toISOString(),
    timestampJa: now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    id,
    makerCode: body.makerCode || "",
    makerName: body.makerName || "",
    modelCode: body.modelCode || "",
    modelName: body.modelName || "",
    year: body.year || "",
    mileage: body.mileage || "",
    grade: body.grade || "",
    color: body.colorLabel || body.color || "",
    carStatus,
    sellingTime: Number(body.sellingTime ?? 3),
    lastName: body.lastName || "",
    firstName: body.firstName || "",
    prefecture: body.prefecture || "",
    city: body.city || "",
    zipcode: body.zipcode || "",
    email: body.email || "",
    tel: tel || "",
    estimateMin: estimate.min,
    estimateMax: estimate.max,
    ipAddress: ip || "",
    userAgent: userAgent || "",
  };
}
