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
              Effective Date: November 2026 · IGTS GATE 2027 (Dhanak 2027, IIST)
            </p>
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 mt-10 bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10 text-sm sm:text-base text-slate-700 leading-relaxed space-y-5">
          <p>
            Welcome to <strong>IGTS GATE 2027 Mock Test Series (Dhanak 2027, IIST)</strong>. Your
            privacy is of utmost importance to us. This Privacy Policy explains how we collect,
            use, store, and protect your personal information when you use our platform.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account Authentication:</strong> Email and password or Google OAuth profile
              information powered by Supabase Auth.
            </li>
            <li>
              <strong>Candidate Profile:</strong> Your name, email address, phone number, college
              name, and B.Tech branch.
            </li>
            <li>
              <strong>Payment Information:</strong> Payments are securely processed via Razorpay. We
              store transaction identifiers, order references, and payment status for registration
              records. Card or UPI credentials are never stored on our servers.
            </li>
            <li>
              <strong>Test Portal Analytics:</strong> Responses, completion timestamps, and accuracy
              metrics used to generate your GATE 2027 performance reports.
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To create and manage your candidate account.</li>
            <li>To enroll you in GATE 2027 mock packs and enable portal access.</li>
            <li>To process payments securely and send registration receipts.</li>
            <li>To evaluate test attempts and generate rank &amp; accuracy analytics.</li>
          </ul>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            3. Data Protection &amp; Sharing
          </h2>
          <p>
            We never sell or rent your personal data. All data is stored behind Row-Level Security
            and encrypted server-side credentials, shared strictly with Razorpay for transaction
            processing or when required by law.
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
            4. Your Rights &amp; Contact
          </h2>
          <p>
            You may inspect and update your profile details anytime from your Dashboard, or contact
            us to request account/data assistance:
          </p>
          <p className="font-semibold text-slate-900">
            Email: dhanak2k25@gmail.com ·{" "}
            <Link href="/contact-us" className="text-[#0f4c81] underline">
              Contact Form
            </Link>
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
