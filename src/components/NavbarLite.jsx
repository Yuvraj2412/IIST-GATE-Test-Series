"use client";
import Link from "next/link";
import BrandLogo from "./BrandLogo";

const NavbarLite = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <BrandLogo variant="light" size="sm" href="/" />
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600">
          <Link href="/home" className="hover:text-slate-900 transition">
            Home
          </Link>
          <Link href="/tests" className="hover:text-slate-900 transition">
            Mock Tests
          </Link>
          <Link href="/faqs" className="hidden sm:inline hover:text-slate-900 transition">
            FAQs
          </Link>
          <Link href="/contact-us" className="hidden sm:inline hover:text-slate-900 transition">
            Support
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavbarLite;
