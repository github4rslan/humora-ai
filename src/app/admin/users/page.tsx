import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listUsers } from "@/lib/admin";
import { PlanCell } from "@/components/admin/plan-cell";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string }>;

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function relativeTime(d: Date | null): string {
  if (!d) return "never";
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(d);
}

export default async function AdminUsers({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const users = await listUsers({ search: q });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            {users.length} {users.length === 1 ? "user" : "users"}
            {q ? ` matching "${q}"` : ""}
          </p>
        </div>
        <form className="w-64">
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search by email…"
            className="h-10"
          />
        </form>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3 text-right">Words this month</th>
                <th className="px-5 py-3">Last active</th>
                <th className="px-5 py-3">Signed up</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-sm text-muted-foreground"
                  >
                    {q ? "No matching users." : "No signups yet. Be the first."}
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-3 font-medium">{u.email}</td>
                  <td className="px-5 py-3">
                    <PlanCell userId={u.id} email={u.email} currentPlan={u.plan} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {u.wordsThisMonth.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {relativeTime(u.lastActivity)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {q && (
        <div className="mt-4 text-center">
          <Link
            href="/admin/users"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear search
          </Link>
        </div>
      )}
    </div>
  );
}
