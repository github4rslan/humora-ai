import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <Link href="/" className="mb-8 text-2xl font-semibold tracking-tight">
        humora<span className="text-primary">.</span>
      </Link>
      <SignIn
        appearance={{
          elements: {
            rootBox: "shadow-none",
            card: "shadow-none bg-card border border-border",
          },
        }}
      />
    </div>
  );
}
