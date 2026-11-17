import { NextResponse } from "next/server";
import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { getAuthUser } from "@/libs/supabase/server";
import { normalizeEmail, verifyVerificationToken } from "@/libs/supabase/signupOtpToken";

async function ensureUniqueUsername(requested, email) {
    const supabase = getSupabaseAdmin();
    const base = (requested || email.split("@")[0] || "user").trim();
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
        const body = await req.json();
        const {
            username,
            name,
            mobile,
            college,
            branch,
            email,
            password,
            verificationToken,
        } = body;

        const cleanName = String(name || "").trim();
        const cleanCollege = String(college || "").trim();
        const cleanBranch = String(branch || "").trim();
        const mobileStr = String(mobile || "").trim();

        if (!cleanName || !cleanCollege || !cleanBranch || !/^\d{10}$/.test(mobileStr)) {
            return NextResponse.json(
                { msg: "Please provide valid name, 10-digit mobile number, branch, and college." },
                { status: 400 }
            );
        }

        const mobileNum = Number(mobileStr);
        if (mobileNum < 1000000000 || mobileNum > 9999999999) {
            return NextResponse.json(
                { msg: "Mobile number must be a valid 10-digit number." },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();
        const authUser = await getAuthUser();

        if (authUser) {
            // Google OAuth (already authenticated via Supabase session cookie)
            const authEmail = normalizeEmail(authUser.email);

            const { data: existing, error: existErr } = await supabase
                .from("users")
                .select("id")
                .or(`userId.eq.${authUser.id},email.eq.${authEmail}`)
                .maybeSingle();
            if (existErr) throw existErr;

            if (existing) {
                return NextResponse.json({ msg: "User already exists" }, { status: 201 });
            }

            const finalUsername = await ensureUniqueUsername(username, authEmail);
            const { data: createdUser, error: insertErr } = await supabase
                .from("users")
                .insert({
                    userId: authUser.id,
                    username: finalUsername,
                    name: cleanName,
                    mobile: mobileNum,
                    role: "user",
                    college: cleanCollege,
                    branch: cleanBranch,
                    email: authEmail,
                })
                .select()
                .single();

            if (insertErr) throw insertErr;

            return NextResponse.json(
                { msg: "User Created", nUser: withId(createdUser) },
                { status: 200 }
            );
        }

        // Email + Password + OTP signup flow
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail || !password || String(password).length < 6) {
            return NextResponse.json(
                { msg: "Email and a password of at least 6 characters are required." },
                { status: 400 }
            );
        }

        if (!verifyVerificationToken(verificationToken, normalizedEmail)) {
            return NextResponse.json(
                { msg: "Email verification expired or invalid. Please verify OTP again." },
                { status: 401 }
            );
        }

        const { data: existingProfile, error: profErr } = await supabase
            .from("users")
            .select("id")
            .eq("email", normalizedEmail)
            .maybeSingle();
        if (profErr) throw profErr;

        if (existingProfile) {
            return NextResponse.json({ msg: "User already exists" }, { status: 201 });
        }

        // Create (or finish configuring an unprofiled) Supabase Auth user with email confirmed.
        let authUid = null;
        let createdNewAuthUser = false;

        const { data: createdAuth, error: createAuthErr } = await supabase.auth.admin.createUser({
            email: normalizedEmail,
            password: String(password),
            email_confirm: true,
            user_metadata: { full_name: cleanName },
        });

        if (createAuthErr) {
            // Check if an unprofiled auth.users record exists (e.g., incomplete earlier OAuth)
            const { data: orphanId, error: rpcErr } = await supabase.rpc(
                "get_auth_user_id_by_email",
                { target_email: normalizedEmail }
            );
            if (rpcErr || !orphanId) {
                return NextResponse.json(
                    { msg: createAuthErr.message || "Could not create user account." },
                    { status: 400 }
                );
            }
            const { error: updAuthErr } = await supabase.auth.admin.updateUserById(orphanId, {
                password: String(password),
                email_confirm: true,
                user_metadata: { full_name: cleanName },
            });
            if (updAuthErr) {
                return NextResponse.json(
                    { msg: updAuthErr.message || "Could not create user account." },
                    { status: 400 }
                );
            }
            authUid = orphanId;
        } else {
            authUid = createdAuth.user.id;
            createdNewAuthUser = true;
        }

        const finalUsername = await ensureUniqueUsername(username, normalizedEmail);
        const { data: createdUser, error: insertErr } = await supabase
            .from("users")
            .insert({
                userId: authUid,
                username: finalUsername,
                name: cleanName,
                mobile: mobileNum,
                role: "user",
                college: cleanCollege,
                branch: cleanBranch,
                email: normalizedEmail,
            })
            .select()
            .single();

        if (insertErr) {
            if (createdNewAuthUser) {
                await supabase.auth.admin.deleteUser(authUid);
            }
            throw insertErr;
        }

        return NextResponse.json(
            { msg: "User Created", nUser: withId(createdUser) },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in signup:", error);
        return NextResponse.json(
            { msg: "User not created", error: error.message },
            { status: 500 }
        );
    }
}
