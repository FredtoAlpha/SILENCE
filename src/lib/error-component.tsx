import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-accent" aria-hidden="true">
        <TriangleAlert className="size-8" strokeWidth={1.6} />
      </span>
      <h1 className="font-display text-2xl font-semibold">Une page s’est perdue</h1>
      <p className="max-w-md text-sm leading-relaxed break-words text-fg-muted">
        {error.message || "Une erreur inattendue s’est produite. Recharge la page."}
      </p>
    </main>
  );
}
