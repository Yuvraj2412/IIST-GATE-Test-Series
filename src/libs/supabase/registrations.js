import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";

/**
 * Returns a user's test registrations in the same shape the Mongo
 * `.populate()` calls produced:
 *   { _id, ..., payment: { _id, status, amount }, userId: { _id, name, email } }
 */
export async function getPopulatedRegistrations(profile) {
    const supabase = getSupabaseAdmin();

    const { data: registrations, error } = await supabase
        .from("test_registrations")
        .select("*")
        .eq("userId", profile.id)
        .order("createdAt", { ascending: true });
    if (error) throw error;
    if (!registrations || registrations.length === 0) return [];

    const paymentIds = [...new Set(registrations.map((r) => r.payment))];
    const { data: payments, error: payErr } = await supabase
        .from("payments")
        .select("id, status, amount")
        .in("id", paymentIds);
    if (payErr) throw payErr;

    const paymentsById = new Map((payments || []).map((p) => [p.id, withId(p)]));
    const userRef = { _id: profile.id, id: profile.id, name: profile.name, email: profile.email };

    return registrations.map((r) => ({
        ...withId(r),
        payment: paymentsById.get(r.payment) || null,
        userId: userRef,
    }));
}
