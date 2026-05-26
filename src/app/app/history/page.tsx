import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Your history</h1>
      <p className="text-sm text-muted-foreground">
        Every rewrite I&apos;ve done for you lives here once you&apos;re on Pro.
      </p>

      <Card className="mt-8 p-12 text-center">
        <Badge>Comes with Pro</Badge>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">
          Nothing here yet.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          On the free tier, I don&apos;t save runs. Upgrade and I&apos;ll keep
          every rewrite so you can find it later.
        </p>
      </Card>
    </div>
  );
}
