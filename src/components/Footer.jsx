import Link from "next/link";
import React from "react";
import BrandLogo from "./BrandLogo";
import tests from "@/data/tests";

const Footer = () => {
  return (
    <footer className="bg-[#0b1526] text-slate-300 border-t border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          <div className="md:col-span-4 space-y-4">
            <BrandLogo variant="dark" size="md" href="/" />
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Official GATE 2027 Mock Test Series organised under{" "}
              <span className="text-slate-200 font-medium">Dhanak 2027</span> by students of the
              Indian Institute of Space Science and Technology (IIST), Valiamala, Thiruvananthapuram.
            </p>
            <p className="text-xs text-slate-500">
              An Institution under Department of Space, Government of India.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              GATE 2027 Streams
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tests" className="text-slate-400 hover:text-white transition">
                  All Mock Packages &amp; Schedule
                </Link>
              </li>
              {tests.map((t) => (
                <li key={t.id}>
                  <Link href={`/tests/${t.id}`} className="text-slate-400 hover:text-white transition">
                    {t.shortName} ({t.code})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Support &amp; Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition">
                  About Dhanak 2027
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-slate-400 hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-slate-400 hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="text-slate-400 hover:text-white transition">
                  Terms of Use &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-slate-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Dhanak Channels
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/dhanak.iist/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/dhanakiist"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition"
                >
                  X / Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@DhanakIIST"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/dhanak-iist-b2ba83bb/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>Copyright © 2027 Dhanak, Indian Institute of Space Science and Technology (IIST)</p>
          <div className="flex items-center gap-4">
            <Link href="/terms-of-use" className="hover:text-slate-300">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
