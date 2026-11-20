"use client";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsOfUsePage() {
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
              <span className="text-slate-200 font-medium">Terms of Use</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Terms of Use &amp; Refund Policy
            </h1>
            <p className="text-sm text-slate-300">
              Effective Date: November 2026 · IGTS GATE 2027 (Dhanak 2027, IIST Thiruvananthapuram)
            </p>
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-medium">
              <Link
                href="/privacy-policy"
                className="px-3 py-1 rounded-md bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 transition"
              >
                ← Privacy Policy
              </Link>
              <span className="px-3 py-1 rounded-md bg-white/10 text-white border border-white/20">
                Terms of Use &amp; Refund Policy
              </span>
            </div>
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 mt-10 bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10 text-sm sm:text-base text-slate-700 leading-relaxed space-y-5">
          <p>
            By accessing this portal, creating a candidate account, or purchasing any package on{" "}
            <strong>IGTS — IIST GATE Test Series (Dhanak 2027)</strong>, you agree to be bound by
            these Terms of Use and our{" "}
            <Link href="/privacy-policy" className="text-[#0f4c81] underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            1. Program Organizer &amp; Independence Notice
          </h2>
          <p>
            IGTS is a student-led academic test series organized under Dhanak 2027 by students at
            the <strong>Indian Institute of Space Science and Technology (IIST)</strong>,
            Valiamala, Thiruvananthapuram, Kerala 695547. IGTS is an independent preparatory mock
            test platform and is not affiliated with IITs, IISc, or the official GATE organizing
            committee.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            2. Account Eligibility &amp; Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You must provide accurate personal and academic details (full name, valid email,
              10-digit mobile number, branch, and institution).
            </li>
            <li>
              Each registration is strictly single-user. Account sharing, automated scraping, or
              redistribution of test content or solutions is strictly prohibited.
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            3. Pricing, Digital Access &amp; Razorpay Checkout
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              All test series fees are quoted and settled in Indian Rupees (INR): currently ₹120/-
              for an individual 3-test pack (Pack 1 or Pack 2) and ₹200/- for the 6-test Combo pack
              per engineering stream.
            </li>
            <li>
              Payments are processed securely through <strong>Razorpay</strong> (UPI, credit/debit
              cards, netbanking). Access to scheduled mocks unlocks immediately in{" "}
              <strong>My Mock Tests</strong> once payment verification succeeds.
            </li>
            <li>
              The system prevents purchasing overlapping packs for the same engineering stream.
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            4. Cancellation &amp; Refund Policy
          </h2>
          <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-[#0f4c81] rounded-md p-4 space-y-2 text-sm">
            <p>
              <strong>Digital Mock Series Enrollments:</strong> Because IGTS provides instant digital
              access to scheduled mock examination slots and proprietary academic material, fees
              paid for a confirmed enrollment are <strong>non-refundable</strong> and{" "}
              <strong>non-transferable</strong> between branches or candidates.
            </p>
            <p>
              <strong>Failed Transactions &amp; Duplicate Charges:</strong> If money is debited from
              your bank or UPI account due to a network drop and your registration did not activate,
              first revisit checkout to auto-reconcile, or write to us within{" "}
              <strong>7 calendar days</strong> with your Razorpay Payment ID, Order ID, and
              registered email. Verified duplicate or unfulfilled debits will either unlock your
              selected test pack or be refunded in full via Razorpay to your original payment source
              within <strong>5–7 business days</strong>.
            </p>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            5. Live Examination Conduct &amp; Device Rules
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Each live test opens on its scheduled date during the official window (
              <strong>5:30 PM – 11:30 PM IST</strong>) with an individual{" "}
              <strong>180-minute</strong> exam timer once started.
            </li>
            <li>
              Active Computer-Based Tests require a{" "}
              <strong>desktop, laptop, or tablet browser in full-screen mode</strong>. Mobile phones
              are disabled during live test attempts.
            </li>
            <li>
              Violation of exam integrity rules (copying, tampering, attempting from unauthorized
              accounts) may result in disqualification without refund.
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            6. Intellectual Property &amp; Disclaimer
          </h2>
          <p>
            All mock questions, mathematical typesetting, illustrations, evaluation metrics, and site
            branding are the intellectual property of IGTS / Dhanak 2027, IIST. Expected GATE rank
            bands shown in post-test reports are indicative estimates based on mock difficulty and
            do not guarantee any official GATE rank or admission outcome.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            7. Governing Law &amp; Support Contact
          </h2>
          <p>
            These terms are governed by the laws of India, with exclusive jurisdiction in
            Thiruvananthapuram, Kerala. For billing assistance, refunds, or general inquiries:
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
                Contact Support
              </Link>
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
