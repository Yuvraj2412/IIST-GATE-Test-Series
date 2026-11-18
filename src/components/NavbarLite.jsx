"use client";
import Link from "next/link";
import BrandLogo from "./BrandLogo";

const NavbarLite = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <BrandLogo variant="light" size="sm" href="/" />
        <Link
          href="/tests"
          className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          Back to Portal
        </Link>
      </div>
    </header>
  );
};

export default NavbarLite;
