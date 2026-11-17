import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";
import { getOwnedRegistration } from "@/libs/supabase/testAccess";

export async function POST(req) {
    try {
        const { profile, response: authResponse } = await requireProfile();
        if (authResponse) return authResponse;

        const {
            registeredTestId,
            domainId,
            packId,
            testId,
        } = await req.json();

        // Check if all required fields are present
        if (!registeredTestId || !domainId || !packId || !testId) {
            return new Response(
                JSON.stringify({ error: "All required fields must be provided." }),
                { status: 400 }
            );
        }

        const ownedReg = await getOwnedRegistration(profile.id, registeredTestId, {
            domainId,
            packId,
        });
        if (!ownedReg) {
            return new Response(
                JSON.stringify({ error: "Invalid or unauthorized test registration." }),
                { status: 403 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Check if a test attempt for the same user and test already exists
        const { data: existingAttempt, error: findErr } = await supabase
            .from("test_attempts")
            .select("*")
            .eq("userId", profile.id)
            .eq("registeredTestId", registeredTestId)
            .eq("domainId", domainId)
            .eq("packId", packId)
            .eq("testId", testId)
            .maybeSingle();

        if (findErr) throw findErr;

        if (existingAttempt) {
            return new Response(
                JSON.stringify({
                    message: "Test attempt already exists.",
                    attempt: withId(existingAttempt),
                }),
                { status: 200 }
            );
        }

        // Create a new 3-hour test attempt
        const startTimeDate = new Date();
        const endTimeDate = new Date(startTimeDate.getTime() + 3 * 60 * 60 * 1000);

        const { data: newAttempt, error: insertErr } = await supabase
            .from("test_attempts")
            .insert({
                userId: profile.id,
                registeredTestId,
                domainId,
                packId,
                testId,
                startTime: startTimeDate.toISOString(),
                endTime: endTimeDate.toISOString(),
            })
            .select()
            .single();

        if (insertErr) {
            if (insertErr.code === "23505") {
                const { data: racedAttempt } = await supabase
                    .from("test_attempts")
                    .select("*")
                    .eq("userId", profile.id)
                    .eq("registeredTestId", registeredTestId)
                    .eq("domainId", domainId)
                    .eq("packId", packId)
                    .eq("testId", testId)
                    .single();
                if (racedAttempt) {
                    return new Response(
                        JSON.stringify({
                            message: "Test attempt already exists.",
                            attempt: withId(racedAttempt),
                        }),
                        { status: 200 }
                    );
                }
            }
            throw insertErr;
        }

        return new Response(
            JSON.stringify({
                message: "New test attempt created.",
                attempt: withId(newAttempt),
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing test attempt:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process test attempt." }),
            { status: 500 }
        );
    }
}
