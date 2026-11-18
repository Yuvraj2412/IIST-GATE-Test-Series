import Link from "next/link";
import Image from "next/image";

/**
 * Institutional header mark pairing the IIST circular seal with the Dhanak 2027
 * emblem in a clean side-by-side lockup.
 */
export default function BrandLogo({ variant = "light", size = "md", href = "/" }) {
  const isDark = variant === "dark";
  const imgSize = size === "lg" ? 44 : size === "sm" ? 32 : 38;

  const content = (
    <div className="flex items-center gap-3 select-none">
      <div className="flex items-center gap-2">
        <div
          className={`relative rounded-full overflow-hidden bg-white flex-shrink-0 border ${
            isDark ? "border-white/20" : "border-slate-200"
          }`}
          style={{ width: imgSize, height: imgSize }}
          title="Indian Institute of Space Science and Technology (IIST)"
        >
          <Image
            src="/images/iist-logo.png"
            alt="IIST Official Seal"
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </div>
        <div
          className={`h-6 w-px ${isDark ? "bg-white/20" : "bg-slate-200"}`}
          aria-hidden="true"
        />
        <div
          className={`relative rounded-full overflow-hidden bg-black flex-shrink-0 border ${
            isDark ? "border-amber-400/40" : "border-slate-300"
          }`}
          style={{ width: imgSize, height: imgSize }}
          title="Dhanak 2027"
        >
          <Image
            src="/images/logo.png"
            alt="Dhanak 2027 Emblem"
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-bold tracking-tight text-base sm:text-lg ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            IGTS
          </span>
          <span
            className={`text-xs font-medium ${
              isDark ? "text-amber-300" : "text-[#0f4c81]"
            }`}
          >
            Dhanak 2027
          </span>
        </div>
        <span
          className={`hidden sm:block text-[11px] font-normal mt-1 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          IIST Thiruvananthapuram
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
