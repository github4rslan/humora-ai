import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Hero } from "@/components/marketing/hero";
import { Demo } from "@/components/marketing/demo";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PatternsGrid } from "@/components/marketing/patterns-grid";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Demo />
        <HowItWorks />
        <PatternsGrid />
        <Pricing />
        <FAQ />
        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
