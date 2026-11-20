"use client";
import Navbar from "@/components/Navbar";
import PortalSubNav from "@/components/PortalSubNav";
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
    <div className="min-h-screen flex flex-col bg-[#f8fafc] topSection">
      <Navbar />
      <PortalSubNav />

      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-rose-200 p-12 text-center">
            <p className="text-rose-600 font-semibold">{error}</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-[#0f4c81] text-white text-sm font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="cosmicHeader px-6 sm:px-8 py-5 text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  IGTS Analytics
                </p>
                <h1 className="text-xl sm:text-2xl font-bold mt-0.5">Your Test Attempts</h1>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition"
              >
                ← Back to Dashboard
              </Link>
            </div>

            <div className="p-6 sm:p-8">
              {testAttempts.length === 0 ? (
                <div className="text-center py-14 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-base font-bold text-slate-800">
                    No test attempts recorded yet.
                  </p>
                  <p className="text-sm text-slate-500 mt-1 mb-5">
                    Attempt a scheduled GATE 2027 mock test to inspect your scores and detailed report.
                  </p>
                  <Link
                    href="/registered-tests"
                    className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition"
                  >
                    Go to Your Tests
                  </Link>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {testAttempts.map((attempt) => (
                    <div
                      key={attempt._id}
                      className="bg-white hover:bg-slate-50/60 rounded-xl p-5 border border-slate-200 hover:border-slate-400 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src="/images/assignTestIcons.svg"
                          alt="Attempt Icon"
                          className="w-10 h-10 object-contain hidden sm:block flex-shrink-0"
                        />
                        <div className="space-y-1.5">
                          <h2 className="text-base sm:text-lg font-bold text-slate-900">
                            GATE Mock for {attempt.domainId}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <span className="font-semibold text-[#0f4c81] bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                              {attempt.packId}
                            </span>
                            <span className="font-medium text-slate-800">{attempt.testId}</span>
                            <span
                              className={`font-semibold px-2 py-0.5 rounded-md text-xs border ${
                                attempt.status === "attempting"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 tabular-nums">
                            <span>Started: {new Date(attempt.startTime).toLocaleString()}</span>
                            <span>Ends: {new Date(attempt.endTime).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition flex-shrink-0"
                        href={`/dashboard/results/analysis/${attempt._id}?domain=${encodeURIComponent(
                          attempt.domainId
                        )}&pack=${encodeURIComponent(attempt.packId)}&test=${encodeURIComponent(
                          attempt.testId
                        )}`}
                      >
                        View Result &amp; Report
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
