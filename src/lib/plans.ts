export type PlanId = "free" | "pro" | "business";

export type Plan = {
  id: PlanId;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  wordsPerMonth: number;
  features: string[];
  stripePriceId?: string;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceAnnual: 0,
    wordsPerMonth: 500,
    features: [
      "500 words a month",
      "Natural tone",
      "Two-pass humanizer",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 19,
    priceAnnual: 190,
    wordsPerMonth: 50_000,
    features: [
      "50,000 words a month",
      "All four tones",
      "Voice matching from your writing samples",
      "History of past rewrites",
      "Side-by-side diff view",
      "Priority queue",
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  business: {
    id: "business",
    name: "Business",
    priceMonthly: 49,
    priceAnnual: 490,
    wordsPerMonth: 1_000_000,
    features: [
      "1,000,000 words a month",
      "5 team seats",
      "API access",
      "Custom tones",
      "Priority support",
    ],
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID,
  },
};

export function getPlan(id: PlanId): Plan {
  return PLANS[id];
}
