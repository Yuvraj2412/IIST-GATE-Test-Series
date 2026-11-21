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
  const [activeTab, setActiveTab] = useState("schedule");

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

  const activeScheduleKey =
    selectedPack === "Pack 1" ? "pack1" : selectedPack === "Pack 2" ? "pack2" : "pack1pack2both";
  const activeScheduleEntries = Object.entries(testDetails.testSchedule[activeScheduleKey] || {});

  const PurchaseCard = () => (
    <div className="bg-white text-slate-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xs font-mono font-semibold text-slate-600 uppercase">
          {testDetails.code} · {testDetails.shortName}
        </span>
        <span className="text-xs font-semibold text-emerald-700">
          {Math.round(discountRate * 100)}% Off
        </span>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-2 flex-shrink-0">
            <Image src={testDetails.imageUrl} width={44} height={44} alt={testDetails.title} />
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
            Already Enrolled — Open My Tests
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
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="text-xs sm:text-sm flex flex-wrap items-center gap-2 text-slate-400 mb-5">
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

            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-amber-300">
                Dhanak 2027 · {testDetails.code} Series
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                GATE Mock Series — {testDetails.title}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {testDetails.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-300 font-mono">
                <span>65 QUESTIONS</span>
                <span>·</span>
                <span>180 MINUTES</span>
                <span>·</span>
                <span>5:30 PM – 11:30 PM IST WINDOW</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation Strip */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 overflow-x-auto">
            {[
              { id: "schedule", label: "Schedule & Packages" },
              { id: "pattern", label: "Exam Pattern & Marking" },
              { id: "highlights", label: "Highlights & Rules" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm sm:text-base font-medium border-b-2 whitespace-nowrap transition ${
                    active
                      ? "border-[#0f4c81] text-[#0f4c81] font-semibold"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Focused Two-Column Body */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Tabbed Workspace */}
            <div className="lg:col-span-8 space-y-6">
              {activeTab === "schedule" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        Test Schedule — {selectedPack === "Both Packs" ? "Combo (All 6 Mocks)" : selectedPack}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Switch pack filter below to inspect dates and update your enrollment selection.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Pack Filter synced with PurchaseCard */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "Pack 1", label: "Pack 1 (Tests 1–3)" },
                      { id: "Pack 2", label: "Pack 2 (Tests 1–3)" },
                      { id: "Both Packs", label: "Combo Both (All 6 Tests)" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedPack(opt.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition ${
                          selectedPack === opt.id
                            ? "bg-[#0f4c81] text-white border-[#0f4c81]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-slate-200 text-sm">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 border-r border-slate-200">Paper</th>
                          <th className="py-3 px-4 border-r border-slate-200">Exam Date</th>
                          <th className="py-3 px-4">Live Access Window</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 tabular-nums">
                        {activeScheduleEntries.map(([k, dateVal], idx) => (
                          <tr key={k} className="hover:bg-slate-50/60">
                            <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-900">
                              Mock Test {idx + 1}
                            </td>
                            <td className="py-3 px-4 border-r border-slate-200 font-semibold text-[#0f4c81]">
                              {dateVal}
                            </td>
                            <td className="py-3 px-4 text-slate-600">5:30 PM – 11:30 PM IST (180 mins)</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "pattern" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      GATE 2027 Examination Pattern &amp; Marking
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Identical question distribution, virtual CBT timing, and marking rules as GATE
                      2027.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 border border-slate-200 rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                    {[
                      { label: "Total Questions", value: "65 Qs" },
                      { label: "Total Marks", value: "100 Marks" },
                      { label: "Duration", value: "180 Mins" },
                      { label: "Format", value: "MCQ, MSQ, NAT" },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4">
                        <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                        <p className="mt-1 text-base font-bold text-slate-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-slate-200 text-sm">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 border-r border-slate-200">Section</th>
                          <th className="py-3 px-4 border-r border-slate-200">Count</th>
                          <th className="py-3 px-4 border-r border-slate-200">Correct</th>
                          <th className="py-3 px-4">Incorrect (MCQ only)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700 tabular-nums">
                        <tr>
                          <td className="py-3 px-4 border-r border-slate-200 font-medium">General Aptitude</td>
                          <td className="py-3 px-4 border-r border-slate-200">5 Qs</td>
                          <td className="py-3 px-4 border-r border-slate-200 text-emerald-700 font-semibold">+1</td>
                          <td className="py-3 px-4 text-rose-600 font-semibold">-1/3</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-r border-slate-200 font-medium">General Aptitude</td>
                          <td className="py-3 px-4 border-r border-slate-200">5 Qs</td>
                          <td className="py-3 px-4 border-r border-slate-200 text-emerald-700 font-semibold">+2</td>
                          <td className="py-3 px-4 text-rose-600 font-semibold">-2/3</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-r border-slate-200 font-medium">Core Subject</td>
                          <td className="py-3 px-4 border-r border-slate-200">25 Qs</td>
                          <td className="py-3 px-4 border-r border-slate-200 text-emerald-700 font-semibold">+1</td>
                          <td className="py-3 px-4 text-rose-600 font-semibold">-1/3</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-r border-slate-200 font-medium">Core Subject</td>
                          <td className="py-3 px-4 border-r border-slate-200">30 Qs</td>
                          <td className="py-3 px-4 border-r border-slate-200 text-emerald-700 font-semibold">+2</td>
                          <td className="py-3 px-4 text-rose-600 font-semibold">-2/3</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200 border-l-4 border-l-[#0f4c81] rounded-md px-4 py-3">
                    Zero negative marking applies to Multiple Select (MSQ) and Numerical Answer Type
                    (NAT) questions.
                  </p>
                </div>
              )}

              {activeTab === "highlights" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Series Highlights &amp; Attempt Guidelines
                  </h2>

                  <ul className="space-y-3 text-sm text-slate-700">
                    {[
                      "Fresh concept-driven questions curated by top GATE rankers and researchers at IIST.",
                      "Supervised 180-minute full-screen Computer-Based Test window from 5:30 PM – 11:30 PM IST.",
                      "Requires a desktop, laptop, or tablet browser; mobile browsers are restricted during live attempts.",
                      "Full KaTeX mathematical rendering and diagrams across question statements and answer review.",
                      "Detailed section-wise score breakdown, accuracy chart, and estimated GATE rank range post-test.",
                    ].map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5">
                        <span className="text-[#0f4c81] font-bold">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-sm">
                    <Link href="/faqs" className="font-semibold text-[#0f4c81] hover:underline">
                      Read All FAQs →
                    </Link>
                    <Link href="/terms-of-use" className="font-semibold text-slate-700 hover:underline">
                      Terms of Use &amp; Refund Policy →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sticky Checkout Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <PurchaseCard />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
