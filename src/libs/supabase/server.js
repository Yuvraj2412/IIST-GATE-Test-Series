import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/libs/supabase/admin";

/** Supabase client bound to the request cookies (publishable key, acts as the signed-in user). */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a context where cookies are read-only; middleware refreshes them.
          }
        },
      },
    }
  );
}

/** Returns the verified Supabase auth user for this request, or null. */
export async function getAuthUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

/** Returns the `public.users` profile row for an auth uid, or null. */
export async function getProfileByAuthId(authUid) {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("*")
    .eq("userId", authUid)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Ensures the request has a signed-in user with a profile.
 * Returns { authUser, profile } on success, or { response } with an error response.
 */
export async function requireProfile({ roles } = {}) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return { response: NextResponse.json({ error: "Not authenticated", msg: "Not Authenticated" }, { status: 401 }) };
  }
  const profile = await getProfileByAuthId(authUser.id);
  if (!profile) {
    return { response: NextResponse.json({ error: "User profile not found", msg: "No user found" }, { status: 403 }) };
  }
  if (roles && !roles.includes(profile.role)) {
    return { response: NextResponse.json({ error: "Forbidden", msg: "Forbidden" }, { status: 403 }) };
  }
  return { authUser, profile };
}

export const ADMIN_ROLES = ["testAdmin", "admin"];
