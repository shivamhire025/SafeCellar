"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo-mode";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isDemoMode()) {
      setError("Password reset is not available in demo mode.");
      return;
    }

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4 relative">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Logo href="/" size="lg" />
          <p className="text-sm text-neutral-500">Inspection-ready. Always.</p>
        </div>

        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-lg font-semibold text-neutral-900">Password updated</h1>
          <p className="mt-2 text-sm text-neutral-600">
            You can now sign in with your new password.
          </p>
          <div className="mt-6">
            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4 relative">
      <Link
        href="/login"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </Link>

      <div className="mb-8 flex flex-col items-center gap-2">
        <Logo href="/" size="lg" />
        <p className="text-sm text-neutral-500">Inspection-ready. Always.</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-lg font-semibold text-neutral-900">Set a new password</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Choose a new password for your SafeCellar account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full py-2.5" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

