import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";
import { computeTestAmountInPaise, findOverlappingRegistration } from "@/libs/supabase/testAccess";

// Initialize Razorpay instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

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

        const orderReceipt = receipt || `TEST-${Date.now()}`;
        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: orderReceipt,
        };

        // Create an order using Razorpay API
        const rzpOrder = await instance.orders.create(options);

        // Save the order details in Supabase
        const { error: insertErr } = await supabase.from("payments").insert({
            amount: amountInPaise / 100, // Convert to rupees for storage
            updatedTime: rzpOrder.created_at
                ? new Date(rzpOrder.created_at * 1000).toISOString()
                : new Date().toISOString(),
            receipt: orderReceipt,
            orderId: rzpOrder.id,
            status: "created",
            razorpayResponse: rzpOrder,
            user: profile.id,
            test: test,
        });
        if (insertErr) throw insertErr;

        return NextResponse.json(rzpOrder, { status: 200 });
    } catch (error) {
        console.error("Error in creating Razorpay order:", error);

        return NextResponse.json(
            { message: "Problem in processing payments.", error: error.message },
            { status: 500 }
        );
    }
}
