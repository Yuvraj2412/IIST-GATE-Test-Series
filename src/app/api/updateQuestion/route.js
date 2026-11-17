import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { requireProfile, ADMIN_ROLES } from "@/libs/supabase/server";

export async function POST(req) {
    try {
        const { response: authResponse } = await requireProfile({ roles: ADMIN_ROLES });
        if (authResponse) return authResponse;

        const { questionId, questionText, options } = await req.json();

        // Validate request payload
        if (!questionId || !questionText || !Array.isArray(options) || options.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "Question ID, question text, and valid options are required.",
                }),
                { status: 400 }
            );
        }

        // Update the question row
        const { data: updatedQuestion, error } = await getSupabaseAdmin()
            .from("questions")
            .update({ questionText, options })
            .eq("questionId", questionId)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!updatedQuestion) {
            return new Response(
                JSON.stringify({ error: "Question not found." }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Question updated successfully.",
                updatedQuestion: withId(updatedQuestion),
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating question:", error);
        return new Response(
            JSON.stringify({ error: "Failed to update question." }),
            { status: 500 }
        );
    }
}
