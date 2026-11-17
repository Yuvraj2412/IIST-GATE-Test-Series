import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";

export async function POST(req) {
    try {
        const { profile, response: authResponse } = await requireProfile();
        if (authResponse) return authResponse;

        const { registeredTestId, domainId, packId, testId, responses, timeRemainingOnCompletion } = await req.json();

        // Validate input fields
        if (!registeredTestId || !domainId || !packId || !testId || !responses || typeof responses !== "object") {
            return new Response(
                JSON.stringify({ error: "All required fields must be provided." }),
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Find the test attempt for the signed-in user
        const { data: existingAttempt, error: findErr } = await supabase
            .from("test_attempts")
            .select("id, status")
            .eq("userId", profile.id)
            .eq("registeredTestId", registeredTestId)
            .eq("domainId", domainId)
            .eq("packId", packId)
            .eq("testId", testId)
            .maybeSingle();

        if (findErr) {
            if (findErr.code === "22P02") {
                return new Response(
                    JSON.stringify({ error: "Test attempt not found." }),
                    { status: 404 }
                );
            }
            throw findErr;
        }

        if (!existingAttempt) {
            return new Response(
                JSON.stringify({ error: "Test attempt not found." }),
                { status: 404 }
            );
        }

        if (existingAttempt.status !== "attempting") {
            return new Response(
                JSON.stringify({ message: "Test attempt already completed." }),
                { status: 200 }
            );
        }

        const { error: updErr } = await supabase
            .from("test_attempts")
            .update({
                status: "completed",
                responses,
                timeRemainingOnCompletion: timeRemainingOnCompletion ?? "",
            })
            .eq("id", existingAttempt.id);
        if (updErr) throw updErr;

        return new Response(
            JSON.stringify({ message: "Test attempt successfully completed." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error ending test attempt:", error);
        return new Response(
            JSON.stringify({ error: "Failed to end test attempt." }),
            { status: 500 }
        );
    }
}
