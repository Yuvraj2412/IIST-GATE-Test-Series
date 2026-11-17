import crypto from "crypto";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const VERIFICATION_TTL_MS = 30 * 60 * 1000; // 30 minutes to finish profile form

function getSecret() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("Missing SUPABASE_SECRET_KEY env var.");
  return secret;
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function hashOtp(email, otp) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`otp:${normalizeEmail(email)}:${String(otp).trim()}`)
    .digest("hex");
}

export function safeHexEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

export function otpExpiresAt() {
  return new Date(Date.now() + OTP_TTL_MS).toISOString();
}

export function createVerificationToken(email) {
  const payload = Buffer.from(
    JSON.stringify({ email: normalizeEmail(email), exp: Date.now() + VERIFICATION_TTL_MS })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(`verify:${payload}`).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyVerificationToken(token, email) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(`verify:${payload}`)
    .digest("hex");
  if (!safeHexEqual(sig, expectedSig)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return parsed.email === normalizeEmail(email) && Number(parsed.exp) > Date.now();
  } catch {
    return false;
  }
}
