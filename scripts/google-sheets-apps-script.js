/**
 * Google Apps Script — paste into Extensions → Apps Script on your Sheet.
 *
 * 1. Create a Google Spreadsheet, put headers in row 1 (see lib/google-sheets.js).
 * 2. Extensions → Apps Script → paste this file.
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into .env as GOOGLE_SHEETS_WEBHOOK_URL
 * 5. (Optional) Script Properties → WEBHOOK_SECRET = same value as
 *    GOOGLE_SHEETS_WEBHOOK_SECRET in .env (sent as JSON field webhookSecret)
 */

/** Neutralize spreadsheet formula injection (=, +, -, @, ...). */
function safeCell(v, maxLen) {
  var limit = maxLen || 500;
  var s = String(v == null ? "" : v);
  if (s.length > limit) s = s.slice(0, limit);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var expected = PropertiesService.getScriptProperties().getProperty(
      "WEBHOOK_SECRET"
    );
    if (expected && data.webhookSecret !== expected) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "unauthorized" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("査定依頼") ||
      SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      safeCell(data.timestampJa || data.timestamp || ""),
      safeCell(data.id || "", 40),
      safeCell(data.vehicleKind || "", 40),
      safeCell(data.welcomeIntent || "", 40),
      safeCell(data.makerName || "", 80),
      safeCell(data.modelName || "", 80),
      safeCell(data.chassisModel || "", 60),
      safeCell(data.year || "", 40),
      safeCell(data.mileage || "", 40),
      safeCell(data.grade || "", 40),
      safeCell(data.color || "", 40),
      safeCell(data.carStatus || "", 10),
      safeCell(data.sellingTime || "", 10),
      safeCell(data.lastName || "", 40),
      safeCell(data.firstName || "", 40),
      safeCell(data.prefecture || "", 20),
      safeCell(data.city || "", 60),
      safeCell(data.zipcode || "", 10),
      safeCell(data.email || "", 120),
      safeCell(data.tel || "", 20),
      safeCell(data.estimateMin || "", 10),
      safeCell(data.estimateMax || "", 10),
      safeCell(data.ipAddress || "", 64),
      safeCell(data.userAgent || "", 300),
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
