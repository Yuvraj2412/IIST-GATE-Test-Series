"use client";
import { useState } from "react";
import NavbarLite from "@/components/NavbarLite";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import style from "@/components/styles/SignUpCSS.module.css";
import { getSupabaseBrowserClient, useAuthState } from "@/libs/supabase/authClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [user, loading] = useAuthState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const k = toast.loading("Updating password...");
    try {
      const { error } = await getSupabaseBrowserClient().auth.updateUser({ password });
      toast.dismiss(k);
      if (error) {
        toast.error(error.message || "Failed to update password.");
      } else {
        toast.success("Password updated successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.dismiss(k);
      toast.error("Failed to update password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen topSection">
      <NavbarLite />
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4">
        {loading ? (
          <Loader />
        ) : !user ? (
          <div className={`${style.formBox} border border-black p-6 text-center`}>
            <h2 className={`${style.title}`}>Invalid or Expired Link</h2>
            <p className={`${style.subtitle} mt-2`}>
              Your password reset link may have expired. Please request a new one from Sign In.
            </p>
            <Link
              href="/sign-in"
              className={`${style.formButton} inline-block mt-4 border border-[#343434]`}
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className={`${style.formBox} border border-black`}>
            <div className={`${style.form}`}>
              <span className={`${style.title}`}>Set New Password</span>
              <span className={`${style.subtitle}`}>
                Enter a new password for {user.email}
              </span>
              <div className={`${style.formContainer} w-full px-1`}>
                <p className={`text-left text-md ${style.fonttAverta} text-[#0072bb] font-bold mb-1`}>
                  New Password
                </p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${style.input} w-full p-2.5 mb-3 border-2 focus:border-blue-400 border-gray-700 rounded-md text-black focus:outline-none focus:ring-1 focus:ring-blue-400`}
                  placeholder="New Password"
                />
                <p className={`text-left text-md ${style.fonttAverta} text-[#0072bb] font-bold mb-1`}>
                  Confirm Password
                </p>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") handleUpdatePassword();
                  }}
                  className={`${style.input} w-full p-2.5 mb-3 border-2 focus:border-blue-400 border-gray-700 rounded-md text-black focus:outline-none focus:ring-1 focus:ring-blue-400`}
                  placeholder="Confirm New Password"
                />
              </div>
              <button
                disabled={submitting}
                onClick={handleUpdatePassword}
                className={`${style.formButton} border border-[#343434]`}
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
