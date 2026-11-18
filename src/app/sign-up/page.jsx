"use client";
import { useState, useEffect, useRef } from "react";
import NavbarLite from "@/components/NavbarLite";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";
import {
  getSupabaseBrowserClient,
  onAuthStateChanged,
  signInWithGoogle,
  signOut,
} from "@/libs/supabase/authClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confpass, setCnfPass] = useState("");
  const [verified, setVerified] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [resendtimer, setTimer] = useState(45);
  const [LocalOTP, setLocalOTP] = useState(new Array(4).fill(""));
  const isFirstRef = useRef(true);
  const [otherBranch, setOtherBranch] = useState("");

  useEffect(() => {
    if (!showOtpStep || resendtimer <= 0) return;
    const timer = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showOtpStep, resendtimer]);

  const handleGoogle = async () => {
    const k = toast.loading("Redirecting to Google...");
    isFirstRef.current = false;
    try {
      await signInWithGoogle("/sign-up?oauth=google");
    } catch (error) {
      toast.dismiss(k);
      toast.error(error?.message || "Failed to start Google sign-up.");
      console.error(error);
    }
  };

  const getUser = async () => {
    const res = await fetch("/api/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.status === 200) {
      return await res.json();
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(null, async (user) => {
      if (!user) return;
      const isOAuthReturn =
        new URLSearchParams(window.location.search).get("oauth") === "google";
      if (!isFirstRef.current && !isOAuthReturn) return;

      const tempUser = await getUser();
      if (tempUser?.msg === "User Found") {
        router.push(isOAuthReturn ? "/dashboard" : "/home");
      } else if (tempUser?.msg === "No user found") {
        setName(user.displayName || "");
        setEmail(user.email || "");
        setUsername((user.email || "").split("@")[0] || "");
        setShowOtpStep(false);
        setVerified(false);
        setGoogleVerified(true);
        if (isOAuthReturn) {
          toast.success("Google account connected!");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const saveGoogleUserData = async () => {
    if (!name.trim()) return toast.error("Please fill your full name");
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      return toast.error("Mobile number must be 10 digits");
    }
    if (!selectedBranch.trim()) return toast.error("Please choose your B.Tech branch");
    if (selectedBranch === "other" && !otherBranch.trim()) {
      return toast.error("Please enter your branch");
    }
    if (!collegeName.trim()) return toast.error("Please fill your college name");

    const k = toast.loading("Saving your account...");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          name,
          mobile: mobileNumber.trim(),
          college: collegeName,
          branch: selectedBranch === "other" ? otherBranch : selectedBranch,
        }),
      });

      const data = await res.json();
      toast.dismiss(k);

      if (res.status === 200) {
        await getUser();
        toast.success("Welcome to IGTS GATE 2027!");
        router.push("/dashboard");
      } else {
        toast.error(data.msg || "User not created. Please contact us.");
      }
    } catch (error) {
      toast.dismiss(k);
      toast.error(error?.message || "Failed to save your account.");
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    setLocalOTP(LocalOTP.map((d, idx) => (idx === index ? element.value : d)));
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const verifyEmail = async () => {
    if (!email.trim()) return toast.error("Please enter email");
    if (!validateEmail(email.trim())) return toast.error("Invalid email address");

    const cleanEmail = email.trim().toLowerCase();
    setEmail(cleanEmail);
    const k = toast.loading("Sending OTP...");

    try {
      const res = await fetch("/api/signup/sendOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      toast.dismiss(k);

      if (res.status === 200) {
        toast.success("OTP sent to your email");
        setUsername(data.username);
        setLocalOTP(new Array(4).fill(""));
        setTimer(45);
        setShowOtpStep(true);
      } else if (res.status === 201) {
        toast.error("Email already registered. Please sign in.");
      } else {
        toast.error(data.msg || "Failed to send OTP");
      }
    } catch {
      toast.dismiss(k);
      toast.error("Something went wrong sending OTP");
    }
  };

  const resendEmail = async () => {
    if (resendtimer > 0) return;
    const k = toast.loading("Resending OTP...");
    try {
      const res = await fetch("/api/signup/sendOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      toast.dismiss(k);

      if (res.status === 200) {
        toast.success("New OTP sent to your email");
        setTimer(30);
        setUsername(data.username);
      } else {
        toast.error(data.msg || "Could not resend OTP");
      }
    } catch {
      toast.dismiss(k);
      toast.error("Failed to resend OTP");
    }
  };

  const verifyOTP = async () => {
    const otpText = LocalOTP.join("").trim();
    if (otpText.length !== 4) return toast.error("Please enter the 4-digit OTP");

    const k = toast.loading("Verifying OTP...");
    try {
      const res = await fetch("/api/signup/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otpText }),
      });
      const data = await res.json();
      toast.dismiss(k);

      if (res.status === 200 && data.verificationToken) {
        toast.success("Email verified successfully");
        setVerificationToken(data.verificationToken);
        setShowOtpStep(false);
        setVerified(true);
      } else {
        toast.error(data.msg || "Incorrect OTP! Please try again");
        setVerified(false);
      }
    } catch {
      toast.dismiss(k);
      toast.error("Failed to verify OTP. Please try again.");
      setVerified(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) return toast.error("Please fill your full name");
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      return toast.error("Mobile number must be 10 digits");
    }
    if (!selectedBranch.trim()) return toast.error("Please choose your B.Tech branch");
    if (selectedBranch === "other" && !otherBranch.trim()) {
      return toast.error("Please enter your branch");
    }
    if (!collegeName.trim()) return toast.error("Please fill your college name");
    if (!password || !confpass) return toast.error("Please enter and confirm your password");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confpass) return toast.error("Passwords do not match");

    const k = toast.loading("Creating your account...");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          verificationToken,
          username,
          name,
          mobile: mobileNumber.trim(),
          college: collegeName,
          branch: selectedBranch === "other" ? otherBranch : selectedBranch,
        }),
      });

      const data = await res.json();
      if (res.status === 200) {
        const supabase = getSupabaseBrowserClient();
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        toast.dismiss(k);
        if (signInErr) {
          toast.success("Account created! Please sign in.");
          router.push("/sign-in");
          return;
        }

        await getUser();
        toast.success("Welcome to IGTS GATE 2027!");
        router.push("/dashboard");
      } else if (res.status === 401) {
        toast.dismiss(k);
        toast.error(data.msg || "Verification expired. Please verify your email again.");
        setVerified(false);
        setVerificationToken("");
      } else {
        toast.dismiss(k);
        toast.error(data.msg || "User not created. Please contact us.");
      }
    } catch {
      toast.dismiss(k);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] topSection">
      <NavbarLite />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Step 1: Choose Email or Google */}
          {!showOtpStep && !verified && !googleVerified && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-7 sm:p-8 space-y-5">
                <div className="flex justify-center">
                  <BrandLogo variant="light" size="sm" href={null} />
                </div>
                <div className="text-center">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Create Account</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Register for IGTS GATE 2027 Mock Series
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="signup-email">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") verifyEmail();
                    }}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-[#0f4c81]"
                  />
                </div>

                <button
                  type="button"
                  onClick={verifyEmail}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition"
                >
                  Send Verification OTP
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-3 text-xs font-medium text-slate-400 uppercase">
                    Or
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full py-2.5 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-3 transition"
                >
                  <svg className="w-4 h-4" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    />
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    />
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    />
                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-semibold text-[#0f4c81] hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {showOtpStep && !verified && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-7 sm:p-8 relative text-center space-y-5">
              <button
                type="button"
                onClick={() => setShowOtpStep(false)}
                aria-label="Back"
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                ×
              </button>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Enter Verification Code</h2>
              <p className="text-sm text-slate-500">
                We sent a 4-digit OTP to{" "}
                <strong className="text-[#0f4c81]">{email}</strong>
              </p>

              <div className="flex justify-center gap-3">
                {LocalOTP.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") verifyOTP();
                    }}
                    className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-slate-300 bg-white focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 focus:outline-none text-slate-900"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={verifyOTP}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition"
              >
                Verify Email
              </button>

              <div className="text-sm text-slate-500">
                {resendtimer > 0 ? (
                  <p>Resend available in {resendtimer}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={resendEmail}
                    className="font-semibold text-[#0f4c81] hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Profile Form (Verified Email OR Google OAuth) */}
          {((verified && !showOtpStep) || (!showOtpStep && !verified && googleVerified)) && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-7 sm:p-8 space-y-4">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Email Verified
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Complete Profile</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your academic details to finish registration.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                    <input
                      type="text"
                      value={username}
                      readOnly
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="px-3 py-2 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2 rounded-r-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    B.Tech Branch *
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  >
                    <option value="">Select Branch</option>
                    <option value="ECE">ECE</option>
                    <option value="Aerospace">Aerospace</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Physics">Physics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {selectedBranch === "other" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Specify Branch *
                    </label>
                    <input
                      type="text"
                      value={otherBranch}
                      onChange={(e) => setOtherBranch(e.target.value)}
                      placeholder="Enter your branch"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">College Name *</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="Enter your college / university"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>

                {verified && !googleVerified && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={confpass}
                        onChange={(e) => setCnfPass(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  isFirstRef.current = false;
                  if (googleVerified) saveGoogleUserData();
                  else handleSignUp();
                }}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition"
              >
                Complete Registration
              </button>

              {googleVerified && (
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    setGoogleVerified(false);
                    setName("");
                    setEmail("");
                    setUsername("");
                  }}
                  className="w-full text-center text-xs font-semibold text-[#0f4c81] hover:underline pt-1"
                >
                  Use a different Google account
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;
