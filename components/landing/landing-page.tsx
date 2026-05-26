import { LandingCta } from "@/components/landing/landing-cta";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingPacket } from "@/components/landing/landing-packet";
import { LandingShell } from "@/components/landing/landing-shell";
import { LandingValue } from "@/components/landing/landing-value";

export function LandingPage() {
  return (
    <LandingShell>
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <LandingValue />
        <LandingHowItWorks />
        <LandingPacket />
        <LandingFeatures />
        <LandingCta />
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
