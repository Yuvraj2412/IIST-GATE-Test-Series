import tests from "@/data/tests";
import { getSupabaseAdmin } from "@/libs/supabase/admin";

const TITLE_TO_DOMAIN_ID = {
  "Aerospace Engineering": "Aerospace",
  "Electronics and Communication Engineering": "ECE",
  "Mechanical Engineering": "Mechanical",
  Physics: "Physics",
};

/** Computes the authoritative Razorpay order amount in paise from `tests.js`. */
export function computeTestAmountInPaise(testString) {
  if (!testString || typeof testString !== "string") return null;
  const idx = testString.indexOf(", ");
  if (idx === -1) return null;

  const title = testString.slice(0, idx).trim();
  const pack = testString.slice(idx + 2).trim();
  const testObj = tests.find((t) => t.title === title);
  if (!testObj) return null;

  let rupees = null;
  if (pack === "Pack 1" || pack === "Pack 2") {
    rupees = Math.round(testObj.pricePerPack - testObj.pricePerPack * testObj.discountRate);
  } else if (pack === "Pack 1 + Pack 2 (Both)") {
    rupees = Math.round(
      testObj.pricePerPack * 2 - testObj.pricePerPack * 2 * testObj.comboDiscountRate
    );
  }

  return rupees && rupees > 0 ? rupees * 100 : null;
}

/**
 * Checks whether a user already has an identical or overlapping pack registration
 * for the same test branch (e.g., owning Pack 1 and attempting Both, or owning Both
 * and attempting Pack 1 / Pack 2).
 */
export async function findOverlappingRegistration(profileId, testString) {
  const idx = String(testString || "").indexOf(", ");
  if (idx === -1) return null;

  const targetTitle = testString.slice(0, idx).trim();
  const targetPack = testString.slice(idx + 2).trim();
  const normalizePack = (p) => (p.includes("Both") ? "BOTH" : p);
  const targetNorm = normalizePack(targetPack);

  const { data: registrations, error } = await getSupabaseAdmin()
    .from("test_registrations")
    .select("id, test")
    .eq("userId", profileId);

  if (error) throw error;

  for (const reg of registrations || []) {
    const rIdx = String(reg.test || "").indexOf(", ");
    if (rIdx === -1) continue;
    const regTitle = reg.test.slice(0, rIdx).trim();
    const regPack = reg.test.slice(rIdx + 2).trim();
    if (regTitle !== targetTitle) continue;

    const regNorm = normalizePack(regPack);
    if (regNorm === targetNorm) return reg;
    if (regNorm === "BOTH" && (targetNorm === "Pack 1" || targetNorm === "Pack 2")) return reg;
    if (targetNorm === "BOTH" && (regNorm === "Pack 1" || regNorm === "Pack 2")) return reg;
  }

  return null;
}

/** Verifies that `registeredTestId` belongs to `profileId` and optionally covers `(domainId, packId)`. */
export async function getOwnedRegistration(profileId, registeredTestId, { domainId, packId } = {}) {
  const { data: registration, error } = await getSupabaseAdmin()
    .from("test_registrations")
    .select("*")
    .eq("id", registeredTestId)
    .eq("userId", profileId)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") return null; // invalid uuid
    throw error;
  }
  if (!registration) return null;

  if (domainId || packId) {
    const idx = registration.test.indexOf(", ");
    if (idx === -1) return null;
    const regTitle = registration.test.slice(0, idx).trim();
    const regPack = registration.test.slice(idx + 2).trim();

    if (domainId) {
      const expectedDomain = TITLE_TO_DOMAIN_ID[regTitle] || regTitle;
      if (expectedDomain !== domainId) return null;
    }
    if (packId) {
      const allowedPacks =
        regPack === "Pack 1 + Pack 2 (Both)" ? ["Pack 1", "Pack 2"] : [regPack];
      if (!allowedPacks.includes(packId)) return null;
    }
  }

  return registration;
}
