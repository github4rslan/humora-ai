import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe/client";
import { PLANS, type PlanId } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (!stripe) return NextResponse.json({ error: "Billing is not configured yet." }, { status: 500 });

  const { plan } = (await req.json().catch(() => ({}))) as { plan?: PlanId };
  if (!plan || plan === "free") {
    return NextResponse.json({ error: "Pick a paid plan." }, { status: 400 });
  }

  const priceId = PLANS[plan]?.stripePriceId;
  if (!priceId) {
    return NextResponse.json({ error: "Stripe price not configured for this plan." }, { status: 500 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
    client_reference_id: userId,
    metadata: { userId, plan },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
