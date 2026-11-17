import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";
import { requireProfile, ADMIN_ROLES } from "@/libs/supabase/server";

export async function POST(req) {
    try {
        const { profile, response } = await requireProfile({ roles: ADMIN_ROLES });
        if (response) return response;

        const body = await req.json(); // Parse JSON from the request body

        const {
            questionId,
            domainId,
            packId,
            testId,
            section,
            type,
            questionText,
            diagramLink,
            options,
            correctAnswers,
            marks,
            negativeMarks,
            difficulty,
        } = body;

        // Validation for required fields
        if (!questionId || !domainId || !packId || !testId || !questionText) {
            return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
        }

        if (type !== "NUMERICAL" && (!options || options.length < 2)) {
            return NextResponse.json({ error: "MCQ questions must have at least two options." }, { status: 400 });
        }

        const { error } = await getSupabaseAdmin().from("questions").insert({
            questionId,
            domainId,
            packId,
            testId,
            section,
            type,
            questionText,
            diagramLink: diagramLink || null,
            options: options || [],
            correctAnswers: correctAnswers || [],
            marks: Number(marks),
            negativeMarks: negativeMarks !== undefined && negativeMarks !== "" ? Number(negativeMarks) : 0,
            difficulty: difficulty || "medium",
            uploadedBy: profile.email, // taken from the signed-in admin, not the request body
        });

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json({ error: "A question with this Question ID already exists." }, { status: 409 });
            }
            throw error;
        }

        // Return success response
        return NextResponse.json({ message: "Question added successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error adding question:", error);
        // Return failure response
        return NextResponse.json({ error: "Failed to add question. Please try again." }, { status: 500 });
    }
}
