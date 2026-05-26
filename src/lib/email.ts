import { Resend } from "resend";
import WelcomeEmail from "@/emails/welcome";

const key = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL ?? "Humora <hello@humora.ai>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const resend = key ? new Resend(key) : null;

export async function sendWelcomeEmail(args: {
  to: string;
  firstName?: string;
}): Promise<void> {
  if (!resend) {
    console.warn("[email] Resend not configured, skipping welcome email");
    return;
  }

  try {
    await resend.emails.send({
      from,
      to: args.to,
      subject: "Hey, welcome to Humora.",
      react: WelcomeEmail({ firstName: args.firstName, appUrl }),
    });
  } catch (err) {
    console.error("[email] sendWelcomeEmail failed", err);
  }
}
