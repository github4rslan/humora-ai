import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-xl font-semibold tracking-tight">
              humora<span className="text-primary">.</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Hi, I&apos;m Humora. I turn AI drafts into writing that sounds
              like you. Built on the 29-pattern Wikipedia guide to AI tells.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/#how" className="hover:text-primary">How I work</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/app" className="hover:text-primary">Open app</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
              <li><a href="mailto:hello@humora.ai" className="hover:text-primary">Say hi</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Humora. Made with patience.</div>
          <div>Built on Next.js. Powered by your judgment.</div>
        </div>
      </div>
    </footer>
  );
}
