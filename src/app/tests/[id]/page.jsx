"use client";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import Loader from "@/components/Loader";
import style from "@/components/styles/testsCSS.module.css";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import tests from "@/data/tests";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthState } from "@/libs/supabase/authClient";
import { motion } from "framer-motion";

export default function TestDetails({ params }) {
  const [userDetails, setUserDetails] = useState(null);
  const [user] = useAuthState();
  const pageParams = React.use(params);
  const [testDetails, setTestDetails] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [selectedPack, setSelectedPack] = useState("Pack 2");

  const pageType = pageParams.id;
  const router = useRouter();

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
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (!pageType) return;
    setLoadingPage(true);
    const found = tests.find((t) => t.id === pageType) || null;
    setTestDetails(found);
    setLoadingPage(false);
  }, [pageType]);

  function calculateDiscountedPrice(originalPrice, discountRate) {
    return Math.round(originalPrice - originalPrice * discountRate);
  }

  const isAlreadyRegistered = (packChoice) => {
    if (!userDetails?.registeredTests || !testDetails) return false;
    const normalizePack = (pack) => (pack?.includes("Both") ? "Pack 1 + Pack 2" : pack);
    const selectedNormalized =
      packChoice === "Both Packs" ? "Pack 1 + Pack 2" : normalizePack(packChoice);

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
  };

  const handleEnroll = () => {
    if (!testDetails?.isRegistrationOpen) {
      toast.error("Registrations for this pack are currently closed.");
      return;
    }

    if (!userDetails) {
      toast("Please login or sign up to enroll!", { icon: "ℹ️" });
      router.push("/sign-in");
      return;
    }

    if (isAlreadyRegistered(selectedPack)) {
      toast.success("You are already registered for this pack!");
      router.push("/registered-tests");
      return;
    }

    router.push(`/tests/${testDetails.id}/enroll?pack=${encodeURIComponent(selectedPack)}`);
  };

  if (loadingPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (!testDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
          <h1 className="text-3xl font-extrabold text-slate-900">Test Series Not Found</h1>
          <p className="text-slate-600 mt-2">
            The requested GATE 2027 mock package does not exist.
          </p>
          <Link
            href="/tests"
            className="mt-6 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
          >
            Back to All Tests
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const originalFee =
    selectedPack === "Both Packs" ? testDetails.pricePerPack * 2 : testDetails.pricePerPack;
  const discountRate =
    selectedPack === "Both Packs" ? testDetails.comboDiscountRate : testDetails.discountRate;
  const finalFee = calculateDiscountedPrice(originalFee, discountRate);
  const alreadyOwned = isAlreadyRegistered(selectedPack);

  const PurchaseCard = () => (
    <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 py-8 px-6 flex flex-col items-center justify-center relative">
        <span className="absolute top-4 left-4 text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-900 text-amber-300">
          {testDetails.code}
        </span>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 absolute top-4 right-4">
          {Math.round(discountRate * 100)}% OFF
        </span>
        <Image
          src={testDetails.imageUrl}
          width={120}
          height={120}
          alt={testDetails.title}
        />
      </div>

      <div className="p-6 space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Special Discounted Fee
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-lg text-slate-400 line-through">₹{originalFee}</span>
            <span className="text-4xl font-extrabold text-slate-900">₹{finalFee}/-</span>
            <span className="text-xs font-semibold text-slate-500">
              {selectedPack === "Both Packs" ? "for 6 mocks" : "for 3 mocks"}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <p className="text-sm font-bold text-slate-800">Select Your Package</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Pack 1", label: "Pack 1", sub: "3 Tests" },
              { id: "Pack 2", label: "Pack 2", sub: "3 Tests" },
              { id: "Both Packs", label: "Combo", sub: "6 Tests" },
            ].map((pkg) => {
              const active = selectedPack === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPack(pkg.id)}
                  className={`py-2.5 px-2 rounded-xl border text-center transition ${
                    active
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300"
                  }`}
                >
                  <span className="block text-xs sm:text-sm font-extrabold">{pkg.label}</span>
                  <span
                    className={`block text-[11px] ${
                      active ? "text-indigo-100" : "text-slate-500"
                    }`}
                  >
                    {pkg.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {alreadyOwned ? (
          <button
            type="button"
            onClick={() => router.push("/registered-tests")}
            className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md"
          >
            Already Registered · Go to Your Tests →
          </button>
        ) : testDetails.isRegistrationOpen ? (
          <button
            type="button"
            onClick={handleEnroll}
            className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] transition shadow-md shadow-indigo-500/20"
          >
            Enroll Now · ₹{finalFee} →
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3.5 px-6 rounded-full font-bold text-slate-500 bg-slate-200 cursor-not-allowed"
          >
            Registration Closed
          </button>
        )}

        <p className="text-[11px] text-slate-500 text-center">
          Instant activation via Razorpay UPI / Cards · Laptop or Tablet required for live tests
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        {/* Top Cosmic Section */}
        <section className={`${style.topSection} relative overflow-hidden w-full text-white`}>
          <div className="cosmicGrid absolute inset-0 opacity-50 pointer-events-none" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="lg:col-span-8 space-y-6">
                <div className="text-xs sm:text-sm flex flex-wrap items-center gap-2 text-slate-300">
                  <Link href="/" className="hover:text-white transition">
                    Home
                  </Link>
                  <span>/</span>
                  <Link href="/tests" className="hover:text-white transition">
                    GATE 2027 Mock Tests
                  </Link>
                  <span>/</span>
                  <span className="text-amber-300 font-semibold">{testDetails.shortName}</span>
                </div>

                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full mb-3">
                    Dhanak 2027 · GATE 2027 Edition
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    GATE Mock for {testDetails.title}
                  </h1>
                  <p className="mt-3 text-slate-300 text-base sm:text-lg max-w-2xl">
                    {testDetails.description}
                  </p>
                </div>

                {/* Mobile Purchase Card */}
                <div className="lg:hidden">
                  <PurchaseCard />
                </div>

                {/* Test Schedules (Pack 1 & Pack 2) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  {["pack1", "pack2"].map((packKey, index) => {
                    const schedule = testDetails.testSchedule[packKey];
                    const isHighlighted =
                      selectedPack === "Both Packs" ||
                      selectedPack === `Pack ${index + 1}`;
                    return (
                      <div
                        key={packKey}
                        className={`rounded-2xl p-6 transition border backdrop-blur-md ${
                          isHighlighted
                            ? "bg-white text-slate-900 border-amber-300 shadow-lg"
                            : "bg-white/10 text-white border-white/15"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-extrabold">{`Pack ${index + 1}`}</span>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              isHighlighted
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-white/15 text-slate-100"
                            }`}
                          >
                            3 Full Mocks
                          </span>
                        </div>
                        <ul className="space-y-2.5 text-sm">
                          {Object.entries(schedule).map(([k, dateVal], idx) => (
                            <li key={k} className="flex items-center justify-between border-b border-current/10 pb-2 last:border-none last:pb-0">
                              <span className="font-bold">Test {idx + 1}</span>
                              <span className={isHighlighted ? "text-slate-600 font-medium" : "text-slate-200"}>
                                {dateVal}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Purchase Card */}
              <div className="hidden lg:block lg:col-span-4">
                <PurchaseCard />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Exam Pattern & Marking Scheme */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
              GATE 2027 Test Pattern &amp; Structure
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Total Questions", value: "65 Qs (10 GA + 55 Core)" },
                { label: "Question Types", value: "MCQ, MSQ & NAT" },
                { label: "Live Test Window", value: "5:30 PM – 11:30 PM IST" },
                { label: "Test Duration", value: "3 Hours (180 Mins)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-slate-50 border border-slate-200 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                Marking Scheme Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <strong>General Aptitude (5 Qs):</strong>{" "}
                  <span className="text-emerald-700 font-bold">+1</span> correct ·{" "}
                  <span className="text-rose-600 font-bold">-1/3</span> incorrect
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <strong>General Aptitude (5 Qs):</strong>{" "}
                  <span className="text-emerald-700 font-bold">+2</span> correct ·{" "}
                  <span className="text-rose-600 font-bold">-2/3</span> incorrect
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <strong>Core Subject (25 Qs):</strong>{" "}
                  <span className="text-emerald-700 font-bold">+1</span> correct ·{" "}
                  <span className="text-rose-600 font-bold">-1/3</span> incorrect
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <strong>Core Subject (30 Qs):</strong>{" "}
                  <span className="text-emerald-700 font-bold">+2</span> correct ·{" "}
                  <span className="text-rose-600 font-bold">-2/3</span> incorrect
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 inline-block">
                Note: Zero negative marking applies to Multiple Select (MSQ) and Numerical Answer Type (NAT) questions.
              </p>
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
              Why Choose Our Test Series?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Thorough preparation with a wide spectrum of concept-testing questions.",
                "Simulated official GATE CBT experience with strict 180-minute timing.",
                "Detailed section-wise accuracy charts & projected GATE rank analysis.",
                "Updated content calibrated to the latest GATE 2027 syllabus.",
                "Full mathematical KaTeX typesetting for clear equations and diagrams.",
                "Benchmark yourself against engineering peers nationwide.",
                "Review exact solutions and identify weak areas immediately post-test.",
                "Organized by IIST students at student-friendly subsidized pricing.",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-sm sm:text-base text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
