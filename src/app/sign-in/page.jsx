"use client";
import { useState, useEffect, useRef } from "react";
import NavbarLite from "@/components/NavbarLite";
import style from "@/components/styles/SignUpCSS.module.css";
import Footer from "@/components/Footer";
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
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
    const loadingToast = toast.loading("Please wait...");

    if (!email || !password) {
      toast.error("Please enter email and password");
      toast.dismiss(loadingToast);
      return;
    }

    if (!validateEmail(email)) {
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
    } catch (error) {
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
    const k = toast.loading("Please wait...");
    if (!rEmail) {
      toast.error("Please enter email");
      toast.dismiss(k);
      return;
    }
    if (!validateEmail(rEmail)) {
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
    <div className={`min-h-screen topSection`}>
      <NavbarLite />
      <motion.div
        className={`min-h-screen flex flex-col items-center mt-20 sm:mt-20 md:mt-14`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {resetPassword ? (
          <motion.div
            className={`${style.formBox} border border-black`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`${style.form}`}>
              <span className={`${style.title}`}>Reset Password</span>
              <span className={`${style.subtitle} px-14`}>
                Please enter your email
              </span>
              <div className={`${style.formContainer} w-full px-1`}>
                <p
                  className={`text-left text-md ${style.fonttAverta} text-[#0072bb] font-bold mb-1`}
                  htmlFor="rEmail"
                >
                  Email
                </p>
                <input
                  onChange={(e) => setREmail(e.target.value)}
                  type="email"
                  value={rEmail}
                  className={`${style.input} w-full p-2.5 mb-3 border-2 focus:border-blue-400 border-gray-700 rounded-md placeholder-gray-800 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400`}
                  placeholder="Enter Your Email"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordReset();
                    }
                  }}
                />
              </div>
              <button
                id="resetpassbtn"
                className={`${style.formButton} border border-[#343434] flex gap-2 justify-center items-center`}
                onClick={handlePasswordReset}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                </svg>
                Send reset link
              </button>
            </div>
            <div className={`${style.formSection}`}>
              <p>
                Remember your password?{" "}
                <span
                  className={`${style.smallLink} cursor-pointer`}
                  onClick={() => {
                    setResetPassword(false);
                  }}
                >
                  Sign in
                </span>
              </p>
            </div>
          </motion.div>
        ) : (
          <div className={`${style.formBox} border border-black`}>
            <div className={`${style.form}`}>
              <span className={`${style.title}`}>Sign in</span>
              <span className={`${style.subtitle} px-14`}>
                Sign into your account
              </span>
              {inValidEmailId && (
                <div
                  role="alert"
                  className="bg-red-100 w-[268px] border-l-4 border-red-500 text-red-900 p-2 rounded-lg flex items-center transition duration-300 ease-in-out"
                >
                  <svg
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 flex-shrink-0 mr-2 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                  <p className="text-xs text-justify text-left">
                    Please provide a valid email address and password. If you had
                    signed up using google, please use &apos;continue with
                    google&apos;. If you continue to have issues logging into
                    your account, contact us.
                  </p>
                </div>
              )}
              <div className={`${style.formContainer} w-full px-1`}>
                <p
                  className={`text-left text-[#0072bb] text-md ${style.fonttAverta} font-bold mb-1`}
                  htmlFor="email"
                >
                  Email
                </p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                  className={`${style.input} w-full p-2.5 mb-3 border-2 focus:border-blue-400 border-gray-700 rounded-md placeholder-gray-800 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400`}
                  placeholder="Enter Your Email"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleSignIn();
                    }
                  }}
                />
                <p
                  className={`text-left text-[#0072bb] text-md ${style.fonttAverta} font-bold mb-1`}
                  htmlFor="password"
                >
                  Password
                </p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  value={password}
                  className={`${style.input} w-full p-2.5 mb-3 border-2 focus:border-blue-400 border-gray-700 rounded-md placeholder-gray-800 text-black focus:outline-none focus:ring-1 focus:ring-blue-400`}
                  placeholder="Password"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleSignIn();
                    }
                  }}
                />
              </div>
              <button
                className={`${style.formButton} border border-[#343434] flex gap-2 justify-center items-center`}
                onClick={handleSignIn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                </svg>
                Sign in
              </button>
              <button
                className={`${style.forgotBtn}`}
                onClick={() => {
                  setResetPassword(true);
                }}
              >
                Forgot password?
              </button>
              <div className={`${style.dividerContainer}`}>
                <div className={`${style.divider} text-xs`}>
                  Or use google account
                </div>
              </div>
              <button
                onClick={handleGoogle}
                className={`${style.GoogleButton} justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                Continue with Google
              </button>
            </div>
            <div className={`${style.formSection}`}>
              <p>
                Not registered? <a href="/sign-up">Sign up</a>{" "}
              </p>
            </div>
          </div>
        )}
      </motion.div>
      <Footer />
    </div>
  );
};

export default SignIn;
