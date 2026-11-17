import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import {
    createVerificationToken,
    hashOtp,
    normalizeEmail,
    safeHexEqual,
} from "@/libs/supabase/signupOtpToken";

const MAX_ATTEMPTS = 5;

export async function POST(req) {
    try {
        const { email, otp } = await req.json();
        const normalizedEmail = normalizeEmail(email);
        const trimmedOtp = String(otp || "").trim();

        if (!normalizedEmail || !trimmedOtp) {
            return NextResponse.json({ msg: "Email and OTP are required." }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        const { data: record, error } = await supabase
            .from("email_otps")
            .select("*")
            .eq("email", normalizedEmail)
            .maybeSingle();
        if (error) throw error;

        if (!record) {
            return NextResponse.json(
                { msg: "OTP not found or expired. Please request a new one." },
                { status: 400 }
            );
        }

        if (new Date(record.expires_at).getTime() < Date.now()) {
            await supabase.from("email_otps").delete().eq("email", normalizedEmail);
            return NextResponse.json(
                { msg: "OTP expired. Please request a new one." },
                { status: 400 }
            );
        }

        if (record.attempts >= MAX_ATTEMPTS) {
            return NextResponse.json(
                { msg: "Too many incorrect attempts. Please request a new OTP." },
                { status: 429 }
            );
        }

        const expectedHash = hashOtp(normalizedEmail, trimmedOtp);
        if (!safeHexEqual(expectedHash, record.otp_hash)) {
            await supabase
                .from("email_otps")
                .update({ attempts: record.attempts + 1 })
                .eq("email", normalizedEmail);

            return NextResponse.json({ msg: "Incorrect otp! Please try again" }, { status: 400 });
        }

        // Single-use OTP: remove it once verified and issue a signed verification token.
        await supabase.from("email_otps").delete().eq("email", normalizedEmail);
        const verificationToken = createVerificationToken(normalizedEmail);

        return NextResponse.json(
            { msg: "Email verified successfully", verificationToken },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ msg: "Failed to verify OTP." }, { status: 500 });
    }
}
