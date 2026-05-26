import { connectDB } from "./db";
import { User, Usage } from "./db/schema";
import { PLANS, type PlanId } from "./plans";
import { countWords } from "./utils";

function currentPeriodStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export type UsageCheck =
  | { allowed: true; remaining: number; plan: PlanId }
  | { allowed: false; remaining: number; plan: PlanId; reason: "over_limit" };

export async function getOrCreateUser(args: {
  id: string;
  email: string;
}): Promise<{ id: string; plan: PlanId }> {
  await connectDB();
  const existing = await User.findById(args.id).lean();
  if (existing) {
    return { id: existing._id, plan: existing.plan as PlanId };
  }
  await User.create({ _id: args.id, email: args.email, plan: "free" });
  return { id: args.id, plan: "free" };
}

export async function checkUsage(args: {
  userId: string;
  inputText: string;
}): Promise<UsageCheck> {
  await connectDB();
  const user = await User.findById(args.userId).lean();
  const plan: PlanId = (user?.plan as PlanId) ?? "free";
  const limit = PLANS[plan].wordsPerMonth;
  const periodStart = currentPeriodStart();

  const row = await Usage.findOne({ userId: args.userId, periodStart }).lean();
  const used = row?.wordsUsed ?? 0;
  const incoming = countWords(args.inputText);
  const remaining = Math.max(0, limit - used);

  if (incoming > remaining) {
    return { allowed: false, remaining, plan, reason: "over_limit" };
  }
  return { allowed: true, remaining: remaining - incoming, plan };
}

export async function incrementUsage(args: {
  userId: string;
  words: number;
}): Promise<void> {
  await connectDB();
  const periodStart = currentPeriodStart();
  await Usage.updateOne(
    { userId: args.userId, periodStart },
    { $inc: { wordsUsed: args.words } },
    { upsert: true }
  );
}
