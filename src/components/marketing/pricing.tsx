import Link from "next/link";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function Pricing() {
  const tiers = [PLANS.free, PLANS.pro, PLANS.business];

  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
      <Badge>Pricing</Badge>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Start free. Upgrade when you need more room.
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        No trial gimmicks. No card to start. Cancel any time and I&apos;ll
        remember you when you come back.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {tiers.map((tier) => {
          const featured = tier.id === "pro";
          return (
            <Card
              key={tier.id}
              className={cn(
                "relative flex flex-col p-7",
                featured && "border-primary/40 shadow-[0_0_0_1px] shadow-primary/40"
              )}
            >
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most folks pick this
                  </span>
                </div>
              )}

              <div className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                {tier.name}
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  ${tier.priceMonthly}
                </span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>

              <div className="mt-1 text-sm text-muted-foreground">
                {tier.wordsPerMonth.toLocaleString()} words a month
              </div>

              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={featured ? "default" : "outline"}
                className="mt-8"
              >
                <Link href={tier.id === "free" ? "/sign-up" : `/app?upgrade=${tier.id}`}>
                  {tier.id === "free" ? "Start free" : `Grab ${tier.name}`}
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
