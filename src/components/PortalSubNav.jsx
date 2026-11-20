"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PORTAL_TABS = [
  { href: "/dashboard", label: "Account & Profile", exact: true },
  { href: "/registered-tests", label: "My Mock Tests" },
  { href: "/dashboard/results", label: "Results & Reports" },
  { href: "/tests", label: "Browse All Streams" },
];

export default function PortalSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5">
        {PORTAL_TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                active
                  ? "bg-[#0f4c81] text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
