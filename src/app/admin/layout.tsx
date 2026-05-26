import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/activity", label: "Activity" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              humora<span className="text-primary">.</span>
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary align-middle">
                admin
              </span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => (
                <AdminNavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to app
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      )}
    >
      {label}
    </Link>
  );
}
