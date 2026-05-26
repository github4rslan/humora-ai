import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground">
        Your account and your subscription, both in one place.
      </p>

      <div className="mt-8 space-y-5">
        <Card className="p-6">
          <Badge>Account</Badge>
          <div className="mt-3 text-sm">
            Signed in as{" "}
            <span className="font-medium">
              {user?.emailAddresses[0]?.emailAddress ?? "unknown"}
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <Badge>Subscription</Badge>
          <p className="mt-3 text-sm text-muted-foreground">
            I handle billing through Stripe. To change your plan or cancel,
            head over and I&apos;ll send you to the right place.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/#pricing">See plans</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
