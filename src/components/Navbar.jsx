"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/libs/supabase/authClient";
import { useSelector } from "react-redux";
import BrandLogo from "./BrandLogo";
import tests from "@/data/tests";

export default function Navbar() {
  const pathname = usePathname();
  const { uid } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(Boolean(uid));
  }, [uid]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const isActive = (href) => {
    if (href === "/home" && (pathname === "/" || pathname === "/home")) return true;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-4">
        <BrandLogo variant="light" size="md" href="/" />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 h-full">
          <Link
            href="/home"
            className={`relative h-full inline-flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
              isActive("/home") ? "text-[#0f4c81] font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home
            {isActive("/home") && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4c81]" />}
          </Link>

          {/* Test Series Quick Dropdown */}
          <div className="relative h-full flex items-center">
            <button
              type="button"
              onClick={() => toggleDropdown("tests")}
              className={`relative h-full inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive("/tests") ? "text-[#0f4c81] font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Test Series</span>
              <span className={`text-xs transition-transform ${openDropdown === "tests" ? "rotate-180" : ""}`}>
                ▾
              </span>
              {isActive("/tests") && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4c81]" />}
            </button>

            {openDropdown === "tests" && (
              <div className="absolute top-[calc(100%-2px)] left-0 w-72 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50">
                <Link
                  href="/tests"
                  className="block px-4 py-2.5 text-sm font-semibold text-[#0f4c81] hover:bg-slate-50 border-b border-slate-100"
                >
                  All GATE 2027 Test Series →
                </Link>
                {tests.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tests/${t.id}`}
                    className="block px-4 py-2.5 hover:bg-slate-50 transition"
                  >
                    <span className="block text-sm font-medium text-slate-900">{t.shortName}</span>
                    <span className="block text-xs text-slate-500">
                      {t.code} · 6 Mocks · Pack ₹120 / Combo ₹200
                    </span>
                  </Link>
                ))}
                <Link
                  href="/tests#schedule"
                  className="block px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-t border-slate-100 mt-1"
                >
                  View Master Exam Calendar
                </Link>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <>
              <Link
                href="/registered-tests"
                className={`relative h-full inline-flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive("/registered-tests")
                    ? "text-[#0f4c81] font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                My Mock Tests
                {isActive("/registered-tests") && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4c81]" />
                )}
              </Link>
              <Link
                href="/dashboard/results"
                className={`relative h-full inline-flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname?.startsWith("/dashboard/results")
                    ? "text-[#0f4c81] font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Results
                {pathname?.startsWith("/dashboard/results") && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4c81]" />
                )}
              </Link>
            </>
          ) : (
            <Link
              href="/tests#schedule"
              className="relative h-full inline-flex items-center text-sm font-medium whitespace-nowrap text-slate-600 hover:text-slate-900 transition-colors"
            >
              Schedule
            </Link>
          )}

          {/* Resources / Help Dropdown */}
          <div className="relative h-full flex items-center">
            <button
              type="button"
              onClick={() => toggleDropdown("resources")}
              className={`relative h-full inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive("/faqs") ||
                isActive("/about") ||
                isActive("/contact-us") ||
                isActive("/privacy-policy") ||
                isActive("/terms-of-use")
                  ? "text-[#0f4c81] font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Help &amp; Info</span>
              <span className={`text-xs transition-transform ${openDropdown === "resources" ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>

            {openDropdown === "resources" && (
              <div className="absolute top-[calc(100%-2px)] right-0 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50">
                <Link href="/faqs" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  FAQs
                </Link>
                <Link href="/about" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  About IIST &amp; Dhanak 2027
                </Link>
                <Link href="/contact-us" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Contact Support
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <Link href="/terms-of-use" className="block px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">
                  Terms of Use &amp; Refunds
                </Link>
                <Link href="/privacy-policy" className="block px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">
                  Privacy Policy
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-2.5">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  window.location.href = "/";
                }}
                className="hidden sm:inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                Logout
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition whitespace-nowrap"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition whitespace-nowrap"
              >
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
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

      {/* Organized Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Test Series
              </p>
              <Link
                href="/home"
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive("/home") ? "bg-slate-100 text-[#0f4c81] font-semibold" : "text-slate-700"
                }`}
              >
                Home
              </Link>
              <Link
                href="/tests"
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === "/tests" ? "bg-slate-100 text-[#0f4c81] font-semibold" : "text-slate-700"
                }`}
              >
                All Mock Tests &amp; Schedule
              </Link>
              {tests.map((t) => (
                <Link
                  key={t.id}
                  href={`/tests/${t.id}`}
                  className="block pl-6 pr-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  {t.shortName} ({t.code})
                </Link>
              ))}
            </div>

            {isLoggedIn && (
              <div className="space-y-1 pt-3 border-t border-slate-100">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Student Portal
                </p>
                <Link
                  href="/registered-tests"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Mock Tests
                </Link>
                <Link
                  href="/dashboard/results"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Results &amp; Analytics
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Account &amp; Profile
                </Link>
              </div>
            )}

            <div className="space-y-1 pt-3 border-t border-slate-100">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Support &amp; Legal
              </p>
              <Link href="/faqs" className="block px-3 py-2 rounded-lg text-sm text-slate-700">
                FAQs
              </Link>
              <Link href="/about" className="block px-3 py-2 rounded-lg text-sm text-slate-700">
                About Dhanak 2027
              </Link>
              <Link href="/contact-us" className="block px-3 py-2 rounded-lg text-sm text-slate-700">
                Contact Us
              </Link>
              <Link href="/terms-of-use" className="block px-3 py-2 rounded-lg text-sm text-slate-600">
                Terms of Use &amp; Refunds
              </Link>
              <Link href="/privacy-policy" className="block px-3 py-2 rounded-lg text-sm text-slate-600">
                Privacy Policy
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 sm:hidden">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition text-center"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  className="block w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
