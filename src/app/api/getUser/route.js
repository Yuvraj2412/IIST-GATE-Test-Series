import { NextResponse } from "next/server";
import { withId } from "@/libs/supabase/admin";
import { getAuthUser, getProfileByAuthId } from "@/libs/supabase/server";
import { getPopulatedRegistrations } from "@/libs/supabase/registrations";

export async function POST(req) {
    // Identity comes from the Supabase session cookie, not from the request body.
    const authUser = await getAuthUser();
    if (!authUser) {
        return NextResponse.json({ msg: "Not Authenticated" }, { status: 401 });
    }

    try {
        const profile = await getProfileByAuthId(authUser.id);

        if (!profile) {
            return NextResponse.json({ msg: "No user found" }, { status: 200 });
        }

        const registeredTests = await getPopulatedRegistrations(profile);

        // Send the user data along with the populated registration data
        return NextResponse.json(
            { msg: "User Found", user: { ...withId(profile), registeredTests } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ msg: "Error fetching user data", error: error.message }, { status: 500 });
    }
}
