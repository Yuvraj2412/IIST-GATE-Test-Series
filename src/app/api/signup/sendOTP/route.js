import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { sendMail } from "@/libs/mail";
import { signupOtp } from "@/components/signupOtp";
import { hashOtp, normalizeEmail, otpExpiresAt } from "@/libs/supabase/signupOtpToken";

async function generateUsername(email) {
    const supabase = getSupabaseAdmin();
    const base = email.split("@")[0] || "user";
    let candidate = base;
    let count = 1;

    while (true) {
        const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("username", candidate)
            .maybeSingle();
        if (error) throw error;
        if (!data) return candidate;
        candidate = `${base}${count}`;
        count++;
    }
}

export async function POST(req) {
    try {
        const { email } = await req.json();
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return NextResponse.json({ msg: "Invalid email address" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        const { data: existingUser, error: userErr } = await supabase
            .from("users")
            .select("id")
            .eq("email", normalizedEmail)
            .maybeSingle();
        if (userErr) throw userErr;

        if (existingUser) {
            return NextResponse.json({ msg: "User already exists" }, { status: 201 });
        }

        const username = await generateUsername(normalizedEmail);
        const otp = String(crypto.randomInt(1000, 10000));

        const { error: otpErr } = await supabase
            .from("email_otps")
            .upsert(
                {
                    email: normalizedEmail,
                    otp_hash: hashOtp(normalizedEmail, otp),
                    expires_at: otpExpiresAt(),
                    attempts: 0,
                },
                { onConflict: "email" }
            );
        if (otpErr) throw otpErr;

        await sendMail({
            to: normalizedEmail,
            name: username,
            subject: "GATE Mock OTP",
            body: signupOtp(otp),
        });

        // Never return the OTP to the browser; verification happens via /api/signup/verifyOTP.
        return NextResponse.json({ msg: "OTP sent", username }, { status: 200 });
    } catch (error) {
        console.error("Error sending signup OTP:", error);
        return NextResponse.json({ msg: "Failed to send OTP" }, { status: 500 });
    }
}
