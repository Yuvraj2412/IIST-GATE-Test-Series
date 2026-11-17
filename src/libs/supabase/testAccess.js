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
