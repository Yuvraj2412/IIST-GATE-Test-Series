"use client";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import style from "@/components/styles/testsCSS.module.css";
import Link from "next/link";
import Image from "next/image";
import tests from "@/data/tests";
import { useRouter } from "next/navigation";

export default function Tests() {
  const router = useRouter();

  function calculateDiscountedPrice(originalPrice, discountRate) {
    return Math.round(originalPrice - originalPrice * discountRate);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        <section className={`${style.topSection} text-white`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs sm:text-sm flex items-center gap-2 text-slate-400">
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-slate-200 font-medium">GATE 2027 Mock Tests</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                GATE 2027 Mock Test Series
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Curated by top GATE rankers and researchers at the Indian Institute of Space Science
                and Technology (IIST) for Dhanak 2027. Each package adheres strictly to the official
                GATE syllabus, marking scheme, and 180-minute CBT workflow.
              </p>

              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-300">
                <span>65 QUESTIONS PER MOCK</span>
                <span>·</span>
                <span>180 MINUTES CBT</span>
                <span>·</span>
                <span>UP TO 58% COMBO SAVINGS</span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => {
              const singlePrice = calculateDiscountedPrice(test.pricePerPack, test.discountRate);
              const comboPrice = calculateDiscountedPrice(
                test.pricePerPack * 2,
                test.comboDiscountRate
              );
              return (
                <div
                  key={test.id}
                  onClick={() => router.push(`/tests/${test.id}`)}
                  className="group cursor-pointer bg-white rounded-xl border border-slate-200 hover:border-slate-400 shadow-sm transition-colors flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider">
                        {test.code} · GATE 2027
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {Math.round(test.discountRate * 100)}% Off
                      </span>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 p-2">
                          <Image
                            src={test.imageUrl}
                            width={52}
                            height={52}
                            alt={test.altText}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0f4c81] transition leading-snug">
                            {test.title}
                          </h2>
                          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                            {test.tagline}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
                        {test.highlights?.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span className="text-[#0f4c81] font-bold leading-5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 py-5 border-t border-slate-200/80 bg-slate-50/70 space-y-4">
                    <div className="flex items-baseline justify-between tabular-nums">
                      <div>
                        <p className="text-xs text-slate-500">Single Pack (3 Mocks)</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-sm text-slate-400 line-through">
                            ₹{test.pricePerPack}
                          </span>
                          <span className="text-2xl font-bold text-slate-900">₹{singlePrice}/-</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Combo (6 Mocks)</p>
                        <p className="text-sm font-bold text-[#0f4c81] mt-0.5">₹{comboPrice}/-</p>
                      </div>
                    </div>

                    <div className="w-full py-2.5 px-4 rounded-lg text-center text-sm font-semibold text-white bg-[#0f4c81] group-hover:bg-[#0a3963] transition">
                      View Schedule &amp; Enroll
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
