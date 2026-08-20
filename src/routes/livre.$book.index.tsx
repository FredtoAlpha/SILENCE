import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { loadBook } from "@/lib/catalog";
import { bookProgress, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/livre/$book/")({
  component: BookCover,
  notFoundComponent: NotFoundBook,
});

function BookCover() {
  const { book: slug } = Route.useParams();
  const loaded = loadBook(slug);
  if (!loaded) throw notFound();

  const { meta, episodes } = loaded;
  const books = useProgress((s) => s.books);
  const { lastSlug, completed } = bookProgress(books, slug);
  const resume = lastSlug ? episodes.find((e) => e.slug === lastSlug) : null;
  const firstUnread = episodes.find((e) => !completed.includes(e.id)) ?? episodes[0];
  const cta = resume ?? firstUnread;
  const started = completed.length > 0 || Boolean(lastSlug);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink text-paper">
      {meta.cover ? (
        <img
          src={meta.cover}
          alt={meta.coverAlt}
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-end px-6 pb-10 pt-16 sm:px-8 sm:pb-14">
        <Link
          to="/"
          className="absolute top-6 left-6 font-display text-xs tracking-[0.22em] text-paper/65 uppercase underline-offset-4 hover:text-paper hover:underline sm:top-8 sm:left-8"
        >
          Bibliothèque
        </Link>
        <p className="font-display text-[0.72rem] tracking-[0.28em] text-paper/70 uppercase">
          {meta.niveau} · {meta.matiere}
        </p>
        <h1 className="mt-3 font-display text-[2.6rem] leading-[0.95] font-semibold tracking-tight sm:text-6xl">
          {meta.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-4 max-w-sm font-serif text-[1.05rem] leading-relaxed text-paper/80">
          {meta.logline}
        </p>
        <p className="mt-3 font-display text-sm tracking-wide text-paper/55">
          {meta.evenings} soirs · environ {meta.minutes} minutes
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/livre/$book/lire/$slug"
            params={{ book: slug, slug: cta.slug }}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-paper px-6 font-display text-lg font-semibold tracking-wide text-ink transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {started ? "Reprendre la lecture" : "Ouvrir le livre"}
          </Link>
          <Link
            to="/livre/$book/sommaire"
            params={{ book: slug }}
            className="inline-flex h-12 items-center justify-center rounded-lg px-2 font-display text-base text-paper/75 underline-offset-4 hover:text-paper hover:underline"
          >
            Sommaire
          </Link>
        </div>
      </div>
    </main>
  );
}

function NotFoundBook() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div>
        <h1 className="font-display text-3xl font-semibold">Livre introuvable</h1>
        <Link to="/" className="mt-4 inline-block text-fg-muted underline">
          Retour à la bibliothèque
        </Link>
      </div>
    </main>
  );
}
