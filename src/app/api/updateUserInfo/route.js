import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";

export async function POST(req) {
    try {
        const { profile, response: authResponse } = await requireProfile();
        if (authResponse) return authResponse;

        const { name, mobile, branch, college } = await req.json();

        const mobileStr = String(mobile ?? "").trim();
        if (!name || !branch || !college || !/^\d{10}$/.test(mobileStr)) {
            return NextResponse.json(
                { msg: "Please provide valid name, 10-digit mobile, branch, and college." },
                { status: 400 }
            );
        }

        const mobileNum = Number(mobileStr);
        if (mobileNum < 1000000000 || mobileNum > 9999999999) {
            return NextResponse.json(
                { msg: "Mobile number must be 10 digits." },
                { status: 400 }
            );
        }

        const { data: updatedUser, error } = await getSupabaseAdmin()
            .from("users")
            .update({
                name: String(name).trim(),
                mobile: mobileNum,
                college: String(college).trim(),
                branch: String(branch).trim(),
            })
            .eq("id", profile.id)
            .select("id")
            .maybeSingle();

        if (error) throw error;

        if (!updatedUser) {
            return NextResponse.json({ msg: "User NOT found" }, { status: 201 });
        }

        return NextResponse.json({ msg: "user updated" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user info:", error);
        return NextResponse.json(
            { msg: "Failed to update user info", error: error.message },
            { status: 500 }
        );
    }
}
