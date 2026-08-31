import { AlertTriangle, PawPrint } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function DataState({
  isLoading,
  error,
  isEmpty,
  emptyMessage = "Todavía no hay registros",
  onRetry,
  children,
}: {
  isLoading: boolean;
  error?: Error | null | undefined;
  isEmpty?: boolean | undefined;
  emptyMessage?: string | undefined;
  onRetry?: (() => void) | undefined;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-live="polite">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center"
      >
        <AlertTriangle className="size-8 text-destructive" />
        <div>
          <p className="font-semibold">No se pudieron cargar los datos</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            Reintentar
          </Button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed bg-muted/40 p-10 text-center">
        <PawPrint className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
