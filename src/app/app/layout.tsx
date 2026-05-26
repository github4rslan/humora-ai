import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
