import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sun, UserRound } from "lucide-react";
import { CATALOG, MATIERES, filterCatalog, type Matiere, type Niveau } from "@/lib/catalog";
import { bookProgress, useProgress } from "@/lib/progress";
import { useReaderProfile } from "@/components/reader-profile-provider";

export const Route = createFileRoute("/")({ component: Library });

function Library() {
  const [niveau, setNiveau] = useState<Niveau | "tous">("tous");
  const [matiere, setMatiere] = useState<Matiere | "toutes">("toutes");
  const theme = useProgress((s) => s.theme);
  const setTheme = useProgress((s) => s.setTheme);
  const booksState = useProgress((s) => s.books);
  const { handle, loading } = useReaderProfile();

  const list = filterCatalog({ niveau, matiere });

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 pt-8 pb-2 sm:px-8 sm:pt-10">
        <p className="font-display text-xs tracking-[0.28em] text-fg-muted uppercase">Collège</p>
        <div className="flex items-center gap-1">
          <Link
            to="/login"
            className="flex h-11 items-center gap-2 rounded-md px-2 font-display text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <UserRound className="size-4" strokeWidth={1.6} />
            <span>{loading ? "…" : (handle ?? "S’identifier")}</span>
          </Link>
          <button
            type="button"
            onClick={() => setTheme(theme === "paper" ? "night" : "paper")}
            className="flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg"
            aria-label={theme === "paper" ? "Passer en mode nuit" : "Passer en mode jour"}
          >
            {theme === "paper" ? (
              <Moon className="size-5" strokeWidth={1.6} />
            ) : (
              <Sun className="size-5" strokeWidth={1.6} />
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
        <h1 className="font-display text-[2.6rem] leading-[0.95] font-semibold tracking-tight sm:text-6xl">
          Feuilletons
        </h1>
        <p className="mt-4 max-w-md font-serif text-[1.08rem] leading-relaxed text-fg-muted">
          Choisis ta classe, ta matière, puis un titre. Six soirs, environ dix minutes.
        </p>

        <div className="mt-8 flex flex-col gap-3 border-y border-border py-4">
          <FilterRow
            label="Niveau"
            value={niveau}
            items={[
              { id: "tous", label: "Tous" },
              { id: "4e", label: "4e" },
              { id: "3e", label: "3e" },
            ]}
            onChange={(v) => setNiveau(v as Niveau | "tous")}
          />
          <FilterRow
            label="Matière"
            value={matiere}
            items={[
              { id: "toutes", label: "Toutes" },
              ...MATIERES.map((m) => ({ id: m, label: m })),
            ]}
            onChange={(v) => setMatiere(v as Matiere | "toutes")}
          />
        </div>

        {list.length === 0 ? (
          <p className="mt-12 max-w-sm font-serif text-[1.05rem] leading-relaxed text-fg-muted">
            Rien sur cette étagère pour l’instant. Le premier titre est en{" "}
            <button
              type="button"
              className="text-fg underline decoration-border underline-offset-4 hover:decoration-accent"
              onClick={() => {
                setNiveau("4e");
                setMatiere("Histoire");
              }}
            >
              4e, Histoire
            </button>
            .
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
            {list.map((f) => (
              <li key={f.slug}>
                <BookCard feuilleton={f} progress={bookProgress(booksState, f.slug)} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-16 text-sm text-fg-muted">
          {CATALOG.filter((f) => f.available).length} titre
          {CATALOG.filter((f) => f.available).length > 1 ? "s" : ""} · 3e et 4e
          {" · "}
          <Link to="/atelier" className="underline-offset-4 hover:underline">
            Modèle Word
          </Link>
        </p>
      </main>
    </div>
  );
}

function FilterRow({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: { id: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
      <span className="w-16 shrink-0 font-display text-xs tracking-[0.18em] text-fg-muted uppercase">
        {label}
      </span>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={chipClass(value === item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function chipClass(active: boolean) {
  return [
    "font-display text-base underline-offset-4 transition-colors",
    active ? "text-fg underline decoration-accent" : "text-fg-muted hover:text-fg hover:underline",
  ].join(" ");
}

function BookCard({
  feuilleton: f,
  progress,
}: {
  feuilleton: (typeof CATALOG)[number];
  progress: { lastSlug: string | null; completed: number[] };
}) {
  const started = progress.completed.length > 0 || Boolean(progress.lastSlug);
  const ratio = f.evenings ? Math.min(1, progress.completed.length / f.evenings) : 0;

  return (
    <Link to="/livre/$book" params={{ book: f.slug }} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-ink shadow-[0_18px_40px_-24px_rgba(26,20,16,0.55)]">
        {f.cover ? (
          <img
            src={f.cover}
            alt={f.coverAlt}
            className="aspect-[2/3] w-full object-cover object-[center_42%] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-end bg-ink px-4 pb-5">
            <p className="font-display text-xl leading-tight font-semibold text-paper">{f.title}</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        {started ? (
          <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-ink/40">
            <div className="h-full bg-paper" style={{ width: `${Math.max(8, ratio * 100)}%` }} />
          </div>
        ) : null}
      </div>
      <p className="mt-3 font-display text-xs tracking-[0.18em] text-fg-muted uppercase">
        {f.niveau} · {f.matiere}
      </p>
      <h2 className="mt-1 font-display text-xl leading-tight font-semibold sm:text-2xl">
        {f.title}
      </h2>
      <p className="mt-1 font-serif text-sm text-fg-muted">
        {f.evenings} soirs · {f.minutes} min
        {started ? ` · ${progress.completed.length}/${f.evenings}` : ""}
      </p>
    </Link>
  );
}
