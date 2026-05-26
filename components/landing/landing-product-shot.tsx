import { BrowserFrame } from "@/components/landing/browser-frame";
import { LandingDashboardPreview } from "@/components/landing/landing-dashboard-preview";
import { cn } from "@/lib/utils";

/** Product preview mock in browser chrome (fixed layout; safe if CSS is partial). */
export function LandingProductShot({
  className,
  tilt = false,
}: {
  className?: string;
  tilt?: boolean;
}) {
  return (
    <div className={cn("w-full max-w-lg mx-auto lg:mx-0", className)}>
      <BrowserFrame
        className={cn(
          "w-full max-w-full",
          tilt && "rotate-1 sm:rotate-2"
        )}
      >
        <LandingDashboardPreview />
      </BrowserFrame>
    </div>
  );
}
