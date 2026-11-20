import crypto from "crypto";
import Razorpay from "razorpay";
import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { findOverlappingRegistration } from "@/libs/supabase/testAccess";
import { sendMail } from "@/libs/mail";
import { registrationEmail } from "@/components/registrationEmail";

/** Reads trimmed Razorpay server credentials from environment variables. */
export function getRazorpayConfig() {
  const keyId = (process.env.RAZORPAY_KEY || process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET || "").trim();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay server credentials are not configured.");
  }
  return { keyId, keySecret };
}

/** Returns the public Razorpay key ID safe to pass to client Checkout. */
export function getPublicRazorpayKey() {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
    process.env.RAZORPAY_KEY ||
    process.env.RAZORPAY_KEY_ID ||
    ""
  ).trim();
}

/** Creates a Razorpay SDK client using active server credentials. */
export function getRazorpayClient() {
  const { keyId, keySecret } = getRazorpayConfig();
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/** Performs timing-safe HMAC-SHA256 verification of Razorpay Checkout signature. */
export function verifyRazorpayOrderSignature({ orderId, paymentId, signature }) {
  if (!orderId || !paymentId || !signature) return false;
  const { keySecret } = getRazorpayConfig();
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const sigBuf = Buffer.from(String(signature), "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

/**
 * Verifies Razorpay order payment status directly against Razorpay's API,
 * auto-capturing an authorized payment if needed, and returns the captured payment.
 */
export async function findCapturedPaymentForOrder(orderId, expectedAmountPaise) {
  const rzp = getRazorpayClient();
  const collection = await rzp.orders.fetchPayments(orderId);
  const items = Array.isArray(collection?.items) ? collection.items : [];

  const captured = items.find((p) => p.status === "captured");
  if (captured) return captured;

  const authorized = items.find((p) => p.status === "authorized");
  if (authorized) {
    const captureAmount = authorized.amount || expectedAmountPaise;
    if (!captureAmount) return null;
    try {
      const cap = await rzp.payments.capture(authorized.id, captureAmount, authorized.currency || "INR");
      if (cap?.status === "captured") return cap;
    } catch (capErr) {
      // Re-fetch in case Checkout auto-captured concurrently.
      const retry = await rzp.orders.fetchPayments(orderId);
      const retryCaptured = (retry?.items || []).find((p) => p.status === "captured");
      if (retryCaptured) return retryCaptured;
      throw capErr;
    }
  }

  return null;
}

/**
 * Marks a verified payment row as paid, creates the matching `test_registrations`
 * row idempotently, and dispatches confirmation email (non-fatal if SMTP fails).
 */
export async function finalizeVerifiedOrderRegistration({
  profile,
  payment,
  pid,
  signature,
  name,
  test,
}) {
  const supabase = getSupabaseAdmin();
  const oid = payment.orderId;
  const candidateName = name || profile.name || "Candidate";
  const resolvedTest = test || payment.test;

  if (payment.test && resolvedTest && payment.test !== resolvedTest) {
    const err = new Error("Test mismatch with payment order.");
    err.status = 400;
    throw err;
  }

  // Idempotent return if this exact order was already finalized.
  const { data: sameOrderReg, error: sameErr } = await supabase
    .from("test_registrations")
    .select("*")
    .eq("userId", profile.id)
    .eq("oid", oid)
    .maybeSingle();
  if (sameErr) throw sameErr;

  if (sameOrderReg) {
    if (payment.status !== "paid") {
      await supabase
        .from("payments")
        .update({ paymentId: pid, signature, status: "paid", updatedTime: new Date().toISOString() })
        .eq("id", payment.id);
    }
    return { registration: withId(sameOrderReg), alreadyFinalized: true };
  }

  // Prevent overlapping enrollments from a different order.
  const existingOverlap = await findOverlappingRegistration(profile.id, resolvedTest);
  if (existingOverlap) {
    const err = new Error("User is already registered for this test.");
    err.status = 409;
    throw err;
  }

  const { error: updErr } = await supabase
    .from("payments")
    .update({
      paymentId: pid,
      signature: signature || "",
      status: "paid",
      updatedTime: new Date().toISOString(),
    })
    .eq("id", payment.id);
  if (updErr) throw updErr;

  const { data: newRegistration, error: insErr } = await supabase
    .from("test_registrations")
    .insert({
      pid,
      oid,
      signature: signature || "",
      name: candidateName,
      test: resolvedTest,
      userId: profile.id,
      payment: payment.id,
    })
    .select()
    .single();

  if (insErr) {
    if (insErr.code === "23505") {
      const { data: raceReg } = await supabase
        .from("test_registrations")
        .select("*")
        .eq("userId", profile.id)
        .eq("oid", oid)
        .maybeSingle();
      if (raceReg) {
        return { registration: withId(raceReg), alreadyFinalized: true };
      }
      const err = new Error("User is already registered for this test.");
      err.status = 409;
      throw err;
    }
    throw insErr;
  }

  const [testName = "", pack = ""] = String(resolvedTest || "")
    .split(",")
    .map((part) => part.trim());
  const adminCopies = (process.env.ADMIN_NOTIFICATION_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const recipients = [profile.email, ...adminCopies].filter(Boolean).join(", ");

  if (recipients) {
    try {
      await sendMail({
        to: recipients,
        name: profile.name,
        subject: "IGTS Dhanak 2027 · Registration Confirmed",
        body: registrationEmail(candidateName, pid, testName, pack, payment.amount, profile.email),
      });
    } catch (mailError) {
      console.error("Confirmation email failed (non-fatal):", mailError);
    }
  }

  return { registration: withId(newRegistration), alreadyFinalized: false };
}

/**
 * Checks recent uncompleted Razorpay orders for `(profile.id, test)` and auto-finalizes
 * if Razorpay already shows a captured payment for any of them.
 */
export async function reconcilePendingOrdersForUser(profile, targetTest = null) {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("payments")
    .select("*")
    .eq("user", profile.id)
    .eq("status", "created")
    .order("createdAt", { ascending: false })
    .limit(5);

  if (targetTest) {
    query = query.eq("test", targetTest);
  }

  const { data: pendingOrders, error } = await query;
  if (error) throw error;

  for (const payment of pendingOrders || []) {
    try {
      const captured = await findCapturedPaymentForOrder(
        payment.orderId,
        Math.round(Number(payment.amount || 0) * 100)
      );
      if (captured) {
        const result = await finalizeVerifiedOrderRegistration({
          profile,
          payment,
          pid: captured.id,
          signature: "verified_via_razorpay_api",
          name: profile.name,
          test: payment.test,
        });
        return { recovered: true, payment, ...result };
      }
    } catch (err) {
      console.warn(`Order reconcile check failed for ${payment.orderId}:`, err.message);
    }
  }

  return { recovered: false };
}
