import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">
            humora
            <span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="/#how" className="hover:text-foreground transition-colors">
            How I work
          </Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/#faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Try me free</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button asChild variant="ghost" size="sm">
              <Link href="/app">Open app</Link>
            </Button>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
