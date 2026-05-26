import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOverview } from "@/lib/admin";
import { PLANS } from "@/lib/plans";
import { Users, CreditCard, FileText, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const stats = await getOverview();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          How Humora is doing this month.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Users}
          label="Total users"
          value={stats.totalUsers.toLocaleString()}
          sub={`${stats.signupsToday} today · ${stats.signupsWeek} this week`}
        />
        <Stat
          icon={CreditCard}
          label="Paid users"
          value={stats.paidUsers.toLocaleString()}
          sub={`${stats.totalUsers > 0 ? ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1) : "0"}% conversion`}
        />
        <Stat
          icon={Sparkles}
          label="MRR"
          value={`$${stats.mrr.toLocaleString()}`}
          sub={`Pro $${(stats.planBreakdown.pro * PLANS.pro.priceMonthly).toLocaleString()} · Business $${(stats.planBreakdown.business * PLANS.business.priceMonthly).toLocaleString()}`}
        />
        <Stat
          icon={FileText}
          label="Words this month"
          value={stats.wordsThisMonth.toLocaleString()}
          sub={`${stats.runsThisMonth.toLocaleString()} runs`}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <Badge>Plan breakdown</Badge>
          <div className="mt-4 space-y-3">
            <PlanRow
              label="Free"
              count={stats.planBreakdown.free}
              total={stats.totalUsers}
              color="bg-muted-foreground"
            />
            <PlanRow
              label="Pro"
              count={stats.planBreakdown.pro}
              total={stats.totalUsers}
              color="bg-primary"
            />
            <PlanRow
              label="Business"
              count={stats.planBreakdown.business}
              total={stats.totalUsers}
              color="bg-accent"
            />
          </div>
        </Card>

        <Card className="p-6">
          <Badge>Signups</Badge>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <SignupBox label="Today" value={stats.signupsToday} />
            <SignupBox label="This week" value={stats.signupsWeek} />
            <SignupBox label="This month" value={stats.signupsMonth} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Counts use UTC day boundaries.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </Card>
  );
}

function PlanRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {count.toLocaleString()} · {pct.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SignupBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
