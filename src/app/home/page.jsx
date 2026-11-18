"use client";
import NavbarHome from "@/components/NavbarHome.jsx";
import Footer from "@/components/Footer.jsx";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import tests from "@/data/tests";
import style from "@/components/styles/homeCSS.module.css";

export default function Home() {
  const { uid } = useSelector((state) => state.auth);

  const features = [
    {
      title: "Curated by IIST Rankers & Faculty",
      description:
        "Every paper is authored and reviewed by top GATE rankers and postgraduate researchers at IIST under faculty guidance.",
      tag: "Academic Rigor",
    },
    {
      title: "Authentic GATE 2027 Pattern",
      description:
        "Strict adherence to the 65-question, 100-mark structure across General Aptitude & Core Engineering with MCQ, MSQ, and NAT.",
      tag: "65 Qs · 180 Mins",
    },
    {
      title: "Student-First Pricing",
      description:
        "Access 3 full-length mocks for just ₹120 per pack (50% off) or unlock all 6 mocks in the combo pack at 58% off.",
      tag: "Starting ₹120",
    },
    {
      title: "Precision Performance Analytics",
      description:
        "Section-wise accuracy charts, positive vs negative score breakdown, rank estimates, and full KaTeX solution reviews.",
      tag: "Instant Insights",
    },
  ];

  const enrollmentSteps = [
    {
      title: "Create Your Account",
      description: "Sign up quickly using your verified email OTP or instant Google Sign-In.",
    },
    {
      title: "Choose Your GATE Stream",
      description: "Pick ECE & Electrical, Aerospace, or Mechanical Engineering test packages.",
    },
    {
      title: "Select Pack & Pay Securely",
      description: "Choose Pack 1, Pack 2, or Combo Both Packs and pay seamlessly via Razorpay UPI/Cards.",
    },
    {
      title: "Receive Confirmation",
      description: "Get instant portal access inside Your Tests plus an official confirmation email.",
    },
    {
      title: "Attempt in Live Window",
      description: "Log in 10 minutes before 5:30 PM IST on exam day from a laptop or tablet.",
    },
    {
      title: "Analyze Your Performance",
      description: "Review sectional scores, expected GATE rank band, and question-by-question reports.",
    },
  ];

  const calculateDiscountedPrice = (price, rate) => Math.round(price - price * rate);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarHome />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className={`${style.bgHome} relative overflow-hidden text-white`}>
          <div className="cosmicGrid absolute inset-0 pointer-events-none opacity-60" />

          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              {/* Dual Logo Showcase Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-lg mb-8">
                <div className="flex items-center -space-x-2">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white ring-2 ring-sky-400/60">
                    <Image
                      src="/images/iist-logo.png"
                      alt="IIST Seal"
                      fill
                      sizes="36px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-black ring-2 ring-amber-400/70">
                    <Image
                      src="/images/logo.png"
                      alt="Dhanak 2027 Phoenix"
                      fill
                      sizes="36px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <span className="h-4 w-px bg-white/25" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-200">
                  Dhanak 2027 · IIST Thiruvananthapuram
                </span>
              </div>

              <h1 className="heroText text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Crack{" "}
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
                  GATE 2027
                </span>{" "}
                with Confidence
              </h1>

              <p className="mt-4 text-lg sm:text-xl font-semibold text-sky-200">
                IGTS — IIST GATE Test Series
              </p>

              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Presented by the{" "}
                <span className="text-white font-semibold">
                  Indian Institute of Space Science and Technology (IIST)
                </span>{" "}
                — An Institution under Department of Space, ISRO. Simulate real exam rigor with
                topper-curated papers and analytics.
              </p>

              {/* CTA Buttons */}
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  href="/tests"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 hover:from-amber-200 hover:to-orange-300 shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5"
                >
                  <span>Explore GATE 2027 Mocks</span>
                  <span>→</span>
                </Link>
                <Link
                  href={uid ? "/dashboard" : "/sign-up"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition"
                >
                  <span>{uid ? "Open My Dashboard" : "Create Free Account"}</span>
                </Link>
              </div>

              {/* Trust / Metrics Strip */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl">
                {[
                  { value: "3 Streams", label: "AE · EC/EE · ME" },
                  { value: "65 Qs", label: "180 Min CBT Format" },
                  { value: "₹120/-", label: "50% Off Per Pack" },
                  { value: "ISRO / IIST", label: "Student & Ranker Built" },
                ].map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-3.5 text-center"
                  >
                    <p className="text-lg sm:text-xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-300 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Test Series Streams Showcase */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                GATE 2027 Test Series
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
                Choose Your Engineering Branch
              </h2>
            </div>
            <Link
              href="/tests"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              <span>View all packages & schedules</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {tests.map((test) => {
              const price = calculateDiscountedPrice(test.pricePerPack, test.discountRate);
              return (
                <Link
                  key={test.id}
                  href={`/tests/${test.id}`}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative bg-slate-50 border-b border-slate-100 p-8 flex items-center justify-center">
                      <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-amber-300">
                        {test.code}
                      </span>
                      <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {Math.round(test.discountRate * 100)}% OFF
                      </span>
                      <Image
                        src={test.imageUrl}
                        width={116}
                        height={116}
                        alt={test.altText}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition">
                        {test.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {test.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 line-through mr-2">
                        ₹{test.pricePerPack}
                      </span>
                      <span className="text-2xl font-extrabold text-slate-900">₹{price}/-</span>
                      <span className="text-xs text-slate-500 ml-1">/ pack</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                      Explore →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Why Choose Our Platform */}
        <section className="bg-white border-y border-slate-200/80 py-16 sm:py-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Built For Top Percentiles
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">
                Why Aspirants Choose IGTS
              </h2>
              <p className="mt-3 text-slate-600">
                Designed from the ground up to mirror the exact GATE 2027 testing interface and give
                you actionable post-test clarity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.07 }}
                  className="rounded-2xl bg-slate-50 border border-slate-200/90 p-6 hover:bg-white hover:shadow-lg transition-all"
                >
                  <span className="inline-block text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full mb-4">
                    {feature.tag}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Stepper */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Simple 6-Step Journey
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">
              How It Works &amp; Exam Protocol
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              <strong className="text-slate-900">Exam Device Rule:</strong> Live tests require a
              laptop or tablet in full-screen mode (mobile phones are disabled during test conduction
              to maintain GATE fidelity).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollmentSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#674cee] text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                    0{index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dhanak 2027 Spotlight Banner */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="cosmicHeader relative overflow-hidden rounded-3xl border border-slate-800 p-8 sm:p-12 lg:p-14 text-white shadow-2xl">
            <div className="cosmicGrid absolute inset-0 opacity-40 pointer-events-none" />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  IIST Thiruvananthapuram · Cultural &amp; Technical Spirit
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  Powered by{" "}
                  <span className="text-amber-300">Dhanak 2027</span> &amp; IIST Student Community
                </h2>
                <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                  Dhanak is the annual cultural festival of the Indian Institute of Space Science and
                  Technology. Every IGTS registration supports student-led innovation and brings
                  IIST-grade GATE 2027 preparation within reach of engineering aspirants across India.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/tests"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-slate-950 bg-amber-300 hover:bg-amber-200 transition shadow-lg"
                  >
                    Register for GATE 2027 →
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition"
                  >
                    Discover Dhanak 2027
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 flex items-center justify-center gap-5">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-white p-1 ring-4 ring-sky-400/40 shadow-2xl">
                  <Image
                    src="/images/iist-logo.png"
                    alt="IIST Official Seal"
                    fill
                    sizes="144px"
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-black ring-4 ring-amber-400/60 shadow-2xl">
                  <Image
                    src="/images/logo.png"
                    alt="Dhanak 2027 Official Logo"
                    fill
                    sizes="160px"
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
