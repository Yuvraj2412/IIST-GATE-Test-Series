import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { finalizeVerifiedOrderRegistration } from "@/libs/razorpay";

export async function POST(req) {
  try {
    const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || "").trim();
    if (!webhookSecret) {
      return NextResponse.json({ message: "Webhook secret is not configured." }, { status: 503 });
    }

    const rawBody = await req.text();
    const receivedSig = req.headers.get("x-razorpay-signature") || "";
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const sigBuf = Buffer.from(receivedSig, "utf8");
    const expectedBuf = Buffer.from(expectedSig, "utf8");
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return NextResponse.json({ message: "Invalid webhook signature." }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;
    if (eventType !== "payment.captured" && eventType !== "order.paid") {
      return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
    }

    const paymentEntity = event?.payload?.payment?.entity;
    const orderEntity = event?.payload?.order?.entity;
    const orderId = paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;

    if (!orderId || !paymentId) {
      return NextResponse.json({ message: "Missing order/payment ID in payload." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: payment, error: payErr } = await supabase
      .from("payments")
      .select("*")
      .eq("orderId", orderId)
      .maybeSingle();
    if (payErr) throw payErr;

    if (!payment) {
      return NextResponse.json({ ok: true, skipped: "order_not_tracked" }, { status: 200 });
    }

    const { data: profile, error: profErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", payment.user)
      .maybeSingle();
    if (profErr) throw profErr;

    if (!profile) {
      return NextResponse.json({ ok: true, skipped: "profile_not_found" }, { status: 200 });
    }

    await finalizeVerifiedOrderRegistration({
      profile,
      payment,
      pid: paymentId,
      signature: "verified_via_webhook",
      name: profile.name,
      test: payment.test,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ message: "Webhook processing failed." }, { status: 500 });
  }
}
