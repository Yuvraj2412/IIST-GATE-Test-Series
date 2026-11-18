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
    <div className="min-h-screen flex flex-col bg-[#f8fafc] topSection">
      <NavbarLite />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {loading ? (
          <Loader />
        ) : !user ? (
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Invalid or Expired Link</h2>
            <p className="text-sm text-slate-600">
              Your password reset link may have expired. Please request a new one from Sign In.
            </p>
            <Link
              href="/sign-in"
              className="inline-block px-5 py-2.5 rounded-lg bg-[#0f4c81] text-white text-sm font-semibold hover:bg-[#0a3963] transition"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-5">
            <div className="flex justify-center">
              <BrandLogo variant="light" size="sm" href={null} />
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Set New Password</h1>
              <p className="text-sm text-slate-500 mt-1">
                Updating password for <span className="font-semibold text-slate-700">{user.email}</span>
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") handleUpdatePassword();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  placeholder="Re-enter password"
                />
              </div>
              <button
                disabled={submitting}
                onClick={handleUpdatePassword}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f4c81] hover:bg-[#0a3963] transition disabled:opacity-60"
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
