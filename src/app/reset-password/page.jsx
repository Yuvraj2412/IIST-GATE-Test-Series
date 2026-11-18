"use client";
import { useState } from "react";
import NavbarLite from "@/components/NavbarLite";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import BrandLogo from "@/components/BrandLogo";
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
    } catch {
      toast.dismiss(k);
      toast.error("Failed to update password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 topSection">
      <NavbarLite />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {loading ? (
          <Loader />
        ) : !user ? (
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Invalid or Expired Link</h2>
            <p className="text-sm text-slate-600">
              Your password reset link may have expired. Please request a new one from Sign In.
            </p>
            <Link
              href="/sign-in"
              className="inline-block px-6 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5">
            <div className="flex justify-center">
              <BrandLogo variant="light" size="sm" href={null} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-slate-900">Set New Password</h1>
              <p className="text-sm text-slate-500 mt-1">
                Updating password for <span className="font-semibold text-slate-700">{user.email}</span>
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") handleUpdatePassword();
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Re-enter password"
                />
              </div>
              <button
                disabled={submitting}
                onClick={handleUpdatePassword}
                className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#4f46e5] to-[#674cee] hover:from-[#4338ca] hover:to-[#5b3fe3] transition shadow-md disabled:opacity-60"
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
