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
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
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
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900">Test Series Not Found</h1>
          <p className="text-slate-600 mt-2 text-sm">
            The requested GATE 2027 mock package does not exist.
          </p>
          <Link
            href="/tests"
            className="mt-6 px-5 py-2.5 rounded-lg bg-[#0f4c81] text-white text-sm font-semibold hover:bg-[#0a3963] transition"
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
    <div className="bg-white text-slate-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xs font-mono font-semibold text-slate-600 uppercase">
          {testDetails.code} · {testDetails.shortName}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          {Math.round(discountRate * 100)}% Off
        </span>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-2 flex-shrink-0">
            <Image src={testDetails.imageUrl} width={48} height={48} alt={testDetails.title} />
          </div>
          <div className="tabular-nums">
            <p className="text-xs text-slate-500">Registration Fee</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm text-slate-400 line-through">₹{originalFee}</span>
              <span className="text-3xl font-bold text-slate-900">₹{finalFee}/-</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedPack === "Both Packs" ? "Combo (6 full-length mocks)" : "3 full-length mocks"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Select Package
          </p>
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
                  className={`py-2 px-2 rounded-lg border text-center transition ${
                    active
                      ? "bg-[#0f4c81] border-[#0f4c81] text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <span className="block text-xs sm:text-sm font-semibold">{pkg.label}</span>
                  <span className={`block text-[11px] ${active ? "text-slate-200" : "text-slate-500"}`}>
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
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition"
          >
            Already Enrolled — Open Your Tests
          </button>
        ) : testDetails.isRegistrationOpen ? (
          <button
            type="button"
            onClick={handleEnroll}
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition tabular-nums"
          >
            Enroll Now · ₹{finalFee}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-slate-500 bg-slate-200 cursor-not-allowed"
          >
            Registration Closed
          </button>
        )}

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          Razorpay UPI / Cards · Laptop or Tablet required for live tests
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        <section className={`${style.topSection} text-white`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5">
                <div className="text-xs sm:text-sm flex flex-wrap items-center gap-2 text-slate-400">
                  <Link href="/" className="hover:text-white transition">
                    Home
                  </Link>
                  <span>/</span>
                  <Link href="/tests" className="hover:text-white transition">
                    GATE 2027 Mock Tests
                  </Link>
                  <span>/</span>
                  <span className="text-slate-200 font-medium">{testDetails.shortName}</span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-amber-300">
                    Dhanak 2027 · {testDetails.code} Series
                  </p>
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                    GATE Mock Series — {testDetails.title}
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                    {testDetails.description}
                  </p>
                </div>

                {/* Mobile Purchase Card */}
                <div className="lg:hidden pt-2">
                  <PurchaseCard />
                </div>

                {/* Pack Schedules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                  {["pack1", "pack2"].map((packKey, index) => {
                    const schedule = testDetails.testSchedule[packKey];
                    const isSelected =
                      selectedPack === "Both Packs" || selectedPack === `Pack ${index + 1}`;
                    return (
                      <div
                        key={packKey}
                        className={`rounded-xl p-5 border transition ${
                          isSelected
                            ? "bg-white text-slate-900 border-white shadow-sm"
                            : "bg-[#111e33] text-slate-100 border-white/15"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-current/10">
                          <span className="text-base font-bold">{`Pack ${index + 1}`}</span>
                          <span
                            className={`text-xs font-mono ${
                              isSelected ? "text-[#0f4c81] font-semibold" : "text-slate-400"
                            }`}
                          >
                            3 Full Mocks
                          </span>
                        </div>
                        <ul className="space-y-2 text-sm tabular-nums">
                          {Object.entries(schedule).map(([k, dateVal], idx) => (
                            <li
                              key={k}
                              className="flex items-center justify-between py-1 border-b border-current/10 last:border-none"
                            >
                              <span className="font-medium">Mock Test {idx + 1}</span>
                              <span className={isSelected ? "text-slate-600" : "text-slate-300"}>
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

              <div className="hidden lg:block lg:col-span-4">
                <PurchaseCard />
              </div>
            </div>
          </div>
        </section>

        {/* Pattern & Marking Scheme */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              Examination Format &amp; Marking Scheme
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              {[
                { label: "Questions", value: "65 (10 GA + 55 Core)" },
                { label: "Question Types", value: "MCQ, MSQ & NAT" },
                { label: "Exam Window", value: "5:30 PM – 11:30 PM IST" },
                { label: "Duration", value: "180 Minutes" },
              ].map((stat) => (
                <div key={stat.label} className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 border-r border-slate-200">Section</th>
                    <th className="py-3 px-4 border-r border-slate-200">Question Count</th>
                    <th className="py-3 px-4 border-r border-slate-200">Correct Mark</th>
                    <th className="py-3 px-4">Negative Marking (MCQ only)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 border-r border-slate-200 font-medium">General Aptitude</td>
                    <td className="py-3 px-4 border-r border-slate-200 tabular-nums">5 Questions</td>
                    <td className="py-3 px-4 border-r border-slate-200 text-emerald-700 font-semibold">+1</td>
                    <td className="py-3 px-4 text-rose-600 font-semibold">-1/3</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-r border-slate-200 font-medium">General Aptitude</td>
                    <td className="py-3 px-4 border-r border-slate-200 tabular-nums">5 Questions</td>
                    <td className="py-3 px-4 border-r border-slate-200 text-emerald-700 font-semibold">+2</td>
                    <td className="py-3 px-4 text-rose-600 font-semibold">-2/3</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-r border-slate-200 font-medium">Core Subject</td>
                    <td className="py-3 px-4 border-r border-slate-200 tabular-nums">25 Questions</td>
                    <td className="py-3 px-4 border-r border-slate-200 text-emerald-700 font-semibold">+1</td>
                    <td className="py-3 px-4 text-rose-600 font-semibold">-1/3</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-r border-slate-200 font-medium">Core Subject</td>
                    <td className="py-3 px-4 border-r border-slate-200 tabular-nums">30 Questions</td>
                    <td className="py-3 px-4 border-r border-slate-200 text-emerald-700 font-semibold">+2</td>
                    <td className="py-3 px-4 text-rose-600 font-semibold">-2/3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200 border-l-4 border-l-[#0f4c81] rounded-md px-4 py-3">
              Note: There is zero negative marking for Multiple Select Questions (MSQ) and Numerical
              Answer Type (NAT) questions.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
              Series Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-sm text-slate-700">
              {[
                "Wide spectrum of conceptual and application-level questions aligned to GATE 2027.",
                "Supervised online CBT exam interface with strict 180-minute countdown timer.",
                "Instant section-wise accuracy charts and projected GATE rank band analytics.",
                "Calibrated by IIST postgraduate researchers and GATE top rankers.",
                "Clear KaTeX mathematical typesetting and labelled circuit/system diagrams.",
                "Review complete solutions and responses anytime from your Candidate Dashboard.",
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-2.5 py-1.5">
                  <span className="text-[#0f4c81] font-bold">✓</span>
                  <span>{benefit}</span>
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
