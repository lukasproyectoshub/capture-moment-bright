import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  isLoading,
}: {
  label: string;
  value: string | number;
  hint?: string | undefined;
  icon: LucideIcon;
  tone?: "primary" | "sky" | "accent" | "warning" | "success" | undefined;
  isLoading?: boolean | undefined;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    sky: "bg-sky/40 text-sky-foreground",
    accent: "bg-accent/15 text-accent",
    warning: "bg-warning/25 text-warning-foreground",
    success: "bg-success/15 text-success",
  };

  return (
    <Card className="rounded-2xl border-border/70 shadow-soft transition-shadow hover:shadow-card">
      <CardContent className="flex items-center gap-4 p-5">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
            tones[tone],
          )}
        >
          <Icon className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="text-2xl font-bold">{isLoading ? "—" : value}</p>
          {hint ? <p className="truncate text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
