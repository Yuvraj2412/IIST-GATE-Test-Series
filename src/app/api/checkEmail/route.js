import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ msg: "Email is required" }, { status: 400 });
    }

    // Check if the user exists
    const { data: user, error } = await getSupabaseAdmin()
      .from("users")
      .select("id")
      .eq("email", String(email).trim().toLowerCase())
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 201 });
    }

    return NextResponse.json({ msg: "User found" }, { status: 200 });
  } catch (error) {
    console.error("Error in checkEmail function:", error.message);
    return NextResponse.json(
      { msg: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
