import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the SECRET key.
 * Bypasses Row Level Security – NEVER import this from a client component.
 */
let adminClient;

export function getSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin() must only be used on the server.");
  }
  if (!adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!url || !secretKey) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY env vars.");
    }
    adminClient = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

/** Adds the Mongo-style `_id` alias the frontend expects (rows use `id`). */
export function withId(row) {
  if (!row || typeof row !== "object") return row;
  return { _id: row.id, ...row };
}

export function withIds(rows) {
  return (rows || []).map(withId);
}
