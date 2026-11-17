import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { requireProfile, ADMIN_ROLES } from "@/libs/supabase/server";

export async function POST(req) {
    try {
        // Returns correct answers, so only question admins may call it.
        const { response } = await requireProfile({ roles: ADMIN_ROLES });
        if (response) return response;

        const { questionId } = await req.json();

        if (!questionId) {
            return new Response(
                JSON.stringify({ error: "Question ID is required." }),
                { status: 400 }
            );
        }

        const { data: question, error } = await getSupabaseAdmin()
            .from("questions")
            .select("*")
            .eq("questionId", questionId)
            .maybeSingle();

        if (error) throw error;

        if (!question) {
            return new Response(
                JSON.stringify({ error: "Question not found." }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(withId(question)), { status: 200 });
    } catch (error) {
        console.error("Error fetching question:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch question." }),
            { status: 500 }
        );
    }
}
