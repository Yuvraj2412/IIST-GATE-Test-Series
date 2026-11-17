import { NextResponse } from "next/server";
import { getSupabaseAdmin, withIds } from "@/libs/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const { data: faqs, error } = await getSupabaseAdmin()
            .from("faqs")
            .select("*")
            .order("createdAt", { ascending: true });

        if (error) throw error;

        return NextResponse.json(withIds(faqs), { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { msg: "Error fetching FAQs", error: error.message },
            { status: 500 }
        );
    }
}
