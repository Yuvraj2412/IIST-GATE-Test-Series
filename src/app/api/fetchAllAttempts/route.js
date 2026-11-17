import { getSupabaseAdmin, withIds } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";

export async function POST(req) {
    try {
        const { profile, response } = await requireProfile();
        if (response) return response;

        // The request may still send `userId`, but we always return the
        // signed-in user's own attempts.
        const { data: testAttempts, error } = await getSupabaseAdmin()
            .from("test_attempts")
            .select("*")
            .eq("userId", profile.id)
            .order("createdAt", { ascending: true });

        if (error) throw error;

        if (!testAttempts || testAttempts.length === 0) {
            return new Response(
                JSON.stringify({ error: "No attempts found for this user." }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(withIds(testAttempts)), { status: 200 });
    } catch (error) {
        console.error("Error fetching test attempts:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch test attempts." }),
            { status: 500 }
        );
    }
}
