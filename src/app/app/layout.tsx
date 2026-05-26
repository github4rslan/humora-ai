import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/admin";
import { Shield } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const showAdmin = isAdmin(userId);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            humora<span className="text-primary">.</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/app" className="hover:text-foreground transition-colors">
              Humanize
            </Link>
            <Link href="/app/history" className="hover:text-foreground transition-colors">
              History
            </Link>
            <Link href="/app/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {showAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Shield className="h-3 w-3" />
                Admin
              </Link>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link href="/#pricing">Upgrade</Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
