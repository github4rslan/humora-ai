import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { User, Subscription, Usage, Document } from "./db/schema";
import { PLANS, type PlanId } from "./plans";

function adminIds(): Set<string> {
  const raw = process.env.ADMIN_USER_IDS ?? "";
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
}

export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return adminIds().has(userId);
}

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId || !isAdmin(userId)) redirect("/");
  return userId;
}

function periodStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export type Overview = {
  totalUsers: number;
  paidUsers: number;
  signupsToday: number;
  signupsWeek: number;
  signupsMonth: number;
  wordsThisMonth: number;
  runsThisMonth: number;
  mrr: number;
  planBreakdown: Record<PlanId, number>;
};

export async function getOverview(): Promise<Overview> {
  await connectDB();

  const [totalUsers, paidUsers, signupsToday, signupsWeek, signupsMonth] =
    await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ plan: { $in: ["pro", "business"] } }),
      User.countDocuments({ createdAt: { $gte: daysAgo(1) } }),
      User.countDocuments({ createdAt: { $gte: daysAgo(7) } }),
      User.countDocuments({ createdAt: { $gte: periodStart() } }),
    ]);

  const usageAgg = await Usage.aggregate<{ _id: null; total: number }>([
    { $match: { periodStart: periodStart() } },
    { $group: { _id: null, total: { $sum: "$wordsUsed" } } },
  ]);
  const wordsThisMonth = usageAgg[0]?.total ?? 0;

  const runsThisMonth = await Document.countDocuments({
    createdAt: { $gte: periodStart() },
  });

  const planCountsAgg = await User.aggregate<{ _id: PlanId; count: number }>([
    { $group: { _id: "$plan", count: { $sum: 1 } } },
  ]);
  const planBreakdown: Record<PlanId, number> = { free: 0, pro: 0, business: 0 };
  for (const row of planCountsAgg) {
    if (row._id in planBreakdown) planBreakdown[row._id] = row.count;
  }

  const activeSubs = await Subscription.find({
    status: { $in: ["active", "trialing"] },
  }).lean();
  const mrr = activeSubs.reduce((sum, s) => {
    const p = PLANS[s.plan as PlanId];
    return sum + (p?.priceMonthly ?? 0);
  }, 0);

  return {
    totalUsers,
    paidUsers,
    signupsToday,
    signupsWeek,
    signupsMonth,
    wordsThisMonth,
    runsThisMonth,
    mrr,
    planBreakdown,
  };
}

export type UserRow = {
  id: string;
  email: string;
  plan: PlanId;
  createdAt: Date;
  wordsThisMonth: number;
  lastActivity: Date | null;
};

export async function listUsers(args?: {
  search?: string;
  limit?: number;
}): Promise<UserRow[]> {
  await connectDB();
  const limit = Math.min(args?.limit ?? 100, 500);

  const filter = args?.search
    ? { email: { $regex: args.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
    : {};

  const users = await User.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  if (!users.length) return [];

  const ids = users.map((u) => u._id);
  const period = periodStart();

  const [usageRows, lastDocs] = await Promise.all([
    Usage.find({ userId: { $in: ids }, periodStart: period }).lean(),
    Document.aggregate<{ _id: string; last: Date }>([
      { $match: { userId: { $in: ids } } },
      { $group: { _id: "$userId", last: { $max: "$createdAt" } } },
    ]),
  ]);

  const usageMap = new Map(usageRows.map((u) => [u.userId, u.wordsUsed]));
  const lastMap = new Map(lastDocs.map((d) => [d._id, d.last]));

  return users.map((u) => ({
    id: u._id,
    email: u.email,
    plan: u.plan as PlanId,
    createdAt: (u as { createdAt?: Date }).createdAt ?? new Date(0),
    wordsThisMonth: usageMap.get(u._id) ?? 0,
    lastActivity: lastMap.get(u._id) ?? null,
  }));
}

export type ActivityRow = {
  id: string;
  userId: string;
  email: string;
  tone: string;
  wordCount: number;
  createdAt: Date;
  preview: string;
};

export async function listActivity(limit = 50): Promise<ActivityRow[]> {
  await connectDB();
  const docs = await Document.find({})
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 200))
    .lean();
  if (!docs.length) return [];

  const ids = Array.from(new Set(docs.map((d) => d.userId)));
  const users = await User.find({ _id: { $in: ids } }).lean();
  const emailMap = new Map(users.map((u) => [u._id, u.email]));

  return docs.map((d) => ({
    id: String((d as { _id: unknown })._id),
    userId: d.userId,
    email: emailMap.get(d.userId) ?? "unknown",
    tone: d.tone,
    wordCount: d.wordCount,
    createdAt: (d as { createdAt?: Date }).createdAt ?? new Date(0),
    preview: d.inputText.slice(0, 140),
  }));
}
