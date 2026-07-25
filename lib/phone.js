/**
 * Japanese domestic phone validation.
 * Covers: 固定電話 / 携帯(070|080|090|060) / IP電話(050)
 * Hyphens and full-width digits are accepted.
 *
 * Based on 総務省-style patterns (a-better-jp-phone-regex).
 */
const JP_PHONE_RE =
  /^(0([1-9]-?[1-9]\d{3}|[1-9]{2}-?\d{3}|[1-9]{2}\d-?\d{2}|[1-9]{2}\d{2}-?\d)-?\d{4}|0[6789]0-?\d{4}-?\d{4}|050-?\d{4}-?\d{4})$/;

/** Convert full-width digits / dashes to half-width ASCII. */
export function normalizeJapanesePhone(raw) {
  return String(raw || "")
    .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/[−ー‐‑–—―]/g, "-")
    .replace(/[^\d-]/g, "")
    .trim();
}

/** Digits only (for storage / tel: links). */
export function digitsOnlyPhone(raw) {
  return normalizeJapanesePhone(raw).replace(/\D/g, "");
}

export function isValidJapanesePhone(raw) {
  const normalized = normalizeJapanesePhone(raw);
  if (!normalized) return false;
  return JP_PHONE_RE.test(normalized);
}
