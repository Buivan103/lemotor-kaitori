/**
 * Lightweight input hardening for Sheet-backed leads (no SQL DB).
 * Blocks spreadsheet formula injection and caps field sizes.
 */

const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;

/** Strip control / zero-width chars and enforce max length. */
export function cleanText(value, maxLen = 200) {
  return String(value ?? "")
    .replace(CTRL, "")
    .replace(ZERO_WIDTH, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

/**
 * Neutralize Google Sheets / Excel formula injection.
 * Leading = + - @ \t \r can execute as formulas when pasted into cells.
 */
export function sheetSafe(value, maxLen = 200) {
  let s = cleanText(value, maxLen);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return s;
}

/** Keep only allowlisted string, else empty. */
export function allowOnly(value, allowed) {
  const s = String(value ?? "");
  return allowed.includes(s) ? s : "";
}

export function clampInt(value, { min, max, fallback }) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}
