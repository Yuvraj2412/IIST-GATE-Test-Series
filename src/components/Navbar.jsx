"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/libs/supabase/authClient";
import { useSelector } from "react-redux";
import BrandLogo from "./BrandLogo";

const PUBLIC_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/tests", label: "Mock Tests" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact-us", label: "Contact" },
];

export default function Navbar() {
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-6">
        <BrandLogo variant="light" size="md" href="/" />

        {/* Flat, Direct Top-Level Links (Zero Hidden Dropdowns) */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8 h-full">
          {PUBLIC_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative h-full inline-flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "text-[#0f4c81] font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4c81]" />
                )}
              </Link>
            );
          })}

          {isLoggedIn && (
            <>
              <span className="h-4 w-px bg-slate-200" aria-hidden="true" />
              <Link
                href="/registered-tests"
                className={`relative h-full inline-flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive("/registered-tests")
                    ? "text-[#0f4c81] font-semibold"
                    : "text-slate-700 hover:text-[#0f4c81]"
                }`}
              >
                My Tests
                {isActive("/registered-tests") && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4c81]" />
                )}
              </Link>
              <Link
                href="/dashboard/results"
                className={`relative h-full inline-flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname?.startsWith("/dashboard/results")
                    ? "text-[#0f4c81] font-semibold"
                    : "text-slate-700 hover:text-[#0f4c81]"
                }`}
              >
                Results
                {pathname?.startsWith("/dashboard/results") && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4c81]" />
                )}
              </Link>
            </>
          )}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  window.location.href = "/";
                }}
                className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
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
            <div className="flex items-center gap-2.5">
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap"
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

      {/* Spacious Flat Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-1.5">
            {PUBLIC_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium transition ${
                    active
                      ? "bg-slate-100 text-[#0f4c81] font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isLoggedIn && (
              <div className="pt-2 mt-2 border-t border-slate-100 space-y-1.5">
                <Link
                  href="/registered-tests"
                  className="block px-4 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Tests
                </Link>
                <Link
                  href="/dashboard/results"
                  className="block px-4 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Results
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 sm:hidden">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                  }}
                  className="w-full px-4 py-2.5 rounded-lg text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition text-center"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  className="block w-full px-4 py-2.5 rounded-lg text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-center"
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
