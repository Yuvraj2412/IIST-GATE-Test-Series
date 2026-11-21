"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PORTAL_TABS = [
  { href: "/dashboard", label: "Account & Profile", exact: true },
  { href: "/registered-tests", label: "My Tests" },
  { href: "/dashboard/results", label: "Results & Analytics" },
  { href: "/tests", label: "Browse Mock Tests" },
];

export default function PortalSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 overflow-x-auto py-3">
        {PORTAL_TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                active
                  ? "bg-[#0f4c81] text-white font-semibold"
                  : "text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
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
