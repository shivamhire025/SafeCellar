"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo-mode";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isDemoMode()) {
      setError("Password reset is not available in demo mode. Use the demo login on /login.");
      return;
    }

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/confirm?next=/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setSentTo(email);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4 relative">
        <Link
          href="/login"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to sign in
        </Link>

        <div className="mb-8 flex flex-col items-center gap-2">
          <Logo href="/" size="lg" />
          <p className="text-sm text-neutral-500">Inspection-ready. Always.</p>
        </div>

        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-center gap-2 text-neutral-900">
            <Mail className="h-5 w-5 text-brand-700" aria-hidden />
            <h1 className="text-lg font-semibold">Check your email</h1>
          </div>
          <p className="mt-3 text-sm text-neutral-600">
            If an account exists for <span className="font-medium">{sentTo}</span>, we sent a password reset
            link.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            The link will open SafeCellar and let you set a new password.
          </p>
          <div className="mt-6">
            <Button className="w-full" onClick={() => router.push("/login")}>
              Return to sign in
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
        <h1 className="text-lg font-semibold text-neutral-900">Reset your password</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Enter the email you use for SafeCellar. We’ll send a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full py-2.5" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Send reset link"}
          </Button>
        </form>

        <p className="text-sm text-center text-neutral-600 mt-6">
          Remembered your password?{" "}
          <Link href="/login" className="text-brand-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

