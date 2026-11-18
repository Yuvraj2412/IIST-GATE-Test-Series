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
  sendPasswordResetEmail,
} from "@/libs/supabase/authClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SignIn = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rEmail, setREmail] = useState("");
  const isFirstRef = useRef(true);
  const [inValidEmailId, setInValidEmailId] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);

  const handleGoogle = async () => {
    const k = toast.loading("Redirecting to Google...");
    isFirstRef.current = false;
    try {
      await signInWithGoogle("/sign-in?oauth=google");
    } catch (error) {
      toast.dismiss(k);
      toast.error(error?.message || "Failed to start Google sign-in.");
      console.error(error);
    }
  };

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

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
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("authError");
    if (authError) {
      toast.error(authError);
    }

    const unsubscribe = onAuthStateChanged(null, async (user) => {
      if (!user) return;
      const isOAuthReturn =
        new URLSearchParams(window.location.search).get("oauth") === "google";
      if (!isFirstRef.current && !isOAuthReturn) return;

      const tempUser = await getUser();
      if (tempUser?.msg === "User Found") {
        if (isOAuthReturn) {
          toast.success("Welcome back!");
          router.push("/dashboard");
        } else {
          router.push("/home");
        }
      } else if (tempUser?.msg === "No user found") {
        toast("Please complete your sign-up details!", { icon: "ℹ️" });
        router.push("/sign-up?oauth=google");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    isFirstRef.current = false;
    setInValidEmailId(false);
    const loadingToast = toast.loading("Signing you in...");

    if (!email || !password) {
      toast.error("Please enter email and password");
      toast.dismiss(loadingToast);
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.error("Invalid email address");
      toast.dismiss(loadingToast);
      return;
    }

    try {
      const emailCheckResponse = await fetch("/api/checkEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (emailCheckResponse.status === 201) {
        toast.error("Email not registered");
        toast.dismiss(loadingToast);
        return;
      }
    } catch {
      toast.error("Error checking email. Please try again.");
      toast.dismiss(loadingToast);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast.dismiss(loadingToast);
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("invalid login credentials")) {
          setInValidEmailId(true);
          toast.error("Incorrect Email or Password");
        } else if (msg.includes("email not confirmed")) {
          toast.error("Please verify your email address before signing in.");
        } else {
          toast.error(error.message || "An error occurred. Please try again.");
        }
        return;
      }

      const tempUser = await getUser();
      toast.dismiss(loadingToast);

      if (tempUser?.msg === "No user found") {
        toast("Please complete your profile details!", { icon: "ℹ️" });
        router.push("/sign-up?oauth=google");
        return;
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("An error occurred. Please try again later.");
      console.error(error);
    }
  };

  const handlePasswordReset = async () => {
    const k = toast.loading("Sending reset link...");
    if (!rEmail) {
      toast.error("Please enter email");
      toast.dismiss(k);
      return;
    }
    if (!validateEmail(rEmail.trim())) {
      toast.error("Invalid email address");
      toast.dismiss(k);
      return;
    }
    try {
      await sendPasswordResetEmail(rEmail.trim().toLowerCase());
      toast.success("Please check your email to reset your password");
      toast.dismiss(k);
      setResetPassword(false);
    } catch (error) {
      toast.error(error?.message || "Failed to send reset link");
      toast.dismiss(k);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 topSection">
      <NavbarLite />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {resetPassword ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-7 sm:p-8 space-y-5">
                <div className="flex justify-center">
                  <BrandLogo variant="light" size="sm" href={null} />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-extrabold text-slate-900">Reset Password</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your registered email to receive a reset link.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="rEmail">
                    Email
                  </label>
                  <input
                    id="rEmail"
                    type="email"
                    value={rEmail}
                    onChange={(e) => setREmail(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") handlePasswordReset();
                    }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  id="resetpassbtn"
                  type="button"
                  onClick={handlePasswordReset}
                  className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] shadow-md transition"
                >
                  Send Reset Link
                </button>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => setResetPassword(false)}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-7 sm:p-8 space-y-5">
                <div className="flex justify-center">
                  <BrandLogo variant="light" size="sm" href={null} />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Sign in to your IGTS · Dhanak 2027 account
                  </p>
                </div>

                {inValidEmailId && (
                  <div
                    role="alert"
                    className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs leading-relaxed"
                  >
                    Incorrect email or password. If you originally signed up with Google, please click{" "}
                    <strong>Continue with Google</strong> below.
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") handleSignIn();
                      }}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-bold text-slate-700" htmlFor="password">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setResetPassword(true)}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") handleSignIn();
                      }}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignIn}
                  className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] shadow-md shadow-indigo-500/20 transition"
                >
                  Sign In
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-3 text-xs font-semibold text-slate-400 uppercase">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center gap-3 transition shadow-sm"
                >
                  <svg className="w-5 h-5" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
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
                New to IGTS?{" "}
                <Link href="/sign-up" className="font-bold text-indigo-600 hover:underline">
                  Create an account
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SignIn;
