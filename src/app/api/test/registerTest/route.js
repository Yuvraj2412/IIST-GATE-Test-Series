import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";
import { sendMail } from "@/libs/mail";
import { registrationEmail } from "@/components/registrationEmail";

export async function POST(req) {
    try {
        const { profile, response: authResponse } = await requireProfile();
        if (authResponse) return authResponse;

        // Parse and validate the incoming request body
        const body = await req.json();
        const requiredFields = ["pid", "oid", "signature", "name", "test"];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({ message: `${field} is required.` }, { status: 400 });
            }
        }

        const { pid, oid, signature, name, test } = body;
        const supabase = getSupabaseAdmin();

        // Fetch the payment object using the order ID and verify ownership
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

        if (payment.test && payment.test !== test) {
            return NextResponse.json(
                { message: "Test mismatch with payment order." },
                { status: 400 }
            );
        }

        // Check if a registration for the same test already exists for the user
        const { data: existingRegistration, error: regCheckErr } = await supabase
            .from("test_registrations")
            .select("id")
            .eq("userId", profile.id)
            .eq("test", test)
            .maybeSingle();
        if (regCheckErr) throw regCheckErr;

        if (existingRegistration) {
            return NextResponse.json(
                { message: "User is already registered for this test." },
                { status: 409 }
            );
        }

        const generatedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${oid}|${pid}`)
            .digest("hex");

        const sigBuf = Buffer.from(String(signature), "utf8");
        const genBuf = Buffer.from(generatedSign, "utf8");
        if (sigBuf.length !== genBuf.length || !crypto.timingSafeEqual(sigBuf, genBuf)) {
            return NextResponse.json(
                { message: "Invalid payment signature." },
                { status: 400 }
            );
        }

        // Update the payment object
        const { error: updErr } = await supabase
            .from("payments")
            .update({
                paymentId: pid,
                signature,
                status: "paid",
                updatedTime: new Date().toISOString(),
            })
            .eq("id", payment.id);
        if (updErr) throw updErr;

        // Create a new test registration object
        const { data: newRegistration, error: insErr } = await supabase
            .from("test_registrations")
            .insert({
                pid,
                oid,
                signature,
                name,
                test,
                userId: profile.id,
                payment: payment.id,
            })
            .select()
            .single();
        if (insErr) {
            if (insErr.code === "23505") {
                return NextResponse.json(
                    { message: "User is already registered for this test." },
                    { status: 409 }
                );
            }
            throw insErr;
        }

        const [testName, pack] = test.split(",").map((part) => part.trim());
        await sendMail({
            to: `${profile.email}, aadityatheperfect1@gmail.com, mohinthaKumar12gd@gmail.com `,
            name: profile.name,
            subject: "IGTS Registration Successful",
            body: registrationEmail(name, pid, testName, pack, payment.amount, profile.email),
        });

        return NextResponse.json(
            {
                message: "Test registration successful.",
                registration: withId(newRegistration),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error handling test registration request:", error);
        return NextResponse.json(
            { message: "Failed to process the request.", error: error.message },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json(
        { message: "Preflight request is successful" },
        { status: 200 }
    );
}
