"use client";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer";
import style from "@/components/styles/contactusCSS.module.css";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion } from "framer-motion";
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        <section className={`${style.topSection} relative overflow-hidden w-full text-white`}>
          <div className="cosmicGrid absolute inset-0 opacity-50 pointer-events-none" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col gap-5 max-w-3xl">
              <div className="text-xs sm:text-sm flex items-center gap-2 text-slate-300">
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-amber-300 font-semibold">Contact Us</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Contact <span className="text-amber-300">IGTS Support</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                Have questions about GATE 2027 mock schedules, registrations, payments, or technical
                support for Dhanak 2027? Send us a message and our team at IIST will respond shortly.
              </p>
            </div>
          </div>
        </section>

        <motion.section
          className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
            <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center p-4">
              <Image
                src="/images/contact.png"
                alt="Contact IGTS Support"
                width={460}
                height={360}
                className="w-full h-auto object-contain rounded-2xl"
                priority
              />
              <div className="mt-4 text-center text-sm text-slate-500">
                <p className="font-semibold text-slate-700">Dhanak 2027 · IIST Valiamala</p>
                <p>Thiruvananthapuram, Kerala 695547</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Send Us a Message</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Fill out the details below and our student coordinators will reach out.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="name">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="email">
                  Your Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] shadow-md shadow-indigo-500/20 transition disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
