import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Humanizer } from "@/components/humanizer/humanizer";

export default async function AppHome() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Humanizer />
    </div>
  );
}
