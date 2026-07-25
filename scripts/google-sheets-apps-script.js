/**
 * Google Apps Script — paste into Extensions → Apps Script on your Sheet.
 *
 * 1. Create a Google Spreadsheet, put headers in row 1 (see lib/google-sheets.js).
 * 2. Extensions → Apps Script → paste this file.
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into .env as GOOGLE_SHEETS_WEBHOOK_URL
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("査定依頼") ||
      SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.timestampJa || data.timestamp || "",
      data.id || "",
      data.makerName || "",
      data.modelName || "",
      data.year || "",
      data.mileage || "",
      data.grade || "",
      data.color || "",
      data.carStatus || "",
      data.sellingTime || "",
      data.lastName || "",
      data.firstName || "",
      data.prefecture || "",
      data.city || "",
      data.zipcode || "",
      data.email || "",
      data.tel || "",
      data.estimateMin || "",
      data.estimateMax || "",
      data.ipAddress || "",
      data.userAgent || "",
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
