import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";
import { computeTestAmountInPaise, findOverlappingRegistration } from "@/libs/supabase/testAccess";
import {
  getPublicRazorpayKey,
  getRazorpayClient,
  reconcilePendingOrdersForUser,
} from "@/libs/razorpay";

export async function OPTIONS() {
  return NextResponse.json(
    { message: "Preflight request is successful" },
    { status: 200 }
  );
}

export async function POST(req) {
  try {
    const { profile, response: authResponse } = await requireProfile();
    if (authResponse) return authResponse;

    const { receipt, test } = await req.json();

    // Compute authoritative price on the server instead of trusting client `amount`.
    const amountInPaise = computeTestAmountInPaise(test);
    if (!amountInPaise) {
      return NextResponse.json(
        { message: "Invalid test package selected." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Prevent creating an order if user already holds an exact or overlapping registration.
    const existingReg = await findOverlappingRegistration(profile.id, test);
    if (existingReg) {
      return NextResponse.json(
        { message: "User is already registered for this test." },
        { status: 409 }
      );
    }

    // Reconcile any interrupted previous Razorpay order for the same package before opening a new one.
    const recovery = await reconcilePendingOrdersForUser(profile, test);
    if (recovery.recovered) {
      return NextResponse.json(
        {
          alreadyCompleted: true,
          message: "Your previous payment was already captured and enrollment is now active.",
          registration: recovery.registration,
        },
        { status: 200 }
      );
    }

    const orderReceipt = String(receipt || `TEST-${Date.now()}`).slice(0, 40);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: orderReceipt,
      payment_capture: 1,
      notes: {
        test: String(test).slice(0, 200),
        userId: String(profile.id),
        candidateEmail: String(profile.email || ""),
      },
    };

    const rzp = getRazorpayClient();
    const rzpOrder = await rzp.orders.create(options);

    const { error: insertErr } = await supabase.from("payments").insert({
      amount: amountInPaise / 100,
      updatedTime: rzpOrder.created_at
        ? new Date(rzpOrder.created_at * 1000).toISOString()
        : new Date().toISOString(),
      receipt: orderReceipt,
      orderId: rzpOrder.id,
      status: "created",
      razorpayResponse: rzpOrder,
      user: profile.id,
      test,
    });
    if (insertErr) throw insertErr;

    return NextResponse.json(
      {
        ...rzpOrder,
        keyId: getPublicRazorpayKey(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in creating Razorpay order:", error);

    return NextResponse.json(
      { message: error?.error?.description || "Problem in processing payments.", error: error.message },
      { status: error.status || 500 }
    );
  }
}
