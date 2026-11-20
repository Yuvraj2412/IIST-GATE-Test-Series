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
      title: "Select Your GATE Stream & Pack",
      description:
        "Pick Electronics & Communication, Aerospace, or Mechanical. Choose Pack 1, Pack 2 (3 mocks each for ₹120) or the 6-mock Combo (₹200).",
      href: "/tests",
      action: "Browse Streams →",
    },
    {
      num: "02",
      title: "Attempt During Live Exam Window",
      description:
        "Log into My Mock Tests from a laptop or tablet browser on test day between 5:30 PM and 11:30 PM IST for a full-screen 180-minute CBT.",
      href: uid ? "/registered-tests" : "/sign-up",
      action: uid ? "Open My Mock Tests →" : "Create Account →",
    },
    {
      num: "03",
      title: "Inspect Accuracy & GATE Rank Band",
      description:
        "Review sectional scores across General Aptitude and Core Subject, projected rank bracket, and full KaTeX solution explanations.",
      href: uid ? "/dashboard/results" : "/faqs",
      action: uid ? "View Results →" : "Read Exam FAQs →",
    },
  ];

  const calculateDiscountedPrice = (price, rate) => Math.round(price - price * rate);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <NavbarHome />

      <main className="flex-1 w-full">
        {/* Clean Institutional Hero */}
        <section className={`${style.bgHome} text-white`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Indian Institute of Space Science &amp; Technology · Dhanak 2027
                </p>

                <h1 className="heroText text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                  IGTS — GATE 2027 Mock Test Series
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Created by IIST rankers and postgraduate researchers to mirror official GATE 2027
                  difficulty, Computer-Based Test interface, and quantitative analytics across AE,
                  EC/EE, and ME.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Link
                    href="/tests"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-[#0b1526] bg-white hover:bg-slate-100 transition"
                  >
                    Explore GATE 2027 Series
                  </Link>
                  <Link
                    href={uid ? "/registered-tests" : "/sign-up"}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm text-white border border-white/25 hover:bg-white/10 transition"
                  >
                    {uid ? "Go to My Mock Tests" : "Candidate Sign Up"}
                  </Link>
                </div>

                <div className="pt-5 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-2 text-xs sm:text-sm text-slate-300">
                  <span>65 Questions · 100 Marks</span>
                  <span>180-Min Official CBT</span>
                  <span>Starts ₹120 / Pack</span>
                </div>
              </div>

              {/* Direct Stream Jump Panel */}
              <div className="lg:col-span-5">
                <div className="bg-[#111e33] border border-white/10 rounded-xl p-6 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-white/20 flex-shrink-0">
                        <Image
                          src="/images/iist-logo.png"
                          alt="IIST Seal"
                          fill
                          sizes="48px"
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black border border-amber-400/40 flex-shrink-0">
                        <Image
                          src="/images/dhanak-logo.png"
                          alt="Dhanak 2027 Emblem"
                          fill
                          sizes="48px"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                        Select Branch
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Direct Exam Links</p>
                    </div>
                  </div>

                  <div className="divide-y divide-white/10 border border-white/10 rounded-lg bg-[#0b1526]/60">
                    {tests.map((t) => {
                      const price = calculateDiscountedPrice(t.pricePerPack, t.discountRate);
                      return (
                        <Link
                          key={t.id}
                          href={`/tests/${t.id}`}
                          className="flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition group"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-sky-300 transition">
                              {t.shortName}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{t.code} · 6 Full Mocks</p>
                          </div>
                          <span className="text-xs font-semibold text-sky-300 tabular-nums">
                            From ₹{price} →
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href="/tests#schedule"
                    className="block text-center text-xs font-medium text-slate-300 hover:text-white underline underline-offset-4"
                  >
                    View Dec 2026 – Jan 2027 Schedule Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Navigation Bar */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <span className="font-semibold text-slate-500">Quick Navigation:</span>
            <div className="flex flex-wrap items-center gap-4 sm:gap-7">
              <Link href="/tests" className="font-semibold text-[#0f4c81] hover:underline">
                1. Test Catalog &amp; Pricing
              </Link>
              <Link href="/tests#schedule" className="font-medium text-slate-700 hover:text-[#0f4c81]">
                2. Mock Dates Calendar
              </Link>
              <Link
                href={uid ? "/registered-tests" : "/sign-in"}
                className="font-medium text-slate-700 hover:text-[#0f4c81]"
              >
                3. Attempt / Candidate Portal
              </Link>
              <Link href="/faqs" className="font-medium text-slate-700 hover:text-[#0f4c81]">
                4. FAQs &amp; Device Rules
              </Link>
            </div>
          </div>
        </section>

        {/* Stream Packages */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Engineering Test Packages
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600">
                Choose your target GATE 2027 paper to inspect exact mock schedules and pricing.
              </p>
            </div>
            <Link
              href="/tests"
              className="text-sm font-semibold text-[#0f4c81] hover:underline"
            >
              Compare streams &amp; calendar →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {tests.map((test) => {
              const price = calculateDiscountedPrice(test.pricePerPack, test.discountRate);
              const comboPrice = calculateDiscountedPrice(
                test.pricePerPack * 2,
                test.comboDiscountRate
              );
              return (
                <Link
                  key={test.id}
                  href={`/tests/${test.id}`}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-slate-400 shadow-sm transition-colors flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-7 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                        {test.code} · 6 Mocks Total
                      </span>
                      <span className="text-xs font-semibold text-emerald-700">
                        {Math.round(test.discountRate * 100)}% Off
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 p-2">
                        <Image
                          src={test.imageUrl}
                          width={44}
                          height={44}
                          alt={test.altText}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0f4c81] transition leading-snug">
                        {test.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">{test.tagline}</p>
                  </div>

                  <div className="px-7 py-4 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between tabular-nums">
                    <div>
                      <span className="text-lg font-bold text-slate-900">₹{price}/-</span>
                      <span className="text-xs text-slate-500 ml-1.5">pack · ₹{comboPrice} combo</span>
                    </div>
                    <span className="text-sm font-semibold text-[#0f4c81] group-hover:underline">
                      Open →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Simple 3-Step Workflow + Exam Standard */}
        <section className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How IGTS Works
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600">
                From registration to rank analysis in three clear steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className="bg-slate-50/70 rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-semibold text-[#0f4c81]">STEP {s.num}</span>
                    <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
                  </div>
                  <Link href={s.href} className="text-xs font-semibold text-[#0f4c81] hover:underline">
                    {s.action}
                  </Link>
                </div>
              ))}
            </div>

            <div className="border border-slate-200 border-l-4 border-l-[#0f4c81] rounded-lg p-5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-slate-700">
                <strong className="text-slate-900">Exam Mode Notice:</strong> Live CBT papers run
                between <strong>5:30 PM – 11:30 PM IST</strong> on a{" "}
                <strong>laptop, desktop, or tablet browser</strong> (mobile phones are disabled
                during active attempts).
              </div>
              <Link
                href="/terms-of-use"
                className="text-xs sm:text-sm font-semibold text-[#0f4c81] hover:underline whitespace-nowrap"
              >
                Terms &amp; Conduct Rules →
              </Link>
            </div>
          </div>
        </section>

        {/* Institutional Note */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="bg-[#0b1526] text-white rounded-xl border border-slate-800 p-7 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-2.5 max-w-2xl">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Dhanak 2027 · IIST Thiruvananthapuram
              </p>
              <h2 className="text-xl sm:text-2xl font-bold">
                Built by IIST Students for GATE 2027 Aspirants
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore more about IIST&apos;s annual festival Dhanak 2027 or reach our student
                coordinators directly with any questions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0b1526] bg-white hover:bg-slate-100 transition"
              >
                About Dhanak 2027
              </Link>
              <Link
                href="/contact-us"
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white border border-white/25 hover:bg-white/10 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
