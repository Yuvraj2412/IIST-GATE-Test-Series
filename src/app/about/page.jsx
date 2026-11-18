"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar.jsx";
import Link from "next/link";
import Image from "next/image";
import style from "@/components/styles/aboutUsCSS.module.css";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 w-full">
        <section className={`${style.topSection} text-white`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs sm:text-sm flex items-center gap-2 text-slate-400">
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-slate-200 font-medium">About Dhanak 2027</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                About IGTS &amp; Dhanak 2027
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Dhanak is the annual cultural festival of the{" "}
                <strong className="text-white">
                  Indian Institute of Space Science and Technology (IIST)
                </strong>
                , Thiruvananthapuram—an autonomous institute under the Department of Space, Government
                of India.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10">
            <div className="lg:col-span-5 bg-[#0b1526] rounded-xl border border-slate-800 p-7 text-center space-y-5">
              <div className="flex items-center justify-center gap-5">
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
                    src="/images/dhanak-logo.png"
                    alt="Dhanak 2027 Emblem"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs font-mono uppercase tracking-wider text-amber-300">
                  Official Identity · 2027
                </p>
                <h2 className="text-lg font-bold text-white mt-1">
                  IIST Thiruvananthapuram × Dhanak 2027
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Department of Space · Government of India
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0f4c81]">
                Institutional Heritage
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Academic Rigor Paired with Campus Spirit
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Named after the Hindi word for rainbow, <strong className="text-slate-900">Dhanak</strong>{" "}
                brings together culture, scientific talent, and student leadership at IIST&apos;s
                Valiamala campus. Through the{" "}
                <strong className="text-slate-900">IIST GATE Test Series (IGTS)</strong>, students and
                rankers extend IIST&apos;s academic environment to engineering aspirants across India.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                For GATE 2027, IGTS offers affordable mock packages in Aerospace, Electronics &amp;
                Communication, and Mechanical Engineering with an authentic computer-based exam
                interface, KaTeX typesetting, and detailed post-test scoring reports.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                  <p className="font-bold text-sm text-slate-900">Campus Location</p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    IIST Valiamala Campus, Thiruvananthapuram, Kerala 695547.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                  <p className="font-bold text-sm text-slate-900">Candidate Platform</p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Supervised CBT window, automatic answer syncing, and sectional rank estimates.
                  </p>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <Link
                  href="/tests"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition"
                >
                  Browse GATE 2027 Mocks
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0b1526] text-white py-12 border-t border-slate-800">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Official Channels
              </p>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Connect with Dhanak 2027
              </h2>
            </div>
            <div className="flex justify-center items-center gap-4">
              <a
                href="https://www.instagram.com/dhanak.iist/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className={style.button}
              >
                <svg viewBox="0 0 24 24" fill="none">
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
                <svg viewBox="0 0 512 512" fill="currentColor">
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
