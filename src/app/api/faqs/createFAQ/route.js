import { NextResponse } from "next/server";
import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { requireProfile, ADMIN_ROLES } from "@/libs/supabase/server";

export async function POST(req) {
    const { profile, response } = await requireProfile({ roles: ADMIN_ROLES });
    if (response) return response;

    const { question, answer, category } = await req.json();

    if (!question || !answer) {
        return NextResponse.json({ msg: "Question and answer are required" }, { status: 400 });
    }

    try {
        // Create a new FAQ entry
        const { data: newFAQ, error } = await getSupabaseAdmin()
            .from("faqs")
            .insert({
                question: String(question).trim(),
                answer: String(answer).trim(),
                category: category || "General",
                createdByEmail: profile.email, // taken from the signed-in admin
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(
            { msg: "FAQ created successfully", faq: withId(newFAQ) },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { msg: "Error creating FAQ", error: error.message },
            { status: 500 }
        );
    }
}
