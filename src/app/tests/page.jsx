"use client";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import style from "@/components/styles/testsCSS.module.css";
import Link from "next/link";
import Image from "next/image";
import tests from "@/data/tests";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Tests() {
  const router = useRouter();

  function calculateDiscountedPrice(originalPrice, discountRate) {
    return Math.round(originalPrice - originalPrice * discountRate);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        {/* Top Cosmic Header */}
        <section className={`${style.topSection} relative overflow-hidden w-full text-white`}>
          <div className="cosmicGrid absolute inset-0 opacity-50 pointer-events-none" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col gap-5 max-w-3xl">
              <div className="text-xs sm:text-sm flex items-center gap-2 text-slate-300">
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-amber-300 font-semibold">GATE 2027 Mock Tests</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                GATE 2027{" "}
                <span className="text-amber-300">Mock Test Series</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                Prepare for <strong>GATE 2027</strong> with confidence! Created by students and top
                rankers at the Indian Institute of Space Science and Technology (IIST) for{" "}
                <span className="text-amber-200 font-semibold">Dhanak 2027</span>, our mock tests
                mirror the official GATE difficulty, question mix, and timing.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {["65 Questions / Mock", "180 Mins Official Pattern", "Combo Save 58%"].map(
                  (pill) => (
                    <span
                      key={pill}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-slate-100"
                    >
                      {pill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tests Cards Grid */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
            {tests.map((test, index) => {
              const singlePrice = calculateDiscountedPrice(test.pricePerPack, test.discountRate);
              const comboPrice = calculateDiscountedPrice(
                test.pricePerPack * 2,
                test.comboDiscountRate
              );
              return (
                <motion.div
                  key={test.id}
                  onClick={() => router.push(`/tests/${test.id}`)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Visual Header */}
                    <div className="relative bg-slate-50 border-b border-slate-100 py-10 px-6 flex flex-col items-center justify-center">
                      <span className="absolute top-4 left-4 text-xs font-extrabold tracking-wide px-3 py-1 rounded-full bg-slate-900 text-amber-300">
                        {test.code}
                      </span>
                      <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {Math.round(test.discountRate * 100)}% OFF
                      </span>
                      <div className="p-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
                        <Image
                          src={test.imageUrl}
                          width={120}
                          height={120}
                          alt={test.altText}
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                          GATE 2027 Test Series
                        </p>
                        <h2 className="mt-1 text-xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition">
                          {test.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {test.tagline}
                        </p>
                      </div>

                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                        {test.highlights?.map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing Footer */}
                  <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 bg-slate-50/60">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-xs font-semibold text-emerald-700">
                          Special Discounted Fee
                        </p>
                        <div className="flex items-baseline gap-2.5 mt-0.5">
                          <span className="text-base text-slate-400 line-through">
                            ₹{test.pricePerPack}
                          </span>
                          <span className="text-3xl font-extrabold text-slate-900">
                            ₹{singlePrice}/-
                          </span>
                          <span className="text-xs text-slate-500 font-medium">per pack</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500 font-semibold">Combo (6 Tests)</p>
                        <p className="text-sm font-extrabold text-indigo-700">₹{comboPrice}/-</p>
                      </div>
                    </div>

                    <div className="w-full py-3 px-6 rounded-full text-center font-bold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] group-hover:from-[#4338ca] group-hover:to-[#5b3fe3] shadow-sm shadow-indigo-500/20 transition">
                      View Schedule &amp; Enroll →
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
