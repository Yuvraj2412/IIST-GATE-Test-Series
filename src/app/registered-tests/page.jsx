"use client";
import NavbarTestPage from "@/components/NavbarTestPage.jsx";
import Footer from "@/components/Footer";
import { useAuthState } from "@/libs/supabase/authClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import tests from "@/data/tests";

export default function RegisteredTests() {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const [user, authLoading] = useAuthState();

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
          setUserDetails(resjson.user);
        } else if (resjson.msg === "No user found") {
          router.push("/sign-up?oauth=google");
        } else {
          toast.error("Failed to get user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
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

  const renderTestDetails = () => {
    if (!userDetails.registeredTests || userDetails.registeredTests.length === 0) {
      return (
        <div className="text-center py-14 bg-slate-50 rounded-2xl border border-slate-200 mt-4">
          <p className="text-lg font-extrabold text-slate-800">
            No registered test packs found yet
          </p>
          <p className="text-sm text-slate-500 mt-1 mb-5">
            Enroll in any GATE 2027 stream package to unlock your mock test schedule.
          </p>
          <Link
            href="/tests"
            className="inline-block px-6 py-3 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Explore Mock Tests →
          </Link>
        </div>
      );
    }

    return userDetails.registeredTests.map((registeredTest) => {
      const [title, pack] = (registeredTest.test || "").split(", ");
      const testData = tests.find((test) => test.title === title);
      if (!testData) return null;

      const packKey = (pack || "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

      const schedule = testData.testSchedule[packKey];

      if (!schedule) {
        return (
          <div
            key={registeredTest._id}
            className="bg-slate-50 rounded-2xl border border-slate-200 p-5 mt-4"
          >
            <h2 className="text-lg font-bold text-slate-900">GATE Mock for {title}</h2>
            <p className="text-sm text-rose-600 mt-1">No schedule found for pack {pack}.</p>
          </div>
        );
      }

      return (
        <div key={registeredTest._id} className="pt-6 border-b border-slate-200 pb-8 last:border-none">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">GATE Mock for {title}</h2>
              <span className="inline-block mt-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                {pack}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(schedule).map(([testKey, date]) => (
              <div
                key={testKey}
                className="bg-slate-50 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src="/images/assignTestIcons.svg"
                    alt="Test Icon"
                    className="w-11 h-11 object-contain hidden sm:block flex-shrink-0"
                  />
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {title} —{" "}
                      {testKey
                        .replace(/(\d+)/, " $1")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">{date}</span>
                      <span className="flex items-center gap-1.5">
                        <img src="/images/clockIcon.svg" alt="" className="w-4 h-4" />
                        180 MIN
                      </span>
                      <span>5:30 PM – 11:30 PM IST</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        Online CBT
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] transition shadow-sm flex-shrink-0"
                  href={`/registered-tests/attempt/${registeredTest._id}?domain=${encodeURIComponent(
                    title
                  )}&pack=${encodeURIComponent(pack)}&test=${encodeURIComponent(testKey)}`}
                >
                  Open Test Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 topSection">
      <NavbarTestPage />

      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {userDetails ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="cosmicHeader px-6 sm:px-8 py-6 text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  IGTS · GATE 2027 Schedule
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">Your Mock Tests</h1>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <div className="p-6 sm:p-8">{renderTestDetails()}</div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 flex justify-center">
            <Loader />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
