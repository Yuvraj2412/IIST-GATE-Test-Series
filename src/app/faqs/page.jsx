"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import style from "@/components/styles/faqCSS.module.css";
import { motion } from "framer-motion";
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
                <span className="text-amber-300 font-semibold">FAQs</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Frequently Asked <span className="text-amber-300">Questions</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                Answers to common questions about IGTS GATE 2027 mock series, payments, and test
                access for Dhanak 2027. Need more help?{" "}
                <Link href="/contact-us" className="text-amber-300 underline hover:text-amber-200">
                  Contact us
                </Link>
                .
              </p>

              <div className="pt-2 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full px-4 py-2.5 rounded-full bg-white/15 border border-white/25 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
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
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
              <p className="text-lg font-bold text-slate-800">
                {searchQuery ? "No matching FAQs found." : "No FAQs published yet."}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Still have a question?{" "}
                <Link href="/contact-us" className="text-indigo-600 font-semibold hover:underline">
                  Reach out to our team
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredEntries.map(([category, faqs]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    {category} FAQs
                  </h2>

                  {faqs.map((faq, index) => {
                    const faqId = `${category}-${index}`;
                    const isOpen = openIndexes.includes(faqId);
                    return (
                      <div
                        key={faq._id || faqId}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition hover:border-indigo-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFAQ(faqId)}
                          className="w-full px-5 py-4 flex justify-between items-center text-left font-bold text-slate-800 text-sm sm:text-base focus:outline-none"
                        >
                          <span>{faq.question}</span>
                          <span
                            className={`ml-3 flex-shrink-0 transition-transform duration-200 text-indigo-600 ${
                              isOpen ? "rotate-180" : "rotate-0"
                            }`}
                          >
                            ▾
                          </span>
                        </button>

                        <motion.div
                          initial={false}
                          animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
