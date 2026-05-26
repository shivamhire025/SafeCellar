import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Logo href="/" size="lg" />
        <p className="text-sm text-neutral-500">Inspection-ready. Always.</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-lg font-semibold text-neutral-900">This link is invalid or expired</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Please request a new password reset link and try again.
        </p>
        <div className="mt-6 space-y-3">
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

