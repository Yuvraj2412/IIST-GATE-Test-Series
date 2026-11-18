import Link from "next/link";
import Image from "next/image";

/**
 * Dual official brand emblem pairing the Indian Institute of Space Science and
 * Technology (IIST) seal with the new Dhanak 2027 Phoenix crest.
 */
export default function BrandLogo({ variant = "light", size = "md", href = "/" }) {
  const isDark = variant === "dark";
  const imgSize = size === "lg" ? 48 : size === "sm" ? 34 : 40;

  const content = (
    <div className="flex items-center gap-2.5 sm:gap-3 group select-none">
      {/* Dual Logos Cluster */}
      <div
        className={`flex items-center gap-1.5 rounded-full p-1 transition-all duration-300 ${
          isDark
            ? "bg-white/10 ring-1 ring-white/20 group-hover:ring-amber-400/50"
            : "bg-slate-900/5 ring-1 ring-slate-200 group-hover:ring-indigo-300"
        }`}
      >
        <div
          className="relative rounded-full overflow-hidden bg-white shadow-sm flex-shrink-0 ring-1 ring-sky-400/40"
          style={{ width: imgSize, height: imgSize }}
          title="Indian Institute of Space Science and Technology (IIST)"
        >
          <Image
            src="/images/iist-logo.png"
            alt="IIST Logo"
            fill
            sizes="48px"
            className="object-cover"
            priority
          />
        </div>
        <div
          className="relative rounded-full overflow-hidden bg-black shadow-sm flex-shrink-0 ring-1 ring-amber-400/60"
          style={{ width: imgSize, height: imgSize }}
          title="Dhanak 2027 — IIST Annual Cultural Festival"
        >
          <Image
            src="/images/logo.png"
            alt="Dhanak 2027 Logo"
            fill
            sizes="48px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight text-base sm:text-lg ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            IGTS
          </span>
          <span
            className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isDark
                ? "bg-amber-400/15 text-amber-300 border-amber-400/30"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            Dhanak &apos;27
          </span>
        </div>
        <span
          className={`hidden sm:block text-[11px] font-medium ${
            isDark ? "text-slate-300" : "text-slate-500"
          }`}
        >
          IIST GATE 2027 Mock Series
        </span>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center focus:outline-none">
      {content}
    </Link>
  );
}
