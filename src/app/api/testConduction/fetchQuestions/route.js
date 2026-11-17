import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";
import { getOwnedRegistration } from "@/libs/supabase/testAccess";

export async function POST(req) {
    try {
        const { profile, response: authResponse } = await requireProfile();
        if (authResponse) return authResponse;

        const { payload } = await req.json();
        const { RegisteredTestId, testPack, testNumber, domain } = payload || {};

        if (!RegisteredTestId || !testPack || !testNumber || !domain) {
            return new Response(
                JSON.stringify({ error: "All parameters are required." }),
                { status: 400 }
            );
        }

        // Ensure the user owns this registration and it covers the requested domain & pack.
        const ownedReg = await getOwnedRegistration(profile.id, RegisteredTestId, {
            domainId: domain,
            packId: testPack,
        });
        if (!ownedReg) {
            return new Response(
                JSON.stringify({ error: "Unauthorized or invalid test registration." }),
                { status: 403 }
            );
        }

        // Fetch questions from Supabase without returning correctAnswers.
        const { data: questions, error } = await getSupabaseAdmin()
            .from("questions")
            .select(
                "id, questionId, domainId, packId, testId, section, type, questionText, diagramLink, options, marks, negativeMarks, difficulty, createdAt, updatedAt"
            )
            .eq("domainId", domain)
            .eq("packId", testPack)
            .eq("testId", testNumber)
            .order("createdAt", { ascending: true });

        if (error) throw error;

        if (!questions || questions.length === 0) {
            return new Response(
                JSON.stringify({ error: "No questions found for the given parameters." }),
                { status: 404 }
            );
        }

        // Arrange questions with aptitude first, then subject questions
        const formattedQuestions = questions
            .map(withId)
            .sort((a, b) => {
                if (a.section === "aptitude" && b.section !== "aptitude") return -1;
                if (a.section !== "aptitude" && b.section === "aptitude") return 1;
                return 0;
            });

        return new Response(
            JSON.stringify({ questions: formattedQuestions }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching questions:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch questions." }),
            { status: 500 }
        );
    }
}
