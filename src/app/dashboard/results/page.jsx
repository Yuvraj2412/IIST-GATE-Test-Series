"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuthState } from "@/libs/supabase/authClient";

export default function DashboardResults() {
  const router = useRouter();
  const [user, authLoading] = useAuthState();
  const [testAttempts, setTestAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userObjectId, setUserObjectId] = useState(null);

  const getUser = useCallback(
    async (id) => {
      try {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id }),
        });
        const resjson = await res.json();
        if (res.status === 200 && resjson.user) {
          setUserObjectId(resjson.user._id);
        } else if (resjson.msg === "No user found") {
          router.push("/sign-up?oauth=google");
        } else {
          toast.error("Failed to get user details.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (user) {
      getUser(user.uid);
    } else if (!authLoading) {
      router.push("/sign-in");
    }
  }, [user, authLoading, router, getUser]);

  useEffect(() => {
    if (!userObjectId) return;
    const fetchTestAttempts = async () => {
      try {
        const response = await fetch("/api/fetchAllAttempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userObjectId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attempts");
        }

        const data = await response.json();
        setTestAttempts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching test attempts:", err);
        setError("An error occurred while fetching your test attempts.");
      } finally {
        setLoading(false);
      }
    };
    fetchTestAttempts();
  }, [userObjectId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 topSection">
      <Navbar />

      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-rose-200 p-12 text-center">
            <p className="text-rose-600 font-bold">{error}</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block px-6 py-2.5 rounded-full bg-indigo-600 text-white font-bold"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="cosmicHeader px-6 sm:px-8 py-6 text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  IGTS Analytics
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">Your Test Attempts</h1>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition"
              >
                ← Back to Dashboard
              </Link>
            </div>

            <div className="p-6 sm:p-8">
              {testAttempts.length === 0 ? (
                <div className="text-center py-14 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-lg font-extrabold text-slate-800">
                    No test attempts recorded yet.
                  </p>
                  <p className="text-sm text-slate-500 mt-1 mb-5">
                    Attempt a scheduled GATE 2027 mock test to inspect your scores and detailed report.
                  </p>
                  <Link
                    href="/registered-tests"
                    className="inline-block px-6 py-3 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    Go to Your Tests →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {testAttempts.map((attempt) => (
                    <div
                      key={attempt._id}
                      className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src="/images/assignTestIcons.svg"
                          alt="Attempt Icon"
                          className="w-11 h-11 object-contain hidden sm:block flex-shrink-0"
                        />
                        <div className="space-y-1.5">
                          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                            GATE Mock for {attempt.domainId}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                              {attempt.packId}
                            </span>
                            <span className="font-semibold text-slate-800">{attempt.testId}</span>
                            <span
                              className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                                attempt.status === "attempting"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>Started: {new Date(attempt.startTime).toLocaleString()}</span>
                            <span>Ends: {new Date(attempt.endTime).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] transition shadow-sm flex-shrink-0"
                        href={`/dashboard/results/analysis/${attempt._id}?domain=${encodeURIComponent(
                          attempt.domainId
                        )}&pack=${encodeURIComponent(attempt.packId)}&test=${encodeURIComponent(
                          attempt.testId
                        )}`}
                      >
                        View Result &amp; Report →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
