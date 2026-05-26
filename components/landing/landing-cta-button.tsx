import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingCtaButton({
  size = "default",
  className,
  variant = "default",
}: {
  size?: "default" | "lg";
  className?: string;
  variant?: "default" | "light";
}) {
  return (
    <Button
      size={size}
      className={cn(
        variant === "light" &&
          "bg-white text-brand-800 shadow-md hover:bg-stone-50",
        variant === "default" && "shadow-md",
        className
      )}
      asChild
    >
      <Link href="/login">Try the demo</Link>
    </Button>
  );
}
