import { NextResponse } from "next/server";
import { requireProfile } from "@/libs/supabase/server";
import { reconcilePendingOrdersForUser } from "@/libs/razorpay";

export async function POST(req) {
  try {
    const { profile, response: authResponse } = await requireProfile();
    if (authResponse) return authResponse;

    let test = null;
    try {
      const body = await req.json();
      test = body?.test || null;
    } catch {
      test = null;
    }

    const result = await reconcilePendingOrdersForUser(profile, test);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error reconciling pending payments:", error);
    return NextResponse.json(
      { recovered: false, message: "Could not reconcile pending orders." },
      { status: 500 }
    );
  }
}
