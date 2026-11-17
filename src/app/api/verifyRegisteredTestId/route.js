import { withId } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";
import { getOwnedRegistration } from "@/libs/supabase/testAccess";

export async function POST(req) {
    try {
        const { profile, response: authResponse } = await requireProfile();
        if (authResponse) return authResponse;

        const { RegisteredTestId } = await req.json();

        if (!RegisteredTestId) {
            return new Response(
                JSON.stringify({ error: "Registered Test ID is required." }),
                { status: 400 }
            );
        }

        const test = await getOwnedRegistration(profile.id, RegisteredTestId);

        if (!test) {
            return new Response(
                JSON.stringify({ error: "Registered Test not found." }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify({ valid: true, test: withId(test) }), { status: 200 });
    } catch (error) {
        console.error("Error verifying Registered Test ID:", error);
        return new Response(
            JSON.stringify({ error: "Failed to verify Registered Test ID." }),
            { status: 500 }
        );
    }
}
