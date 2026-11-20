import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";
import {
  finalizeVerifiedOrderRegistration,
  findCapturedPaymentForOrder,
  verifyRazorpayOrderSignature,
} from "@/libs/razorpay";

export async function POST(req) {
  try {
    const { profile, response: authResponse } = await requireProfile();
    if (authResponse) return authResponse;

    const body = await req.json();
    const requiredFields = ["pid", "oid", "signature", "name", "test"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ message: `${field} is required.` }, { status: 400 });
      }
    }

    const { pid, oid, signature, name, test } = body;
    const supabase = getSupabaseAdmin();

    const { data: payment, error: payErr } = await supabase
      .from("payments")
      .select("*")
      .eq("orderId", oid)
      .eq("user", profile.id)
      .maybeSingle();
    if (payErr) throw payErr;

    if (!payment) {
      return NextResponse.json({ message: "Payment record not found." }, { status: 404 });
    }

    let verifiedSignature = verifyRazorpayOrderSignature({
      orderId: oid,
      paymentId: pid,
      signature,
    });

    // If client signature validation fails, double-check directly with Razorpay Orders API.
    if (!verifiedSignature) {
      const apiCaptured = await findCapturedPaymentForOrder(
        oid,
        Math.round(Number(payment.amount || 0) * 100)
      );
      if (!apiCaptured || apiCaptured.id !== pid) {
        return NextResponse.json(
          { message: "Invalid payment signature." },
          { status: 400 }
        );
      }
      verifiedSignature = true;
    }

    const { registration, alreadyFinalized } = await finalizeVerifiedOrderRegistration({
      profile,
      payment,
      pid,
      signature,
      name,
      test,
    });

    return NextResponse.json(
      {
        message: alreadyFinalized
          ? "Test registration already confirmed."
          : "Test registration successful.",
        registration,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling test registration request:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process the request." },
      { status: error.status || 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    { message: "Preflight request is successful" },
    { status: 200 }
  );
}
