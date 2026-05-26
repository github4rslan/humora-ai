import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listActivity } from "@/lib/admin";

export const dynamic = "force-dynamic";

function relativeTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminActivity() {
  const rows = await listActivity(50);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground">
          The last 50 humanize runs across all users.
        </p>
      </div>

      {rows.length === 0 && (
        <Card className="p-16 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing humanized yet. When someone runs a draft, it shows up here.
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {rows.map((row) => (
          <Card key={row.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{row.email}</span>
                  <span>·</span>
                  <Badge className="capitalize">{row.tone}</Badge>
                  <span>·</span>
                  <span>{row.wordCount.toLocaleString()} words</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {row.preview}
                  {row.preview.length >= 140 && "…"}
                </p>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">
                {relativeTime(row.createdAt)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
