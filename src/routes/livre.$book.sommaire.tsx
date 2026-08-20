import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { loadBook } from "@/lib/catalog";
import { bookProgress, useProgress } from "@/lib/progress";
import { ReaderBar } from "@/components/reader-bar";

export const Route = createFileRoute("/livre/$book/sommaire")({
  component: Sommaire,
  notFoundComponent: NotFoundBook,
});

function Sommaire() {
  const { book: slug } = Route.useParams();
  const loaded = loadBook(slug);
  if (!loaded) throw notFound();

  const { meta, episodes } = loaded;
  const books = useProgress((s) => s.books);
  const reset = useProgress((s) => s.reset);
  const { completed, lastSlug } = bookProgress(books, slug);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ReaderBar title="Sommaire" book={slug} />
      <main className="mx-auto w-full max-w-xl px-5 py-10 sm:px-8">
        <p className="font-display text-xs tracking-[0.22em] text-fg-muted uppercase">
          {meta.niveau} · {meta.matiere}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">{meta.title}</h1>
        <p className="mt-2 font-display text-lg text-fg-muted">
          {meta.evenings} soirs · environ {meta.minutes} minutes
        </p>
        <div className="mt-5 space-y-3 text-[1.02rem] leading-relaxed text-fg-muted">
          {meta.pact.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <ol className="mt-10 divide-y divide-border border-y border-border">
          {episodes.map((ep) => {
            const done = completed.includes(ep.id);
            const current = lastSlug === ep.slug;
            return (
              <li key={ep.slug}>
                <Link
                  to="/livre/$book/lire/$slug"
                  params={{ book: slug, slug: ep.slug }}
                  className="flex items-baseline gap-4 py-4 transition-colors hover:bg-surface/50"
                >
                  <span className="w-8 shrink-0 font-display text-xl text-accent tabular-nums">
                    {String(ep.id).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-semibold leading-tight">
                      {ep.title}
                    </span>
                    <span className="mt-1 block text-sm text-fg-muted">
                      {ep.place} · {ep.when} · {ep.minutes} min
                      {done ? " · lu" : current ? " · en cours" : ""}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              to="/livre/$book/fin"
              params={{ book: slug }}
              className="flex items-baseline gap-4 py-4 transition-colors hover:bg-surface/50"
            >
              <span className="w-8 shrink-0 font-display text-xl text-accent">*</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl font-semibold leading-tight">
                  Le vrai et l’inventé
                </span>
                <span className="mt-1 block text-sm text-fg-muted">
                  Après la nouvelle
                </span>
              </span>
            </Link>
          </li>
        </ol>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted">
          {meta.hasMap ? (
            <Link
              to="/livre/$book/carte"
              params={{ book: slug }}
              className="underline-offset-4 hover:text-fg hover:underline"
            >
              La carte
            </Link>
          ) : null}
          <Link
            to="/livre/$book"
            params={{ book: slug }}
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            Couverture
          </Link>
          <Link to="/" className="underline-offset-4 hover:text-fg hover:underline">
            Bibliothèque
          </Link>
          {slug === "le-prix-du-sucre" ? (
            <a
              href="/le-prix-du-sucre.txt"
              download="Le_prix_du_sucre.txt"
              className="underline-offset-4 hover:text-fg hover:underline"
            >
              Texte seul
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => reset(slug)}
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            Recommencer
          </button>
        </div>
      </main>
    </div>
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
