import Link from "next/link";
import React from "react";
import BrandLogo from "./BrandLogo";

const Footer = () => {
  return (
    <footer className="bg-[#070b18] text-slate-300 border-t border-slate-800/80">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo variant="dark" size="md" href="/" />
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              Official GATE 2027 Mock Test Series organised as part of{" "}
              <span className="text-amber-300 font-semibold">Dhanak 2027</span> by students of the
              Indian Institute of Space Science and Technology (IIST), Valiamala, Thiruvananthapuram.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-300 bg-sky-500/10 border border-sky-400/20 px-3 py-1.5 rounded-full">
              <span>Department of Space, Govt. of India · IIST Campus</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tests" className="text-slate-400 hover:text-white transition">
                  GATE 2027 Mock Tests
                </Link>
              </li>
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
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-slate-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Support Column */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Connect with Dhanak</h3>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://www.instagram.com/dhanak.iist/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
              >
                <span>Instagram</span>
              </a>
              <a
                href="https://x.com/dhanakiist"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
              >
                <span>X / Twitter</span>
              </a>
              <a
                href="https://www.youtube.com/@DhanakIIST"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
              >
                <span>YouTube</span>
              </a>
              <a
                href="https://www.linkedin.com/in/dhanak-iist-b2ba83bb/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
              >
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.facebook.com/@iist.dhanak"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
              >
                <span>Facebook</span>
              </a>
            </div>
            <p className="text-xs text-slate-400">
              Official Support:{" "}
              <Link href="/contact-us" className="text-amber-300 hover:underline">
                Reach IGTS Team
              </Link>
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>Copyright © 2027 Dhanak · Indian Institute of Space Science and Technology (IIST)</p>
          <p>IGTS GATE 2027 Portal</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
