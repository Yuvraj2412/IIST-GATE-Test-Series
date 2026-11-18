"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar.jsx";
import Link from "next/link";
import Image from "next/image";
import style from "@/components/styles/aboutUsCSS.module.css";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Top Banner */}
        <section className={`${style.topSection} relative overflow-hidden w-full text-white`}>
          <div className="cosmicGrid absolute inset-0 opacity-50 pointer-events-none" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <div className="flex flex-col gap-5 max-w-3xl">
              <div className="text-xs sm:text-sm flex items-center gap-2 text-slate-300">
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-amber-300 font-semibold">About Dhanak 2027</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                About IGTS &amp;{" "}
                <span className="text-amber-300">Dhanak 2027</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                Dhanak, the Annual Cultural Festival of the{" "}
                <strong className="text-white">
                  Indian Institute of Space Science and Technology (IIST)
                </strong>
                , Thiruvananthapuram, celebrates a vibrant spectrum of talent, creativity, and
                scientific spirit across Southern India. Named after the Hindi word for{" "}
                <em>rainbow</em>, DHANAK brings together culture, innovation, and academic pride.
              </p>
            </div>
          </div>
        </section>

        {/* Dual Identity Crest Section */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12">
            <motion.div
              className="lg:col-span-5 flex flex-col items-center justify-center gap-6 bg-[#070b18] rounded-2xl p-8 border border-slate-800 text-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
            >
              <div className="flex items-center justify-center gap-5">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white ring-4 ring-sky-400/50 shadow-xl">
                  <Image
                    src="/images/iist-logo.png"
                    alt="IIST Official Seal"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-black ring-4 ring-amber-400/70 shadow-xl">
                  <Image
                    src="/images/dhanak-logo.png"
                    alt="Dhanak 2027 Phoenix Logo"
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">
                  Official Emblem · Edition 2027
                </p>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  IIST Thiruvananthapuram × Dhanak 2027
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  An Institution under Department of Space, ISRO
                </p>
              </div>
            </motion.div>

            <div className="lg:col-span-7 space-y-5">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                Dhanak 2027 Launch
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                What Dhanak 2027 &amp; IGTS Stand For
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Rising anew with the <strong className="text-slate-900">Dhanak 2027</strong>{" "}
                Phoenix crest, IIST&apos;s flagship cultural festival pairs artistic expression with
                its academic heritage through the <strong className="text-slate-900">IIST GATE Test Series (IGTS)</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed">
                IGTS gives engineering students across India an affordable, high-rigor GATE 2027
                mock test environment in Aerospace, Electronics &amp; Communication, and Mechanical
                Engineering—crafted by IIST toppers and postgraduate scholars to mirror real exam
                difficulty, timing, and analytics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="font-bold text-slate-900">Campus Heritage</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Hosted at IIST Valiamala campus in the foothills of the Sahyadri mountains,
                    Thiruvananthapuram.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="font-bold text-slate-900">Built for Aspirants</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Full CBT interface, KaTeX math rendering, sectional breakdown, and rank range
                    indicators.
                  </p>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <Link
                  href="/tests"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
                >
                  Explore GATE 2027 Mocks →
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Follow Us Dark Band */}
        <section className="bg-[#0b1020] text-white py-14 border-t border-slate-800">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <div>
              <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">
                Stay Connected
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide mt-1">
                Follow Dhanak 2027 Updates
              </h2>
            </div>
            <div className="flex justify-center items-center gap-5 sm:gap-8">
              <a
                href="https://www.instagram.com/dhanak.iist/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className={style.button}
              >
                <svg viewBox="0 0 24 24" fill="none" height="24" width="24">
                  <path
                    clipRule="evenodd"
                    d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                    fillRule="evenodd"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="https://x.com/dhanakiist"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className={style.button}
              >
                <svg viewBox="0 0 512 512" fill="white">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@DhanakIIST"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className={style.button}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    clipRule="evenodd"
                    d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
                    fillRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/@iist.dhanak"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className={style.button}
              >
                <svg viewBox="0 0 320 512" fill="currentColor">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H295V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
