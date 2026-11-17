import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { requireProfile, ADMIN_ROLES } from "@/libs/supabase/server";

export async function POST(req) {
    try {
        const { response } = await requireProfile({ roles: ADMIN_ROLES });
        if (response) return response;

        const { questionId } = await req.json();

        if (!questionId) {
            return new Response(
                JSON.stringify({ error: "Question ID is required." }),
                { status: 400 }
            );
        }

        // Attempt to delete the question
        const { data, error } = await getSupabaseAdmin()
            .from("questions")
            .delete()
            .eq("questionId", questionId)
            .select("id");

        if (error) throw error;

        if (!data || data.length === 0) {
            return new Response(
                JSON.stringify({ error: "Question not found or already deleted." }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Question deleted successfully." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting question:", error);
        return new Response(
            JSON.stringify({ error: "Failed to delete question." }),
            { status: 500 }
        );
    }
}
