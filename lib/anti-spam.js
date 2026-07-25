/**
 * Lightweight in-memory anti-spam for inquiry POSTs.
 * Works per Node process (good enough for demo / single Vercel instance).
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_PER_IP = 3;
const TEL_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes per phone

/** @type {Map<string, number[]>} */
const ipHits = new Map();
/** @type {Map<string, number>} */
const telLast = new Map();

function prune(timestamps, now, windowMs) {
  return timestamps.filter((t) => now - t < windowMs);
}

function cleanupMaps(now) {
  for (const [ip, hits] of ipHits) {
    const kept = prune(hits, now, WINDOW_MS);
    if (kept.length) ipHits.set(ip, kept);
    else ipHits.delete(ip);
  }
  for (const [tel, at] of telLast) {
    if (now - at >= TEL_COOLDOWN_MS) telLast.delete(tel);
  }
}

/**
 * @returns {{ ok: true } | { ok: false, reason: 'honeypot' | 'ip' | 'tel', error: string }}
 */
export function checkInquirySpam({ ip, tel, honeypot }) {
  const now = Date.now();
  cleanupMaps(now);

  // Bots fill hidden fields — reject without writing to Sheet.
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return {
      ok: false,
      reason: "honeypot",
      error: "送信に失敗しました。時間をおいて再度お試しください。",
    };
  }

  if (ip) {
    const hits = prune(ipHits.get(ip) || [], now, WINDOW_MS);
    if (hits.length >= MAX_PER_IP) {
      return {
        ok: false,
        reason: "ip",
        error:
          "短時間に複数回のお申し込みがあります。しばらくしてから再度お試しください。",
      };
    }
  }

  if (tel) {
    const last = telLast.get(tel);
    if (last != null && now - last < TEL_COOLDOWN_MS) {
      return {
        ok: false,
        reason: "tel",
        error:
          "同じ電話番号でのお申し込みはしばらく間隔を空けてください。",
      };
    }
  }

  return { ok: true };
}

/** Call only after a lead was successfully accepted / written. */
export function recordInquirySpamHit({ ip, tel }) {
  const now = Date.now();
  if (ip) {
    const hits = prune(ipHits.get(ip) || [], now, WINDOW_MS);
    hits.push(now);
    ipHits.set(ip, hits);
  }
  if (tel) telLast.set(tel, now);
}
