"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@safecellar.app");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Invalid email or password");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4 relative">
      <Link
        href="/"
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full py-2.5" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        <p className="text-sm text-brand-700 text-center mt-4">
          <Link href="#" className="hover:underline">
            Forgot your password?
          </Link>
        </p>
        <hr className="border-neutral-200 my-6" />
        <p className="text-sm text-center text-neutral-600">
          New to SafeCellar?{" "}
          <Link href="/signup" className="text-brand-700 font-medium hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-xs text-neutral-400 text-center mt-4">
          Shared demo account: demo@safecellar.app. See docs/SUPABASE.md (Marcus Chen)
        </p>
      </div>
    </div>
  );
}
