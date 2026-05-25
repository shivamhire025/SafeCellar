"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    org_name: "",
    facility_type: "brewery",
    state: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not create account. Please try again.");
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
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FlaskConical className="h-6 w-6 text-brand-700" />
          <span className="text-xl font-bold text-brand-700">SafeCellar</span>
        </div>
        <p className="text-sm text-neutral-500 text-center mb-6">
          Create your account (Step {step} of 2)
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>Full name</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>Facility name</Label>
                <Input
                  value={form.org_name}
                  onChange={(e) =>
                    setForm({ ...form, org_name: e.target.value })
                  }
                  placeholder="Cascade Creek Brewery"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Facility type</Label>
                <Select
                  value={form.facility_type}
                  onValueChange={(v) =>
                    setForm({ ...form, facility_type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brewery">Brewery</SelectItem>
                    <SelectItem value="winery">Winery</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>State</Label>
                <Input
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                  placeholder="OR"
                  required
                />
              </div>
            </>
          )}
          {error ? (
            <p className="text-sm text-red-600 text-center" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : step === 1 ? (
              "Continue"
            ) : (
              "Create account"
            )}
          </Button>
        </form>
        <p className="text-sm text-center text-neutral-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
