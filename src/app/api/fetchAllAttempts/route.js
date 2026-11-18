import { getSupabaseAdmin, withIds } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";

export async function POST() {
    try {
        const { profile, response } = await requireProfile();
        if (response) return response;

        const { data: testAttempts, error } = await getSupabaseAdmin()
            .from("test_attempts")
            .select("*")
            .eq("userId", profile.id)
            .order("createdAt", { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify(withIds(testAttempts || [])), { status: 200 });
    } catch (error) {
        console.error("Error fetching test attempts:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch test attempts." }),
            { status: 500 }
        );
    }
}
