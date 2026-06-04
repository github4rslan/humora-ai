"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type EngineOption = {
  id: string;
  name: string;
  shortName: string;
  version: string;
  description: string;
  isDefault: boolean;
};

const STORAGE_KEY = "humora.engine";
const FALLBACK: EngineOption[] = [
  {
    id: "humora-original",
    name: "Humora Original",
    shortName: "Humora",
    version: "3.0.0",
    description: "The default Humora engine.",
    isDefault: true,
  },
];

export function EngineSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [engines, setEngines] = useState<EngineOption[]>(FALLBACK);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/engines")
      .then((r) => r.json())
      .then((data: { engines?: EngineOption[] }) => {
        if (!cancelled && Array.isArray(data.engines) && data.engines.length > 0) {
          setEngines(data.engines);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored !== value && engines.some((e) => e.id === stored)) {
      onChange(stored);
    }
  }, [engines, onChange, value]);

  function handlePick(id: string) {
    onChange(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    setOpen(false);
  }

  const selected = engines.find((e) => e.id === value) ?? engines[0];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <Badge>Engine</Badge>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          v{selected.version}
        </span>
      </div>

      <div className="relative mt-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Cpu className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-medium truncate">{selected.name}</span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg"
          >
            {engines.map((engine) => (
              <button
                key={engine.id}
                role="option"
                aria-selected={engine.id === value}
                onClick={() => handlePick(engine.id)}
                className={cn(
                  "block w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                  engine.id === value && "bg-primary/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{engine.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    v{engine.version}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {engine.description}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        {selected.description}
      </p>
    </Card>
  );
}
