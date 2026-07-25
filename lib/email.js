/**
 * Practical email validation for inquiry forms.
 * Rejects empty / obviously invalid addresses (spaces, missing @, etc.).
 */
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export function normalizeEmail(raw) {
  return String(raw || "")
    .replace(/[＠]/g, "@")
    .replace(/[．。]/g, ".")
    .trim()
    .toLowerCase();
}

export function isValidEmail(raw) {
  const email = normalizeEmail(raw);
  if (!email || email.length > 254) return false;
  if (email.includes("..")) return false;
  return EMAIL_RE.test(email);
}
