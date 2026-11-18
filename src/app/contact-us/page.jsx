"use client";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer";
import style from "@/components/styles/contactusCSS.module.css";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSending(true);
    const toastId = toast.loading("Sending message...");
    try {
      const response = await fetch("/api/sendUserQuery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      toast.dismiss(toastId);

      if (!response.ok) {
        toast.error(result.error || "Failed to send message. Please try again.");
        return;
      }

      toast.success("Message sent! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        <section className={`${style.topSection} text-white`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs sm:text-sm flex items-center gap-2 text-slate-400">
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-slate-200 font-medium">Contact Us</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Contact IGTS Support
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Questions regarding GATE 2027 test schedules, enrollments, payment receipts, or portal
                access for Dhanak 2027? Write to our student coordination team at IIST.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10">
            <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center p-4 border-r border-slate-100">
              <Image
                src="/images/contact.png"
                alt="Contact IGTS Support"
                width={420}
                height={340}
                className="w-full max-w-sm h-auto object-contain"
                priority
              />
              <div className="mt-5 text-center text-sm text-slate-500">
                <p className="font-semibold text-slate-800">Dhanak 2027 · IIST Valiamala</p>
                <p>Thiruvananthapuram, Kerala 695547</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Send a Message</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Provide your contact information and query below.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-[#0f4c81] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-[#0f4c81] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your question or issue..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-[#0f4c81] transition"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 px-6 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition disabled:opacity-60"
              >
                {sending ? "Sending..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
