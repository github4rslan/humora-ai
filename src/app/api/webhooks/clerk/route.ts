import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { sendWelcomeEmail } from "@/lib/email";
import { getOrCreateUser } from "@/lib/usage";

export const runtime = "nodejs";

type ClerkUserCreated = {
  type: "user.created";
  data: {
    id: string;
    first_name?: string | null;
    email_addresses: Array<{ id: string; email_address: string }>;
    primary_email_address_id?: string | null;
  };
};

type ClerkEvent = ClerkUserCreated | { type: string; data: unknown };

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook signing secret not configured." },
      { status: 500 }
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers." }, { status: 400 });
  }

  const raw = await req.text();
  const wh = new Webhook(secret);

  let event: ClerkEvent;
  try {
    event = wh.verify(raw, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "user.created") {
    const user = (event as ClerkUserCreated).data;
    const primary = user.email_addresses.find(
      (e) => e.id === user.primary_email_address_id
    );
    const email = primary?.email_address ?? user.email_addresses[0]?.email_address;

    if (email) {
      await getOrCreateUser({ id: user.id, email });
      await sendWelcomeEmail({
        to: email,
        firstName: user.first_name ?? undefined,
      });
    }
  }

  return NextResponse.json({ received: true });
}
