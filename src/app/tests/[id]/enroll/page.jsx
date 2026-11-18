"use client";
import NavbarLite from "@/components/NavbarLite.jsx";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import Loader from "@/components/Loader";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import tests from "@/data/tests";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthState } from "@/libs/supabase/authClient";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Enroll({ params }) {
  const [userDetails, setUserDetails] = useState(null);
  const [user, authLoading] = useAuthState();
  const searchParams = useSearchParams();
  const testPack = searchParams.get("pack");

  const pageParams = React.use(params);
  const [testDetails, setTestDetails] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const pageType = pageParams.id;

  const router = useRouter();
  const [paymentRunning, setPaymentRunning] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const getUser = async (id) => {
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
  };

  useEffect(() => {
    if (user) {
      getUser(user.uid);
    } else if (!authLoading) {
      toast.error("Please sign up / sign in first");
      router.push("/sign-in");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!pageType) return;
    setLoadingPage(true);
    const found = tests.find((t) => t.id === pageType) || null;
    setTestDetails(found);
    setLoadingPage(false);
  }, [pageType]);

  const validPacks = ["Pack 1", "Pack 2", "Both Packs"];
  const isValidPack = validPacks.includes(testPack);

  const formattedPack = (() => {
    if (testPack === "Pack 1") return "Pack 1";
    if (testPack === "Pack 2") return "Pack 2";
    if (testPack === "Both Packs") return "Pack 1 + Pack 2 (Both)";
    return testPack || "N/A";
  })();

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
    if (paymentRunning || !testDetails || !isValidPack || !userDetails) return;

    const amount = totalAmountAfterDiscount();
    const receipt = `TEST-${Date.now()}`;
    const test = `${testDetails.title}, ${formattedPack}`;

    setPaymentRunning(true);
    const loadingId = toast.loading("Initializing secure checkout...");

    try {
      const response = await fetch("/api/payments/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "dhanak",
        },
        body: JSON.stringify({
          amount: amount * 100,
          receipt,
          user: userDetails,
          test,
        }),
      });

      const initPaymentResponse = await response.json();
      toast.dismiss(loadingId);

      if (!response.ok) {
        toast.error(initPaymentResponse?.message || "Could not initialize payment.");
        setPaymentRunning(false);
        return;
      }

      const loaded = await loadScript("https://checkout.razorpay.com/v2/checkout.js");
      if (!loaded) {
        toast.error("Razorpay SDK failed to load. Please check your connection.");
        setPaymentRunning(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "IGTS Registration - Dhanak 2027",
        description: `GATE 2027 Mock Test (${testDetails.shortName})`,
        image: `${window.location.origin}/images/logo.png`,
        order_id: initPaymentResponse.id,
        handler: async function (rzpResponse) {
          const t2 = toast.loading("Locking in your registration, please hold on...");
          try {
            const verifyRes = await fetch("/api/test/registerTest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                pid: rzpResponse.razorpay_payment_id,
                oid: rzpResponse.razorpay_order_id,
                signature: rzpResponse.razorpay_signature,
                name: userDetails.name,
                test,
                userId: user.uid,
              }),
            });
            const rdata = await verifyRes.json();
            toast.dismiss(t2);

            if (!verifyRes.ok) {
              toast.error(rdata?.message || "Payment verification failed.");
              setPaymentRunning(false);
              return;
            }

            toast.success("Test registered successfully!");
            setPaymentRunning(false);
            setIsRegistrationSuccess(true);
            confetti({
              particleCount: 110,
              spread: 75,
              origin: { x: 0.5, y: 0.5 },
              colors: ["#f59e0b", "#4f46e5", "#10b981"],
            });
          } catch (err) {
            toast.dismiss(t2);
            toast.error("Verification request failed. Please contact support if amount was debited.");
            setPaymentRunning(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentRunning(false);
          },
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: String(userDetails.mobile || ""),
        },
        notes: {
          address: "IIST, Valiamala, Thiruvananthapuram, Kerala, India",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (rzpError) {
        setPaymentRunning(false);
        toast.error(rzpError?.error?.description || "Payment failed.");
      });
      rzp.open();
    } catch (err) {
      toast.dismiss(loadingId);
      setPaymentRunning(false);
      toast.error("Unable to reach payment gateway. Please try again.");
    }
  };

  if (loadingPage || (!userDetails && !authLoading)) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
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
      <div className="min-h-screen flex flex-col bg-slate-50">
        <NavbarLite />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
          <h1 className="text-2xl font-extrabold text-slate-900">Invalid Package Selected</h1>
          <p className="text-slate-600 mt-2">
            Please select a valid branch and pack from the GATE 2027 tests page.
          </p>
          <Link
            href="/tests"
            className="mt-6 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
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
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <motion.div
            className="flex flex-col items-center px-8 sm:px-12 py-12 rounded-3xl shadow-xl border border-emerald-200 bg-white max-w-xl w-full text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <img className="h-20 w-20 mb-4" src="/images/successTick.svg" alt="Success" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mb-2">
              Registration Successful!
            </h1>
            <p className="text-slate-600 mb-6">
              You are enrolled in <strong>{testDetails.title} ({formattedPack})</strong> for GATE 2027.
              A confirmation email has been sent to {userDetails?.email}.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-full shadow-md hover:bg-emerald-700 transition"
                href="/registered-tests"
              >
                View My Tests →
              </Link>
              <Link
                className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-full hover:bg-slate-200 transition"
                href="/dashboard"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const appliedDiscountPercent = Math.round(
    (testPack === "Both Packs" ? testDetails.comboDiscountRate : testDetails.discountRate) * 100
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarLite />

      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            IGTS · Dhanak 2027 Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Confirm Your Enrollment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Candidate Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-900">1. Candidate Details</h2>
                <Link href="/dashboard" className="text-xs font-bold text-indigo-600 hover:underline">
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
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-900">2. Selected Package</h2>
                <Link href={`/tests/${testDetails.id}`} className="text-xs font-bold text-indigo-600 hover:underline">
                  Change Pack
                </Link>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="text-base font-extrabold text-indigo-700">
                  GATE 2027 Mock Test Series — {testDetails.title}
                </p>
                <p>
                  <span className="text-slate-500">Package:</span>{" "}
                  <strong className="text-slate-900">{formattedPack}</strong>
                </p>
                <p className="text-slate-600">
                  *Includes {testPack === "Both Packs" ? "6" : "3"} full-length mock tests aligned with
                  GATE 2027.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              After completing payment via Razorpay UPI / Card / Netbanking, you will receive an
              instant confirmation email and access inside <strong>Your Tests</strong>. Please do not
              refresh the browser during payment processing. Need help? Visit{" "}
              <Link href="/faqs" className="text-indigo-600 underline">
                FAQs
              </Link>{" "}
              or{" "}
              <Link href="/contact-us" className="text-indigo-600 underline">
                Contact Us
              </Link>
              .
            </p>
          </div>

          {/* Right Column: Payment Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="p-6 space-y-5">
                <h2 className="text-lg font-extrabold text-slate-900">Payment Summary</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Test Series Fee</span>
                    <span>₹{totalAmount()}.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedDiscountPercent}% OFF)</span>
                    <span>- ₹{discountedAmount()}.00</span>
                  </div>
                </div>

                <hr className="border-slate-200" />

                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold text-slate-900">Total Payable</span>
                  <span className="text-3xl font-extrabold text-indigo-700">
                    ₹{totalAmountAfterDiscount()}.00
                  </span>
                </div>

                <button
                  type="button"
                  disabled={paymentRunning}
                  onClick={handlePayment}
                  className={`w-full py-3.5 px-6 rounded-full font-bold text-white shadow-md transition flex items-center justify-center gap-2 ${
                    paymentRunning
                      ? "bg-indigo-400 cursor-wait"
                      : "bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3]"
                  }`}
                >
                  <span>{paymentRunning ? "Processing..." : "Pay Securely with Razorpay"}</span>
                </button>

                <p className="text-[11px] text-slate-500 text-center">
                  By enrolling, you agree to our{" "}
                  <Link href="/privacy-policy" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
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
