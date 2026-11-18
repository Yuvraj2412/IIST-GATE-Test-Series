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

  const features = [
    {
      num: "01",
      title: "Curated by IIST Rankers & Faculty",
      description:
        "Every question paper is authored and peer-reviewed by top GATE rankers and postgraduate researchers at IIST under faculty guidance.",
      meta: "Academic Standard",
    },
    {
      num: "02",
      title: "Authentic GATE 2027 Pattern",
      description:
        "Follows the official 65-question, 100-mark structure across General Aptitude and Core Engineering with MCQ, MSQ, and NAT questions.",
      meta: "65 Questions · 180 Mins",
    },
    {
      num: "03",
      title: "Accessible Student Pricing",
      description:
        "Attempt 3 full-length mocks for ₹120 per pack (50% off) or unlock all 6 full-length mocks in the combo pack at 58% off.",
      meta: "From ₹120 per pack",
    },
    {
      num: "04",
      title: "Post-Test Score & Rank Analytics",
      description:
        "Inspect section-wise accuracy breakdowns, positive vs negative scoring metrics, projected GATE rank bands, and full KaTeX solutions.",
      meta: "Detailed Reports",
    },
  ];

  const enrollmentSteps = [
    {
      step: "Step 01",
      title: "Create Your Account",
      description: "Register using email OTP verification or instant Google Sign-In.",
    },
    {
      step: "Step 02",
      title: "Select Your Stream",
      description: "Choose ECE & Electrical, Aerospace, or Mechanical Engineering.",
    },
    {
      step: "Step 03",
      title: "Choose a Test Pack",
      description: "Select Pack 1, Pack 2, or the 6-test Combo and complete Razorpay checkout.",
    },
    {
      step: "Step 04",
      title: "Confirm Schedule Access",
      description: "Access unlocked mock schedules immediately under Your Tests with email receipt.",
    },
    {
      step: "Step 05",
      title: "Attempt Live Window",
      description: "Sign in before the 5:30 PM IST window on exam day via laptop or tablet.",
    },
    {
      step: "Step 06",
      title: "Review Detailed Solutions",
      description: "Examine accuracy charts, rank estimates, and step-by-step solutions.",
    },
  ];

  const calculateDiscountedPrice = (price, rate) => Math.round(price - price * rate);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <NavbarHome />

      <main className="flex-1 w-full">
        {/* Institutional Hero */}
        <section className={`${style.bgHome} text-white`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left: Editorial Copy */}
              <div className="lg:col-span-7 space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Indian Institute of Space Science &amp; Technology · Dhanak 2027
                </p>

                <h1 className="heroText text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                  IGTS — GATE 2027 National Mock Test Series
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Built by IIST Thiruvananthapuram rankers and scholars to replicate official GATE
                  difficulty, Computer-Based Test timing, and quantitative analysis across
                  Aerospace, Electronics &amp; Communication, and Mechanical Engineering.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Link
                    href="/tests"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-[#0b1526] bg-white hover:bg-slate-100 transition"
                  >
                    Explore GATE 2027 Mocks
                  </Link>
                  <Link
                    href={uid ? "/dashboard" : "/sign-up"}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm text-white border border-white/25 hover:bg-white/10 transition"
                  >
                    {uid ? "Open Candidate Dashboard" : "Create Candidate Account"}
                  </Link>
                </div>

                {/* Hairline Metrics Strip */}
                <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { value: "3 Streams", label: "AE · EC/EE · ME" },
                    { value: "65 Questions", label: "180 Min CBT Format" },
                    { value: "₹120", label: "Per 3-Mock Pack" },
                    { value: "Dept. of Space", label: "IIST Initiative" },
                  ].map((item) => (
                    <div key={item.value}>
                      <p className="text-lg font-bold text-white tabular-nums">{item.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Institutional Emblem & Stream Directory */}
              <div className="lg:col-span-5">
                <div className="bg-[#111e33] border border-white/10 rounded-xl p-6 sm:p-7 space-y-6">
                  <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white border border-white/20 flex-shrink-0">
                        <Image
                          src="/images/iist-logo.png"
                          alt="IIST Seal"
                          fill
                          sizes="56px"
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-black border border-amber-400/40 flex-shrink-0">
                        <Image
                          src="/images/dhanak-logo.png"
                          alt="Dhanak 2027 Emblem"
                          fill
                          sizes="56px"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                        Edition 2027
                      </p>
                      <p className="text-sm font-semibold text-white mt-0.5">Official Series</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Available Engineering Streams
                    </p>
                    <div className="divide-y divide-white/10 border border-white/10 rounded-lg bg-[#0b1526]/60">
                      {tests.map((t) => {
                        const price = calculateDiscountedPrice(t.pricePerPack, t.discountRate);
                        return (
                          <Link
                            key={t.id}
                            href={`/tests/${t.id}`}
                            className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition group"
                          >
                            <div>
                              <p className="text-sm font-semibold text-white group-hover:text-sky-300 transition">
                                {t.shortName}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                6 Full-Length Mocks · {t.code}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-white tabular-nums">
                                ₹{price}
                              </span>
                              <span className="block text-[11px] text-slate-400">per pack →</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Schedules run December 2026 through January 2027 in a supervised 5:30 PM – 11:30
                    PM IST exam window.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Streams Grid */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0f4c81]">
                GATE 2027 Test Series
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Select Your Engineering Stream
              </h2>
            </div>
            <Link
              href="/tests"
              className="text-sm font-semibold text-[#0f4c81] hover:text-[#0a3963] transition"
            >
              View full schedules &amp; combo plans →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tests.map((test) => {
              const price = calculateDiscountedPrice(test.pricePerPack, test.discountRate);
              return (
                <Link
                  key={test.id}
                  href={`/tests/${test.id}`}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-slate-400 shadow-sm transition-colors flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-8 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider">
                        {test.code} · GATE 2027
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                        {Math.round(test.discountRate * 100)}% Off
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
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
                  </div>

                  <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between">
                    <div className="tabular-nums">
                      <span className="text-xs text-slate-400 line-through mr-2">
                        ₹{test.pricePerPack}
                      </span>
                      <span className="text-xl font-bold text-slate-900">₹{price}/-</span>
                      <span className="text-xs text-slate-500 ml-1">/ pack</span>
                    </div>
                    <span className="text-sm font-semibold text-[#0f4c81] group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Academic Specification Grid */}
        <section className="bg-white border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0f4c81]">
                Program Structure
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Engineered for Serious GATE Preparation
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600">
                Built around the official GATE examination format so your mock practice translates
                directly to exam-day composure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4">
                      <span>{feature.num}</span>
                      <span>{feature.meta}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration & Conduct Workflow */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0f4c81]">
              Enrollment Process
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollmentSteps.map((step) => (
              <div
                key={step.title}
                className="bg-white rounded-xl border border-slate-200 p-6 space-y-2"
              >
                <p className="text-xs font-mono font-semibold text-[#0f4c81] uppercase">
                  {step.step}
                </p>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white border border-slate-200 border-l-4 border-l-[#0f4c81] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-700">
              <strong className="text-slate-900">CBT Device Policy:</strong> Live full-screen mock
              exams require a laptop, desktop, or tablet browser. Mobile phones are restricted during
              active exam attempts to preserve authentic GATE testing conditions.
            </div>
            <Link
              href="/faqs"
              className="text-sm font-semibold text-[#0f4c81] hover:underline flex-shrink-0"
            >
              Read Exam FAQs →
            </Link>
          </div>
        </section>

        {/* Dhanak 2027 Institutional Callout */}
        <section className="bg-[#0b1526] text-white border-t border-slate-800">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  IIST Thiruvananthapuram · Student Initiative
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Organised Under Dhanak 2027
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Dhanak is the annual cultural festival of the Indian Institute of Space Science and
                  Technology. Every IGTS registration supports student-led campus initiatives while
                  delivering rigorous GATE 2027 preparation across India.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/tests"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0b1526] bg-white hover:bg-slate-100 transition"
                  >
                    Register for GATE 2027
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-white border border-white/25 hover:bg-white/10 transition"
                  >
                    About IIST &amp; Dhanak 2027
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border border-white/20">
                  <Image
                    src="/images/iist-logo.png"
                    alt="IIST Official Seal"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-black border border-amber-400/40">
                  <Image
                    src="/images/logo.png"
                    alt="Dhanak 2027 Official Logo"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
