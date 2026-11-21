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

  const scheduleRows = Object.entries(tests[0].testSchedule.pack1pack2both).map(
    ([, date], idx) => ({
      label: `Mock Test ${idx + 1}`,
      pack: idx < 3 ? "Pack 1 & Combo" : "Pack 2 & Combo",
      date,
      window: "5:30 PM – 11:30 PM IST",
      duration: "180 Minutes",
    })
  );

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
                <span className="text-slate-200 font-medium">Mock Tests</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                GATE 2027 Mock Test Series
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Select your engineering branch below to inspect exact mock schedules, exam pattern,
                and discounted single-pack (₹120) or combo (₹200) plans.
              </p>
            </div>
          </div>
        </section>

        {/* Stream Cards */}
        <section id="streams" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                1. Engineering Streams
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Click any branch to choose Pack 1, Pack 2, or the 6-Mock Combo.
              </p>
            </div>
            <a
              href="#schedule"
              className="text-sm font-semibold text-[#0f4c81] hover:underline whitespace-nowrap"
            >
              Jump to Exam Calendar ↓
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider">
                        {test.code} · GATE 2027
                      </span>
                      <span className="text-xs font-semibold text-emerald-700">
                        {Math.round(test.discountRate * 100)}% Off
                      </span>
                    </div>

                    <div className="p-7 space-y-5">
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
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0f4c81] transition leading-snug">
                            {test.title}
                          </h3>
                          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                            {test.tagline}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-2 text-sm text-slate-700 pt-3 border-t border-slate-100">
                        {test.highlights?.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span className="text-[#0f4c81] font-bold leading-5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-7 py-5 border-t border-slate-200/80 bg-slate-50/70 space-y-4">
                    <div className="flex items-baseline justify-between tabular-nums">
                      <div>
                        <p className="text-xs text-slate-500">Pack 1 / Pack 2 (3 Mocks)</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-sm text-slate-400 line-through">
                            ₹{test.pricePerPack}
                          </span>
                          <span className="text-2xl font-bold text-slate-900">₹{singlePrice}/-</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Combo (6 Mocks)</p>
                        <p className="text-base font-bold text-[#0f4c81] mt-0.5">₹{comboPrice}/-</p>
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

        {/* Master Examination Schedule Calendar */}
        <section id="schedule" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  2. Master GATE 2027 Examination Calendar
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Synchronized dates across Aerospace (AE), Electronics &amp; Communication (EC/EE),
                  and Mechanical (ME).
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-[#0f4c81] bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md self-start">
                5:30 PM – 11:30 PM IST Window
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 border-r border-slate-200">Paper</th>
                    <th className="py-3.5 px-4 border-r border-slate-200">Included In</th>
                    <th className="py-3.5 px-4 border-r border-slate-200">Exam Date</th>
                    <th className="py-3.5 px-4 border-r border-slate-200">Live Window</th>
                    <th className="py-3.5 px-4">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 tabular-nums">
                  {scheduleRows.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 border-r border-slate-200 font-semibold text-slate-900">
                        {row.label}
                      </td>
                      <td className="py-3.5 px-4 border-r border-slate-200">{row.pack}</td>
                      <td className="py-3.5 px-4 border-r border-slate-200 font-medium text-[#0f4c81]">
                        {row.date}
                      </td>
                      <td className="py-3.5 px-4 border-r border-slate-200">{row.window}</td>
                      <td className="py-3.5 px-4">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
