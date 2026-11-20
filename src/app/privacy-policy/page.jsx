"use client";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        <section className="cosmicHeader text-white py-12 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
            <div className="text-xs sm:text-sm flex items-center gap-2 text-slate-400">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-slate-200 font-medium">Privacy Policy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-slate-300">
              Effective Date: November 2026 · IGTS GATE 2027 (Dhanak 2027, IIST Thiruvananthapuram)
            </p>
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-medium">
              <span className="px-3 py-1 rounded-md bg-white/10 text-white border border-white/20">
                Privacy Policy
              </span>
              <Link
                href="/terms-of-use"
                className="px-3 py-1 rounded-md bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 transition"
              >
                Terms of Use &amp; Refund Policy →
              </Link>
            </div>
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 mt-10 bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10 text-sm sm:text-base text-slate-700 leading-relaxed space-y-5">
          <p>
            This Privacy Policy describes how{" "}
            <strong>IGTS — IIST GATE Test Series (Dhanak 2027)</strong>, organized by the student
            body of the{" "}
            <strong>
              Indian Institute of Space Science and Technology (IIST), Valiamala, Thiruvananthapuram
            </strong>
            , collects, processes, stores, and protects candidate information across this portal.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account Authentication:</strong> Email credentials, OTP verification state,
              or basic Google OAuth profile details (name, verified email) managed securely via
              Supabase Auth.
            </li>
            <li>
              <strong>Candidate Profile:</strong> Full name, email address, 10-digit Indian mobile
              number, engineering branch, and institution/college name.
            </li>
            <li>
              <strong>Payment &amp; Order Records:</strong> Order amounts, timestamps, receipts,
              Razorpay Order IDs, Razorpay Payment IDs, and signature verification status used to
              confirm enrollment. Card numbers, CVV, bank logins, and UPI PINs are entered
              exclusively inside Razorpay&apos;s hosted checkout and are never received or stored by
              IGTS servers.
            </li>
            <li>
              <strong>Examination Activity &amp; Analytics:</strong> Selected answers, numerical
              inputs, attempt start/end timestamps, evaluation status, sectional accuracy, and
              projected GATE rank metrics.
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To authenticate your candidate account and prevent duplicate registrations.</li>
            <li>To process pack purchases and unlock scheduled GATE 2027 mock exams.</li>
            <li>To reconcile pending transactions accurately with Razorpay and issue receipts.</li>
            <li>To score submitted responses, generate analytical reports, and respond to support requests.</li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            3. Third-Party Processors &amp; Essential Cookies
          </h2>
          <p>
            We use strictly necessary HTTP-only session cookies solely to maintain authenticated
            user sessions. Data is shared strictly with our infrastructure providers as needed to
            run the service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Supabase:</strong> Authentication and encrypted Postgres database hosting.
            </li>
            <li>
              <strong>Razorpay:</strong> PCI-DSS compliant Indian payment gateway for UPI, card, and
              netbanking transactions.
            </li>
            <li>
              <strong>Transactional Email (SMTP):</strong> Sending signup OTPs, enrollment receipts,
              and responses to your support queries.
            </li>
          </ul>
          <p>
            We never sell, rent, or trade candidate data to marketers or third-party advertisers.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            4. Data Security &amp; Retention
          </h2>
          <p>
            All database tables enforce Row-Level Security (RLS) denying direct public reads/writes;
            API routes validate authenticated sessions server-side before accessing candidate
            records. Registration, payment, and attempt history are retained through the Dhanak
            2027 examination cycle for audit, analytics, and payment reconciliation.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            5. Your Rights &amp; Grievance Contact
          </h2>
          <p>
            You may inspect and update your profile details anytime from your{" "}
            <Link href="/dashboard" className="text-[#0f4c81] underline font-medium">
              Candidate Dashboard
            </Link>
            . To report a privacy concern or request correction/deletion of your account records,
            contact the IGTS Dhanak 2027 coordination team:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">
              IGTS Student Coordination Team · Dhanak 2027
            </p>
            <p>
              Indian Institute of Space Science and Technology (IIST), Valiamala P.O.,
              Thiruvananthapuram, Kerala 695547
            </p>
            <p>
              Email:{" "}
              <a href="mailto:dhanak2k25@gmail.com" className="text-[#0f4c81] underline font-medium">
                dhanak2k25@gmail.com
              </a>{" "}
              ·{" "}
              <Link href="/contact-us" className="text-[#0f4c81] underline font-medium">
                Online Support Form
              </Link>
            </p>
          </div>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            Please also review our{" "}
            <Link href="/terms-of-use" className="text-[#0f4c81] underline font-medium">
              Terms of Use &amp; Refund Policy
            </Link>
            .
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
