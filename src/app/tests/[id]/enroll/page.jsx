"use client";
import NavbarLite from "@/components/NavbarLite.jsx";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import Loader from "@/components/Loader";
import Link from "next/link";
import Image from "next/image";
import React, { Suspense, useState, useEffect, useCallback, useMemo, useRef } from "react";
import tests from "@/data/tests";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthState } from "@/libs/supabase/authClient";
import confetti from "canvas-confetti";

function EnrollContent() {
  const [userDetails, setUserDetails] = useState(null);
  const [user, authLoading] = useAuthState();
  const searchParams = useSearchParams();
  const testPack = searchParams.get("pack");

  const pageParams = useParams();
  const pageType = typeof pageParams?.id === "string" ? pageParams.id : "";
  const [testDetails, setTestDetails] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();
  const [paymentRunning, setPaymentRunning] = useState(false);
  const [checkingPending, setCheckingPending] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const autoCheckedKeyRef = useRef("");

  const getUser = useCallback(
    async (id) => {
      if (!id) return;
      try {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id }),
        });
        const resjson = await res.json();
        if (res.status === 200 && resjson.user) {
          setUserDetails(resjson.user);
        } else if (resjson.msg === "No user found") {
          router.push("/sign-up?oauth=google");
        } else {
          toast.error("Failed to get user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    [router]
  );

  useEffect(() => {
    if (user?.uid) {
      getUser(user.uid);
    } else if (!authLoading) {
      toast.error("Please sign up / sign in first");
      router.push("/sign-in");
    }
  }, [user, authLoading, router, getUser]);

  useEffect(() => {
    if (!pageType) return;
    setLoadingPage(true);
    const found = tests.find((t) => t.id === pageType) || null;
    setTestDetails(found);
    setLoadingPage(false);
  }, [pageType]);

  const isValidPack = testPack === "Pack 1" || testPack === "Pack 2" || testPack === "Both Packs";

  const formattedPack = (() => {
    if (testPack === "Pack 1") return "Pack 1";
    if (testPack === "Pack 2") return "Pack 2";
    if (testPack === "Both Packs") return "Pack 1 + Pack 2 (Both)";
    return testPack || "N/A";
  })();

  const targetTestString =
    testDetails && isValidPack ? `${testDetails.title}, ${formattedPack}` : null;

  const alreadyOwned = useMemo(() => {
    if (!userDetails?.registeredTests || !testDetails || !isValidPack) return false;
    const normalizePack = (pack) => (pack?.includes("Both") ? "Pack 1 + Pack 2" : pack);
    const selectedNormalized =
      testPack === "Both Packs" ? "Pack 1 + Pack 2" : normalizePack(testPack);

    for (const reg of userDetails.registeredTests) {
      const [regName, regPack] = (reg.test || "").split(", ");
      const regNormalized = normalizePack(regPack || "");
      if (testDetails.title === regName) {
        if (
          selectedNormalized === "Pack 1 + Pack 2" &&
          (regNormalized === "Pack 1" || regNormalized === "Pack 2")
        ) {
          return true;
        }
        if (
          regNormalized === "Pack 1 + Pack 2" &&
          (selectedNormalized === "Pack 1" || selectedNormalized === "Pack 2")
        ) {
          return true;
        }
        if (selectedNormalized === regNormalized) {
          return true;
        }
      }
    }
    return false;
  }, [userDetails, testDetails, isValidPack, testPack]);

  const triggerSuccessState = useCallback(() => {
    setIsRegistrationSuccess(true);
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#d99b26", "#0f4c81", "#10b981"],
    });
  }, []);

  const checkPendingPayment = useCallback(
    async ({ silent = false } = {}) => {
      if (!targetTestString || !userDetails) return;
      if (!silent) setCheckingPending(true);
      try {
        const res = await fetch("/api/payments/reconcile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test: targetTestString }),
        });
        const data = await res.json();
        if (res.ok && data.recovered) {
          toast.success("Payment verified and registration activated!");
          if (user?.uid) await getUser(user.uid);
          triggerSuccessState();
        } else if (!silent) {
          toast("No completed pending payment found for this pack yet.", { icon: "ℹ️" });
        }
      } catch {
        if (!silent) {
          toast.error("Unable to verify pending payments right now.");
        }
      } finally {
        if (!silent) setCheckingPending(false);
      }
    },
    [targetTestString, userDetails, getUser, user, triggerSuccessState]
  );

  // Silently reconcile once per candidate + package if checkout was previously interrupted.
  useEffect(() => {
    if (!userDetails || !targetTestString || alreadyOwned || isRegistrationSuccess) return;
    const key = `${userDetails._id || userDetails.id || ""}:${targetTestString}`;
    if (autoCheckedKeyRef.current === key) return;
    autoCheckedKeyRef.current = key;
    checkPendingPayment({ silent: true });
  }, [userDetails, targetTestString, alreadyOwned, isRegistrationSuccess, checkPendingPayment]);

  function calculateDiscountedPrice(originalPrice, discount) {
    return Math.round(originalPrice - originalPrice * discount);
  }

  const totalAmount = () => {
    if (!testDetails) return 0;
    if (testPack === "Pack 1" || testPack === "Pack 2") return testDetails.pricePerPack;
    if (testPack === "Both Packs") return testDetails.pricePerPack * 2;
    return 0;
  };

  const totalAmountAfterDiscount = () => {
    if (!testDetails) return 0;
    if (testPack === "Pack 1" || testPack === "Pack 2") {
      return calculateDiscountedPrice(testDetails.pricePerPack, testDetails.discountRate);
    }
    if (testPack === "Both Packs") {
      return calculateDiscountedPrice(testDetails.pricePerPack * 2, testDetails.comboDiscountRate);
    }
    return 0;
  };

  const discountedAmount = () => Math.max(0, totalAmount() - totalAmountAfterDiscount());

  function loadScript(src) {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const handlePayment = async () => {
    if (paymentRunning || !testDetails || !isValidPack || !userDetails || alreadyOwned) return;

    const amount = totalAmountAfterDiscount();
    const receipt = `TEST-${Date.now()}`;
    const selectedTestLabel = targetTestString;

    setPaymentRunning(true);
    const loadingId = toast.loading("Initializing secure checkout...");

    try {
      const response = await fetch("/api/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100,
          receipt,
          test: selectedTestLabel,
        }),
      });

      const initPaymentResponse = await response.json();
      toast.dismiss(loadingId);

      if (!response.ok) {
        toast.error(initPaymentResponse?.message || "Could not initialize payment.");
        setPaymentRunning(false);
        return;
      }

      if (initPaymentResponse.alreadyCompleted) {
        toast.success(initPaymentResponse.message || "Enrollment confirmed!");
        setPaymentRunning(false);
        if (user?.uid) await getUser(user.uid);
        triggerSuccessState();
        return;
      }

      const activeKey = initPaymentResponse.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY;
      if (!activeKey || !initPaymentResponse.id) {
        toast.error("Payment gateway configuration is incomplete. Please contact support.");
        setPaymentRunning(false);
        return;
      }

      const loaded = await loadScript("https://checkout.razorpay.com/v2/checkout.js");
      const RazorpayCheckout = typeof window !== "undefined" ? window["Razorpay"] : null;
      if (!loaded || typeof RazorpayCheckout === "undefined" || !RazorpayCheckout) {
        toast.error("Razorpay Checkout failed to load. Please check your connection.");
        setPaymentRunning(false);
        return;
      }

      const cleanMobile = String(userDetails.mobile || "").replace(/\D/g, "").slice(-10);

      const options = {
        key: activeKey,
        amount: initPaymentResponse.amount || amount * 100,
        currency: initPaymentResponse.currency || "INR",
        name: "IGTS Registration - Dhanak 2027",
        description: `GATE 2027 Mock Test (${testDetails.shortName} · ${formattedPack})`,
        image: `${window.location.origin}/images/logo.png`,
        order_id: initPaymentResponse.id,
        handler: async function (rzpResponse) {
          const confirmToastId = toast.loading("Confirming your enrollment, please hold on...");
          try {
            const verifyRes = await fetch("/api/test/registerTest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                pid: rzpResponse.razorpay_payment_id,
                oid: rzpResponse.razorpay_order_id,
                signature: rzpResponse.razorpay_signature,
                name: userDetails.name,
                test: selectedTestLabel,
              }),
            });
            const rdata = await verifyRes.json();
            toast.dismiss(confirmToastId);

            if (!verifyRes.ok) {
              toast.error(rdata?.message || "Payment verification failed.");
              setPaymentRunning(false);
              return;
            }

            toast.success("Test registered successfully!");
            setPaymentRunning(false);
            if (user?.uid) await getUser(user.uid);
            triggerSuccessState();
          } catch {
            toast.dismiss(confirmToastId);
            toast.error(
              "Confirmation interrupted. Click 'Verify Pending Payment' if your amount was debited."
            );
            setPaymentRunning(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentRunning(false);
          },
        },
        prefill: {
          name: userDetails.name || "",
          email: userDetails.email || "",
          ...(cleanMobile.length === 10 ? { contact: cleanMobile } : {}),
        },
        notes: {
          test: selectedTestLabel,
          address: "IIST, Valiamala, Thiruvananthapuram, Kerala, India",
        },
        theme: {
          color: "#0f4c81",
        },
      };

      const rzp = new RazorpayCheckout(options);
      rzp.on("payment.failed", function (rzpError) {
        setPaymentRunning(false);
        toast.error(rzpError?.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch {
      toast.dismiss(loadingId);
      setPaymentRunning(false);
      toast.error("Unable to reach payment gateway. Please try again.");
    }
  };

  if (loadingPage || (!userDetails && !authLoading)) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <NavbarLite />
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (!testDetails || !isValidPack) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <NavbarLite />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Invalid Package Selected</h1>
          <p className="text-slate-600 mt-2 text-sm">
            Please select a valid branch and pack from the GATE 2027 tests page.
          </p>
          <Link
            href="/tests"
            className="mt-6 px-5 py-2.5 rounded-lg bg-[#0f4c81] text-white text-sm font-semibold hover:bg-[#0a3963] transition"
          >
            Browse Test Packages
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (isRegistrationSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="flex flex-col items-center px-8 sm:px-10 py-10 rounded-xl shadow-sm border border-emerald-200 bg-white max-w-xl w-full text-center">
            <Image
              src="/images/successTick.svg"
              width={64}
              height={64}
              alt="Success"
              className="mb-4"
            />
            <h1 className="text-2xl font-bold text-emerald-700 mb-2">
              Registration Confirmed
            </h1>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              You are enrolled in <strong>{testDetails.title} ({formattedPack})</strong> for GATE 2027.
              A confirmation email has been sent to {userDetails?.email}.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                className="px-5 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition"
                href="/registered-tests"
              >
                Open My Mock Tests
              </Link>
              <Link
                className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 border border-slate-200 transition"
                href="/dashboard"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const appliedDiscountPercent = Math.round(
    (testPack === "Both Packs" ? testDetails.comboDiscountRate : testDetails.discountRate) * 100
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <NavbarLite />

      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 pb-5 border-b border-slate-200">
          <div className="text-xs sm:text-sm flex flex-wrap items-center gap-2 text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/tests" className="hover:text-slate-900">
              Mock Tests
            </Link>
            <span>/</span>
            <Link href={`/tests/${testDetails.id}`} className="hover:text-slate-900">
              {testDetails.shortName}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Confirm Your Enrollment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Candidate Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Candidate Details</h2>
                <Link href="/dashboard" className="text-xs font-semibold text-[#0f4c81] hover:underline">
                  Update Profile
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <p>
                  <span className="text-slate-500">Name:</span>{" "}
                  <strong className="text-slate-900">{userDetails?.name}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Email:</span>{" "}
                  <strong className="text-slate-900">{userDetails?.email}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Mobile:</span>{" "}
                  <strong className="text-slate-900">+91 {userDetails?.mobile}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Branch:</span>{" "}
                  <strong className="text-slate-900">{userDetails?.branch}</strong>
                </p>
                <p className="sm:col-span-2">
                  <span className="text-slate-500">College:</span>{" "}
                  <strong className="text-slate-900">{userDetails?.college}</strong>
                </p>
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Selected Package</h2>
                <Link href={`/tests/${testDetails.id}`} className="text-xs font-semibold text-[#0f4c81] hover:underline">
                  Change Pack
                </Link>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="text-base font-bold text-[#0f4c81]">
                  GATE 2027 Mock Test Series — {testDetails.title}
                </p>
                <p>
                  <span className="text-slate-500">Package:</span>{" "}
                  <strong className="text-slate-900">{formattedPack}</strong>
                </p>
                <p className="text-slate-600">
                  Includes {testPack === "Both Packs" ? "6" : "3"} full-length mock tests aligned with
                  GATE 2027.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 text-xs text-slate-600 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p>
                Already debited via UPI/Card during an interrupted checkout? Click to verify and
                unlock immediately without paying again.
              </p>
              <button
                type="button"
                disabled={checkingPending}
                onClick={() => checkPendingPayment({ silent: false })}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold whitespace-nowrap transition disabled:opacity-60"
              >
                {checkingPending ? "Checking..." : "Verify Pending Payment"}
              </button>
            </div>
          </div>

          {/* Right Column: Payment Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 space-y-5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Payment Summary
                </h2>

                <div className="space-y-2.5 text-sm tabular-nums">
                  <div className="flex justify-between text-slate-600">
                    <span>Test Series Fee</span>
                    <span>₹{totalAmount()}.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedDiscountPercent}% Off)</span>
                    <span>- ₹{discountedAmount()}.00</span>
                  </div>
                </div>

                <hr className="border-slate-200" />

                <div className="flex items-baseline justify-between tabular-nums">
                  <span className="text-sm font-bold text-slate-900">Total Payable</span>
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{totalAmountAfterDiscount()}.00
                  </span>
                </div>

                {alreadyOwned ? (
                  <Link
                    href="/registered-tests"
                    className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition flex items-center justify-center"
                  >
                    Already Enrolled · Go to My Mock Tests
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={paymentRunning}
                    onClick={handlePayment}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold text-white transition flex items-center justify-center ${
                      paymentRunning
                        ? "bg-[#0f4c81]/70 cursor-wait"
                        : "bg-[#0f4c81] hover:bg-[#0a3963]"
                    }`}
                  >
                    {paymentRunning ? "Processing..." : "Pay Securely with Razorpay"}
                  </button>
                )}

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  By enrolling, you agree to our{" "}
                  <Link href="/terms-of-use" className="text-[#0f4c81] hover:underline font-medium">
                    Terms of Use &amp; Refund Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-[#0f4c81] hover:underline font-medium">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
                256-bit SSL Encrypted Checkout · Powered by Razorpay
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Enroll() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
          <NavbarLite />
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader />
          </div>
          <Footer />
        </div>
      }
    >
      <EnrollContent />
    </Suspense>
  );
}
