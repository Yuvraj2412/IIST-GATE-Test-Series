"use client";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer";
import { useAuthState, signOut } from "@/libs/supabase/authClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import { motion } from "framer-motion";

const STANDARD_BRANCHES = ["ECE", "Aerospace", "Mechanical", "Physics"];

const getBranchName = (branch) => {
  switch (branch) {
    case "ECE":
      return "Electronics and Communication Engineering - ECE";
    case "Aerospace":
      return "Aerospace Engineering";
    case "Mechanical":
      return "Mechanical Engineering";
    default:
      return branch || "Not Specified";
  }
};

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const [user, authLoading] = useAuthState();
  const [userRole, setUserRole] = useState(null);
  const [currOption, setCurrOption] = useState("account");

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [otherBranch, setOtherBranch] = useState("");
  const [uid, setUid] = useState("");
  const [category, setCategory] = useState("General");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [registeredTests, setRegisteredTests] = useState([]);

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
          const u = resjson.user;
          setUserDetails(u);
          setUserRole(u.role);
          setUid(u.userId);
          setName(u.name || "");
          setCollegeName(u.college || "");
          setMobileNumber(u.mobile ? String(u.mobile) : "");
          if (u.branch && !STANDARD_BRANCHES.includes(u.branch)) {
            setSelectedBranch("other");
            setOtherBranch(u.branch);
          } else {
            setSelectedBranch(u.branch || "");
            setOtherBranch("");
          }
          setRegisteredTests(u.registeredTests || []);
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

  const addFAQ = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    const loadingToastId = toast.loading("Creating FAQ...");
    try {
      const response = await fetch("/api/faqs/createFAQ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          category,
          createdByEmail: userDetails.email,
        }),
      });

      if (response.ok) {
        toast.success("FAQ created successfully!", { id: loadingToastId });
        setAnswer("");
        setQuestion("");
        setCategory("General");
      } else {
        toast.error("Failed to create FAQ", { id: loadingToastId });
      }
    } catch (error) {
      toast.error("Error creating FAQ: " + error.message, { id: loadingToastId });
    }
  };

  const updateuserInfo = async () => {
    const finalBranch = selectedBranch === "other" ? otherBranch.trim() : selectedBranch.trim();
    if (!name.trim() || !collegeName.trim() || !finalBranch || !/^\d{10}$/.test(mobileNumber.trim())) {
      toast.error("Please enter valid name, 10-digit mobile, branch, and college.");
      return;
    }

    const k = toast.loading("Updating info...");
    try {
      const res = await fetch("/api/updateUserInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          name: name.trim(),
          mobile: mobileNumber.trim(),
          branch: finalBranch,
          college: collegeName.trim(),
        }),
      });
      const resjson = await res.json();
      toast.dismiss(k);
      if (res.status === 200) {
        toast.success("Profile updated.");
        await getUser(user.uid);
        setCurrOption("account");
      } else {
        toast.error(resjson.msg || "Could not update, please try again.");
      }
    } catch {
      toast.dismiss(k);
      toast.error("Failed to update details.");
    }
  };

  const isAdmin = userRole === "testAdmin" || userRole === "admin";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 topSection">
      <Navbar />

      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="cosmicHeader px-5 py-4 text-white">
                <p className="text-[11px] uppercase tracking-widest text-amber-300 font-bold">
                  IGTS · Dhanak &apos;27
                </p>
                <h2 className="text-xl font-extrabold mt-0.5">Candidate Portal</h2>
              </div>

              <div className="p-4 space-y-2">
                <Link
                  href="/registered-tests"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] shadow-sm transition"
                >
                  Your Live Tests →
                </Link>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 pt-2">
                  {[
                    { id: "account", label: "Profile" },
                    { id: "registrations", label: "Registrations" },
                    { id: "settings", label: "Update Profile" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrOption(item.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                        currOption === item.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  <Link
                    href="/dashboard/results"
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition block"
                  >
                    Results &amp; Reports
                  </Link>

                  {isAdmin && (
                    <>
                      <div className="col-span-2 lg:col-span-1 pt-2 mt-1 border-t border-slate-100">
                        <p className="px-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Admin Controls
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrOption("addFaq")}
                        className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                          currOption === "addFaq"
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        Add FAQs
                      </button>
                      <Link
                        href="/addQuestion"
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition block"
                      >
                        Add Questions
                      </Link>
                      <Link
                        href="/previewQuestion"
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition block"
                      >
                        Preview Questions
                      </Link>
                      <Link
                        href="/editQuestion"
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition block"
                      >
                        Edit Questions
                      </Link>
                      <Link
                        href="/deleteQuestion"
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition block"
                      >
                        Delete Questions
                      </Link>
                    </>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut();
                      window.location.href = "/sign-in";
                    }}
                    className="w-full px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 text-left transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Panel */}
          <section className="lg:col-span-9">
            {!userDetails ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-16 flex justify-center">
                <Loader />
              </div>
            ) : (
              <motion.div
                key={currOption}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {currOption === "account" && (
                  <>
                    <div className="cosmicHeader px-6 py-5 text-white flex items-center justify-between">
                      <h1 className="text-xl sm:text-2xl font-extrabold">Account Information</h1>
                      <button
                        type="button"
                        onClick={() => setCurrOption("settings")}
                        className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition"
                      >
                        Edit Profile
                      </button>
                    </div>
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                        <img
                          className="w-24 h-24 rounded-full border-4 border-indigo-200 shadow-md object-cover"
                          src="/images/profile.png"
                          alt="Profile"
                        />
                        <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                          {userDetails.name}
                        </h3>
                        <p className="text-sm text-slate-600">{userDetails.email}</p>
                        <p className="text-sm text-slate-600 mt-0.5">+91 {userDetails.mobile}</p>
                      </div>

                      <div className="flex flex-col justify-center gap-5 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Engineering Branch
                          </span>
                          <p className="text-base font-bold text-slate-900 mt-1">
                            {getBranchName(userDetails.branch)}
                          </p>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            College / Institution
                          </span>
                          <p className="text-base font-bold text-slate-900 mt-1">
                            {userDetails.college}
                          </p>
                        </div>
                        <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Enrolled Packs
                          </span>
                          <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            {registeredTests.length} Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currOption === "registrations" && (
                  <>
                    <div className="cosmicHeader px-6 py-5 text-white flex items-center justify-between">
                      <h1 className="text-xl sm:text-2xl font-extrabold">Your Registrations</h1>
                      <Link
                        href="/tests"
                        className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-300 text-slate-950 hover:bg-amber-200 transition"
                      >
                        + Enroll More
                      </Link>
                    </div>
                    <div className="p-6 sm:p-8">
                      {registeredTests.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                          <p className="text-base font-bold text-slate-800">
                            You have no active registrations yet.
                          </p>
                          <p className="text-sm text-slate-500 mt-1 mb-5">
                            Pick your engineering branch and enroll for GATE 2027 mocks.
                          </p>
                          <Link
                            href="/tests"
                            className="inline-block px-6 py-2.5 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                          >
                            Browse GATE 2027 Tests
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {registeredTests.map((reg) => {
                            const [testName, pkgName] = (reg.test || "").split(", ");
                            return (
                              <div
                                key={reg._id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-3"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                    GATE Mock for {testName || "Engineering"}
                                  </h3>
                                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                    ✓ {reg.payment?.status === "paid" ? "Paid" : "Confirmed"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                                  <p>
                                    <strong className="text-slate-800">Package:</strong>{" "}
                                    {pkgName || "N/A"}
                                  </p>
                                  <p>
                                    <strong className="text-slate-800">Amount:</strong> ₹{" "}
                                    {reg.payment?.amount ?? "—"}/-
                                  </p>
                                  <p>
                                    <strong className="text-slate-800">Name:</strong>{" "}
                                    {reg.userId?.name}
                                  </p>
                                  <p className="font-mono text-xs sm:text-sm">
                                    <strong className="font-sans text-slate-800">Payment ID:</strong>{" "}
                                    {reg.pid}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {currOption === "settings" && (
                  <>
                    <div className="cosmicHeader px-6 py-5 text-white">
                      <h1 className="text-xl sm:text-2xl font-extrabold">Update Profile</h1>
                    </div>
                    <div className="p-6 sm:p-8 max-w-lg mx-auto space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Mobile Number *
                        </label>
                        <div className="flex">
                          <span className="px-3.5 py-2.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-600 font-semibold text-sm">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-r-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Branch *
                        </label>
                        <select
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Branch</option>
                          <option value="ECE">ECE</option>
                          <option value="Aerospace">Aerospace Engineering</option>
                          <option value="Mechanical">Mechanical Engineering</option>
                          <option value="Physics">Physics</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {selectedBranch === "other" && (
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">
                            Enter Your Branch *
                          </label>
                          <input
                            type="text"
                            value={otherBranch}
                            onChange={(e) => setOtherBranch(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          College *
                        </label>
                        <input
                          type="text"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={updateuserInfo}
                        className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] shadow-md transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                )}

                {currOption === "addFaq" && isAdmin && (
                  <>
                    <div className="cosmicHeader px-6 py-5 text-white">
                      <h1 className="text-xl sm:text-2xl font-extrabold">Add New FAQ</h1>
                    </div>
                    <div className="p-6 sm:p-8 max-w-xl mx-auto space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["General", "Payments", "Technical", "Test", "Other"].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setCategory(cat)}
                              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                                category === cat
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Enter the FAQ question"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Answer
                        </label>
                        <textarea
                          rows={4}
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Enter the FAQ answer"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={addFAQ}
                        className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] shadow-md transition"
                      >
                        Publish FAQ
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
