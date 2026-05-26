import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { connectDB } from "@/lib/db";
import { User, Subscription } from "@/lib/db/schema";
import type { PlanId } from "@/lib/plans";

export const runtime = "nodejs";

type SubStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete";

function periodEnd(sub: Stripe.Subscription): Date {
  const itemEnd = sub.items?.data?.[0]?.current_period_end;
  const seconds = typeof itemEnd === "number" ? itemEnd : Math.floor(Date.now() / 1000);
  return new Date(seconds * 1000);
}

function status(sub: Stripe.Subscription): SubStatus {
  const s = sub.status;
  if (
    s === "active" ||
    s === "trialing" ||
    s === "past_due" ||
    s === "canceled" ||
    s === "incomplete"
  ) {
    return s;
  }
  return "incomplete";
}

export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });

  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id ?? session.metadata?.userId;
      const plan = (session.metadata?.plan as PlanId) ?? "pro";
      if (!userId) break;

      const sub =
        typeof session.subscription === "string"
          ? await stripe.subscriptions.retrieve(session.subscription)
          : (session.subscription as Stripe.Subscription | null);

      if (sub) {
        await Subscription.updateOne(
          { _id: sub.id },
          {
            $set: {
              userId,
              stripeCustomerId: String(session.customer),
              stripeSubscriptionId: sub.id,
              plan,
              status: status(sub),
              currentPeriodEnd: periodEnd(sub),
            },
          },
          { upsert: true }
        );

        await User.updateOne({ _id: userId }, { $set: { plan } });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await Subscription.updateOne(
        { _id: sub.id },
        { $set: { status: status(sub), currentPeriodEnd: periodEnd(sub) } }
      );

      if (sub.status === "canceled") {
        const existing = await Subscription.findById(sub.id).lean();
        if (existing) {
          await User.updateOne({ _id: existing.userId }, { $set: { plan: "free" } });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
