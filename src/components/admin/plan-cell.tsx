"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PlanId } from "@/lib/plans";

const PLAN_OPTIONS: PlanId[] = ["free", "pro", "business"];

const PLAN_STYLES: Record<PlanId, string> = {
  free: "border-border bg-muted/60 text-foreground/80",
  pro: "border-primary/40 bg-primary/10 text-primary",
  business: "border-accent/40 bg-accent/10 text-accent-foreground",
};

export function PlanCell({
  userId,
  email,
  currentPlan,
}: {
  userId: string;
  email: string;
  currentPlan: PlanId;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [optimistic, setOptimistic] = useState<PlanId>(currentPlan);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function pickPlan(plan: PlanId) {
    setOpen(false);
    if (plan === optimistic) return;
    const previous = optimistic;
    setOptimistic(plan);

    try {
      const res = await fetch(`/api/admin/users/${userId}/plan`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Update failed." }));
        toast.error(data.error ?? "Update failed.");
        setOptimistic(previous);
        return;
      }
      toast.success(`${email} is now on ${plan}.`);
      startTransition(() => router.refresh());
    } catch {
      toast.error("Network error. Try again.");
      setOptimistic(previous);
    }
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:opacity-80",
          PLAN_STYLES[optimistic],
          pending && "opacity-60 cursor-wait"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {pending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
        )}
        <span className="capitalize">{optimistic}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-20 mt-2 w-36 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          {PLAN_OPTIONS.map((plan) => (
            <button
              key={plan}
              role="option"
              aria-selected={plan === optimistic}
              onClick={() => pickPlan(plan)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm capitalize transition-colors hover:bg-muted",
                plan === optimistic && "bg-primary/5 text-primary"
              )}
            >
              <span>{plan}</span>
              {plan === optimistic && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
