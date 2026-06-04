import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/schema";
import type { PlanId } from "@/lib/plans";

export const runtime = "nodejs";

const VALID_PLANS: PlanId[] = ["free", "pro", "business"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing user id." }, { status: 400 });

  const body = await req.json().catch(() => null);
  const plan = body?.plan;
  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json(
      { error: "Invalid plan. Must be free, pro, or business." },
      { status: 400 }
    );
  }

  await connectDB();
  const result = await User.updateOne({ _id: id }, { $set: { plan } });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, plan });
}
