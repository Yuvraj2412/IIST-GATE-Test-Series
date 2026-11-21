"use client";
import NavbarHome from "@/components/NavbarHome.jsx";
import Footer from "@/components/Footer.jsx";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import tests from "@/data/tests";
import style from "@/components/styles/homeCSS.module.css";

export default function Home() {
  const { uid } = useSelector((state) => state.auth);

  const steps = [
    {
      num: "01",
      title: "Select Stream & Pack",
      description:
        "Choose ECE & Electrical, Aerospace, or Mechanical. Enroll in Pack 1 or Pack 2 (3 mocks each at ₹120) or all 6 mocks (₹200).",
    },
    {
      num: "02",
      title: "Attempt Live Exam",
      description:
        "Sign in under My Tests between 5:30 PM and 11:30 PM IST on your test date from a laptop or tablet for the 180-minute CBT.",
    },
    {
      num: "03",
      title: "Analyze Rank & Solutions",
      description:
        "Review sectional scores across General Aptitude and Core Engineering, accuracy breakdown, and projected GATE rank range.",
    },
  ];

  const calculateDiscountedPrice = (price, rate) => Math.round(price - price * rate);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <NavbarHome />

      <main className="flex-1 w-full">
        {/* Clean Uncluttered Hero */}
        <section className={`${style.bgHome} text-white`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-amber-300">
                  Indian Institute of Space Science &amp; Technology · Dhanak 2027
                </p>

                <h1 className="heroText text-4xl sm:text-5xl font-bold tracking-tight leading-[1.12] text-white">
                  GATE 2027 Mock Test Series
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Crafted by IIST top rankers and researchers to replicate official GATE difficulty,
                  timing, and performance analytics for Electronics, Aerospace, and Mechanical
                  Engineering aspirants.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/tests"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg font-semibold text-sm sm:text-base text-[#0b1526] bg-white hover:bg-slate-100 transition"
                  >
                    Browse Mock Tests &amp; Schedule
                  </Link>
                  <Link
                    href={uid ? "/registered-tests" : "/sign-up"}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg font-semibold text-sm sm:text-base text-white border border-white/25 hover:bg-white/10 transition"
                  >
                    {uid ? "Open My Tests" : "Create Candidate Account"}
                  </Link>
                </div>

                <p className="pt-2 text-sm text-slate-400">
                  65 Questions · 100 Marks · 180-Min CBT Format · Starts ₹120 per pack
                </p>
              </div>

              {/* Clean Official Identity Frame (Zero Repetitive Lists Inside Hero) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-md bg-[#111e33] border border-white/15 rounded-2xl p-8 text-center space-y-6">
                  <div className="flex items-center justify-center gap-6">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border-2 border-white/25 flex-shrink-0">
                      <Image
                        src="/images/iist-logo.png"
                        alt="IIST Official Seal"
                        fill
                        sizes="112px"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-black border-2 border-amber-400/50 flex-shrink-0">
                      <Image
                        src="/images/dhanak-logo.png"
                        alt="Dhanak 2027 Phoenix Logo"
                        fill
                        sizes="112px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-4 border-t border-white/10">
                    <p className="text-sm font-bold text-white">
                      IIST Thiruvananthapuram × Dhanak 2027
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      An Institution under Department of Space, Government of India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Generous Engineering Branch Cards */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Select Your GATE 2027 Stream
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Choose a stream below to view test schedules, syllabus focus, and package pricing.
              </p>
            </div>
            <Link
              href="/tests#schedule"
              className="text-sm font-semibold text-[#0f4c81] hover:underline whitespace-nowrap"
            >
              View Master Exam Schedule →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tests.map((test) => {
              const price = calculateDiscountedPrice(test.pricePerPack, test.discountRate);
              const comboPrice = calculateDiscountedPrice(
                test.pricePerPack * 2,
                test.comboDiscountRate
              );
              return (
                <div
                  key={test.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-7 space-y-5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider">
                        {test.code} · 6 Mocks Total
                      </span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                        {Math.round(test.discountRate * 100)}% Off
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 p-2">
                        <Image
                          src={test.imageUrl}
                          width={44}
                          height={44}
                          alt={test.altText}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug">
                        {test.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">{test.tagline}</p>
                  </div>

                  <div className="px-7 py-5 bg-slate-50/70 border-t border-slate-200 space-y-4">
                    <div className="flex items-baseline justify-between tabular-nums">
                      <div>
                        <span className="text-xs text-slate-500 block">Pack 1 or 2 (3 Tests)</span>
                        <span className="text-2xl font-bold text-slate-900">₹{price}/-</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Combo (6 Tests)</span>
                        <span className="text-base font-bold text-[#0f4c81]">₹{comboPrice}/-</span>
                      </div>
                    </div>

                    <Link
                      href={`/tests/${test.id}`}
                      className="block w-full py-2.5 px-4 rounded-lg text-center text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition"
                    >
                      Explore Package &amp; Schedule
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How Participation Works
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Simple enrollment to instant post-test analysis in three clear steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className="bg-[#f8fafc] rounded-xl border border-slate-200 p-7 space-y-3"
                >
                  <span className="text-xs font-mono font-bold text-[#0f4c81] uppercase">
                    Step {s.num}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>

            <div className="border border-slate-200 border-l-4 border-l-[#0f4c81] rounded-lg p-5 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Device &amp; Window Requirement:</strong> Live
                exams run <strong>5:30 PM – 11:30 PM IST</strong> on scheduled dates using a{" "}
                <strong>laptop, desktop, or tablet browser</strong> in full-screen mode.
              </p>
              <Link
                href="/faqs"
                className="text-sm font-semibold text-[#0f4c81] hover:underline whitespace-nowrap"
              >
                Read FAQs →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
