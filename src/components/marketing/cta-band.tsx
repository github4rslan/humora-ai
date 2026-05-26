import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted p-10 text-center md:p-16">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Stop sounding like ChatGPT.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Free to try. No card. I&apos;ll handle your first 1,000 words on
            the house.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sign-up">Let&apos;s do this</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#demo">Try the demo first</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
