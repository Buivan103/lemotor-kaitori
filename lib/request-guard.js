/**
 * Cheap request guards — no external services.
 */

const MAX_BODY_BYTES = 24 * 1024; // 24KB is plenty for this form

/**
 * Same-site Origin / Referer check (blocks casual cross-site POST spam).
 * Set ALLOWED_HOSTS=example.com,www.example.com if behind custom domains.
 */
export function isAllowedOrigin(request) {
  const host = (request.headers.get("host") || "").toLowerCase();
  if (!host) return false;

  const allowed = new Set(
    (process.env.ALLOWED_HOSTS || host)
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean)
  );
  allowed.add(host);

  const matches = (urlStr) => {
    try {
      const u = new URL(urlStr);
      return allowed.has(u.host.toLowerCase());
    } catch {
      return false;
    }
  };

  const origin = request.headers.get("origin");
  if (origin) return matches(origin);

  const referer = request.headers.get("referer");
  if (referer) return matches(referer);

  // Some clients omit both; allow only outside production.
  return process.env.NODE_ENV !== "production";
}

export function isJsonContentType(request) {
  const ct = (request.headers.get("content-type") || "").toLowerCase();
  return ct.includes("application/json");
}

/**
 * Read JSON body with a hard size cap (avoids memory abuse on weak hosts).
 * @returns {Promise<{ ok: true, body: object } | { ok: false, status: number, error: string }>}
 */
export async function readJsonBody(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return {
      ok: false,
      status: 413,
      error: "送信データが大きすぎます。",
    };
  }
  if (!raw.trim()) {
    return { ok: false, status: 400, error: "不正なリクエストです。" };
  }
  try {
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { ok: false, status: 400, error: "不正なリクエストです。" };
    }
    return { ok: true, body };
  } catch {
    return { ok: false, status: 400, error: "不正なリクエストです。" };
  }
}
