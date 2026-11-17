"use client";

/**
 * Browser-side Supabase auth.
 *
 * Exposes a small Firebase-style API (getAuth / onAuthStateChanged / signOut /
 * useAuthState) so existing pages keep their structure. User objects carry
 * `uid` (= Supabase auth user id), `email`, `displayName` and `photoURL`.
 */
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

let browserClient;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );
  }
  return browserClient;
}

export function toAppUser(supabaseUser) {
  if (!supabaseUser) return null;
  const meta = supabaseUser.user_metadata || {};
  return {
    ...supabaseUser,
    uid: supabaseUser.id,
    displayName: meta.full_name || meta.name || null,
    photoURL: meta.avatar_url || meta.picture || null,
  };
}

const authState = { currentUser: null };

/** Firebase-style accessor; `currentUser` is kept in sync by onAuthStateChanged. */
export function getAuth() {
  return authState;
}

/**
 * Calls `callback(user | null)` once with the current session and again only
 * when the signed-in user actually changes (sign-in / sign-out), like Firebase.
 * Returns an unsubscribe function.
 */
export function onAuthStateChanged(_auth, callback) {
  const supabase = getSupabaseBrowserClient();
  let first = true;
  let lastUid = null;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = toAppUser(session?.user ?? null);
    const uid = user?.uid ?? null;
    if (!first && uid === lastUid) return;
    first = false;
    lastUid = uid;
    authState.currentUser = user;
    // Defer so callbacks may safely call Supabase / fetch without deadlocking the auth lock.
    setTimeout(() => callback(user), 0);
  });

  return () => subscription.unsubscribe();
}

/** Firebase-hooks style: const [user, loading] = useAuthState(auth) */
export function useAuthState() {
  const [user, setUser] = useState(authState.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(null, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return [user, loading, undefined];
}

export async function signOut() {
  const { error } = await getSupabaseBrowserClient().auth.signOut();
  authState.currentUser = null;
  if (error) throw error;
}

/** Starts Google OAuth; the browser is redirected away and returns to `nextPath`. */
export async function signInWithGoogle(nextPath) {
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  const { error } = await getSupabaseBrowserClient().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
}

export async function sendPasswordResetEmail(email) {
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
  const { error } = await getSupabaseBrowserClient().auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}
