"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import style from "@/components/styles/faqCSS.module.css";
import Link from "next/link";

export default function FAQPage() {
  const [faqsByCategory, setFAQsByCategory] = useState({});
  const [openIndexes, setOpenIndexes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/faqs/getFAQ");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!active) return;

        const grouped = (Array.isArray(data) ? data : []).reduce((acc, faq) => {
          const cat = faq.category || "General";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(faq);
          return acc;
        }, {});
        setFAQsByCategory(grouped);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const toggleFAQ = (faqId) => {
    setOpenIndexes((prev) =>
      prev.includes(faqId) ? prev.filter((id) => id !== faqId) : [...prev, faqId]
    );
  };

  const filteredEntries = Object.entries(faqsByCategory)
    .map(([category, list]) => {
      const q = searchQuery.trim().toLowerCase();
      const filtered = !q
        ? list
        : list.filter(
            (f) =>
              f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
          );
      return [category, filtered];
    })
    .filter(([, list]) => list.length > 0);

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
                <span className="text-slate-200 font-medium">FAQs</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Common questions about IGTS GATE 2027 mock schedules, Razorpay checkout, and exam
                access for Dhanak 2027. Need personal assistance?{" "}
                <Link href="/contact-us" className="text-sky-300 underline hover:text-white">
                  Contact Support
                </Link>
                .
              </p>

              <div className="pt-2 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full px-4 py-2.5 rounded-lg bg-[#111e33] border border-white/20 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
              <p className="text-base font-bold text-slate-800">
                {searchQuery ? "No matching FAQs found." : "No FAQs published yet."}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Still have a question?{" "}
                <Link href="/contact-us" className="text-[#0f4c81] font-semibold hover:underline">
                  Reach out to our team
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredEntries.map(([category, faqs]) => (
                <div key={category} className="space-y-3">
                  <h2 className="text-lg font-bold text-slate-900 border-l-4 border-[#0f4c81] pl-3">
                    {category}
                  </h2>

                  <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden shadow-sm">
                    {faqs.map((faq, index) => {
                      const faqId = `${category}-${index}`;
                      const isOpen = openIndexes.includes(faqId);
                      return (
                        <div key={faq._id || faqId}>
                          <button
                            type="button"
                            onClick={() => toggleFAQ(faqId)}
                            className="w-full px-5 py-4 flex justify-between items-center text-left font-semibold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition focus:outline-none"
                          >
                            <span>{faq.question}</span>
                            <span
                              className={`ml-4 flex-shrink-0 text-slate-500 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : "rotate-0"
                              }`}
                            >
                              ▾
                            </span>
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
