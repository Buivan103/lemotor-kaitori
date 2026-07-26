/**
 * Lightweight in-memory anti-spam for inquiry POSTs.
 * No Redis / captcha — suitable for a cheap single-instance host.
 *
 * Limits (per Node process):
 * - Burst: max POSTs per IP per minute (blocks hammering)
 * - Global: soft cap on all POSTs per minute (protects weak CPU)
 * - Lead: max successful leads per IP / phone / email window
 * - Timing: reject instant bot fills (client sends _startedAt)
 * - Honeypot: hidden field must stay empty
 */

const BURST_WINDOW_MS = 60 * 1000;
const MAX_BURST_PER_IP = 8;
const MAX_GLOBAL_PER_MIN = 45;

const LEAD_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LEADS_PER_IP = 3;
const TEL_COOLDOWN_MS = 30 * 60 * 1000;
const EMAIL_COOLDOWN_MS = 30 * 60 * 1000;

/** Humans need a few seconds; bots often POST instantly. */
const MIN_FILL_MS = 4_000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000; // 24h — discard stale tokens

/** @type {Map<string, number[]>} */
const ipBursts = new Map();
/** @type {number[]} */
let globalBursts = [];
/** @type {Map<string, number[]>} */
const ipLeads = new Map();
/** @type {Map<string, number>} */
const telLast = new Map();
/** @type {Map<string, number>} */
const emailLast = new Map();

const GENERIC_ERROR =
  "送信に失敗しました。時間をおいて再度お試しください。";
const RATE_ERROR =
  "短時間に複数回のお申し込みがあります。しばらくしてから再度お試しください。";

function prune(timestamps, now, windowMs) {
  return timestamps.filter((t) => now - t < windowMs);
}

function cleanupMaps(now) {
  for (const [ip, hits] of ipBursts) {
    const kept = prune(hits, now, BURST_WINDOW_MS);
    if (kept.length) ipBursts.set(ip, kept);
    else ipBursts.delete(ip);
  }
  globalBursts = prune(globalBursts, now, BURST_WINDOW_MS);

  for (const [ip, hits] of ipLeads) {
    const kept = prune(hits, now, LEAD_WINDOW_MS);
    if (kept.length) ipLeads.set(ip, kept);
    else ipLeads.delete(ip);
  }
  for (const [tel, at] of telLast) {
    if (now - at >= TEL_COOLDOWN_MS) telLast.delete(tel);
  }
  for (const [email, at] of emailLast) {
    if (now - at >= EMAIL_COOLDOWN_MS) emailLast.delete(email);
  }
}

/**
 * Call at the very start of every POST (before heavy work).
 * Counts the attempt immediately.
 * @returns {{ ok: true } | { ok: false, reason: string, error: string }}
 */
export function checkRequestBurst(ip) {
  const now = Date.now();
  cleanupMaps(now);

  globalBursts = prune(globalBursts, now, BURST_WINDOW_MS);
  if (globalBursts.length >= MAX_GLOBAL_PER_MIN) {
    return { ok: false, reason: "global", error: RATE_ERROR };
  }
  globalBursts.push(now);

  if (ip) {
    const hits = prune(ipBursts.get(ip) || [], now, BURST_WINDOW_MS);
    if (hits.length >= MAX_BURST_PER_IP) {
      ipBursts.set(ip, hits);
      return { ok: false, reason: "burst", error: RATE_ERROR };
    }
    hits.push(now);
    ipBursts.set(ip, hits);
  }

  return { ok: true };
}

/**
 * @returns {{ ok: true } | { ok: false, reason: string, error: string }}
 */
export function checkInquirySpam({ ip, tel, email, honeypot, startedAt }) {
  const now = Date.now();
  cleanupMaps(now);

  // Bots fill hidden fields — reject without writing to Sheet.
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: false, reason: "honeypot", error: GENERIC_ERROR };
  }

  // Timing honeypot: too fast = bot; missing/invalid = treat as bot in prod.
  const started = Number(startedAt);
  if (!Number.isFinite(started) || started <= 0) {
    return { ok: false, reason: "timing", error: GENERIC_ERROR };
  }
  const elapsed = now - started;
  if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return { ok: false, reason: "timing", error: GENERIC_ERROR };
  }

  if (ip) {
    const hits = prune(ipLeads.get(ip) || [], now, LEAD_WINDOW_MS);
    if (hits.length >= MAX_LEADS_PER_IP) {
      return { ok: false, reason: "ip", error: RATE_ERROR };
    }
  }

  if (tel) {
    const last = telLast.get(tel);
    if (last != null && now - last < TEL_COOLDOWN_MS) {
      return {
        ok: false,
        reason: "tel",
        error: "同じ電話番号でのお申し込みはしばらく間隔を空けてください。",
      };
    }
  }

  if (email) {
    const last = emailLast.get(email);
    if (last != null && now - last < EMAIL_COOLDOWN_MS) {
      return {
        ok: false,
        reason: "email",
        error: "同じメールアドレスでのお申し込みはしばらく間隔を空けてください。",
      };
    }
  }

  return { ok: true };
}

/** Call only after a lead was successfully accepted / written. */
export function recordInquirySpamHit({ ip, tel, email }) {
  const now = Date.now();
  if (ip) {
    const hits = prune(ipLeads.get(ip) || [], now, LEAD_WINDOW_MS);
    hits.push(now);
    ipLeads.set(ip, hits);
  }
  if (tel) telLast.set(tel, now);
  if (email) emailLast.set(email, now);
}
