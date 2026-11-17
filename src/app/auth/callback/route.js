import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/libs/supabase/server";

// OAuth (Google) and password-recovery links land here with a `code`.
// We exchange it for a session (stored in cookies) and continue to `next`.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") || "/home";
  if (!next.startsWith("/") || next.startsWith("//")) next = "/home"; // prevent open redirects

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("Auth callback error:", error.message);
  }

  const errorDescription = searchParams.get("error_description") || "Authentication failed";
  return NextResponse.redirect(`${origin}/sign-in?authError=${encodeURIComponent(errorDescription)}`);
}
