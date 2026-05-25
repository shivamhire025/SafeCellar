import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: { icon: "h-5 w-5", text: "text-base" },
  md: { icon: "h-6 w-6", text: "text-lg" },
  lg: { icon: "h-8 w-8", text: "text-2xl" },
} as const;

type LogoProps = {
  href?: string;
  size?: keyof typeof sizeStyles;
  className?: string;
};

export function Logo({ href = "/", size = "md", className }: LogoProps) {
  const styles = sizeStyles[size];
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-brand-700",
        href && "hover:opacity-90 transition-opacity",
        className
      )}
    >
      <FlaskConical className={styles.icon} aria-hidden />
      <span className={cn("font-bold", styles.text)}>SafeCellar</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
