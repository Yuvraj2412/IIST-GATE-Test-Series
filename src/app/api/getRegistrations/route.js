import { NextResponse } from "next/server";
import { requireProfile } from "@/libs/supabase/server";
import { getPopulatedRegistrations } from "@/libs/supabase/registrations";

export async function POST(req) {
    try {
        // Always scoped to the signed-in user (any `userId` in the body is ignored)
        const { profile, response } = await requireProfile();
        if (response) return response;

        const registrations = await getPopulatedRegistrations(profile);

        // Check if any registrations were found
        if (!registrations || registrations.length === 0) {
            return NextResponse.json({ message: "No registrations found for this user" }, { status: 201 });
        }

        // Return the registrations
        return NextResponse.json({ msg: "Registrations Found", registrations }, { status: 200 });
    } catch (error) {
        console.error("Error in fetching registrations:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
