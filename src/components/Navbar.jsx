"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/libs/supabase/authClient";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "./BrandLogo";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/tests", label: "Tests" },
  { href: "/about", label: "About" },
  { href: "/contact-us", label: "Contact" },
  { href: "/faqs", label: "FAQs" },
];

export default function Navbar({ animate = false }) {
  const pathname = usePathname();
  const { uid } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(uid));
  }, [uid]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/home" && (pathname === "/" || pathname === "/home")) return true;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const navMotionProps = animate
    ? {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" },
      }
    : {};

  return (
    <motion.header
      {...navMotionProps}
      className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">
        <BrandLogo variant="light" size="md" href="/" />

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/70">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AnimatePresence mode="wait">
            {isLoggedIn ? (
              <motion.div
                key="authed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <button
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                  }}
                  className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Logout
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] shadow-sm shadow-indigo-500/25 transition"
                >
                  <svg
                    className="w-4 h-4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="guest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Link
                  href="/sign-in"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] shadow-sm shadow-indigo-500/25 transition"
                >
                  <span>Register Now</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 sm:hidden">
                {isLoggedIn ? (
                  <button
                    onClick={async () => {
                      await signOut();
                      window.location.href = "/";
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition text-center"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/sign-in"
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
