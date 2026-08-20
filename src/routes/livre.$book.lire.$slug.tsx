import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { getEpisode, getNext, loadBook } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import { FONT_CLASS, ReaderBar } from "@/components/reader-bar";
import { RichParagraphs } from "@/components/rich-text";

export const Route = createFileRoute("/livre/$book/lire/$slug")({
  component: EpisodePage,
  notFoundComponent: NotFoundEpisode,
});

function EpisodePage() {
  const { book: bookSlug, slug } = Route.useParams();
  const book = loadBook(bookSlug);
  if (!book) throw notFound();
  const episode = getEpisode(book, slug);
  if (!episode) throw notFound();

  const next = getNext(book, slug);
  const markOpened = useProgress((s) => s.markOpened);
  const markCompleted = useProgress((s) => s.markCompleted);
  const fontScale = useProgress((s) => s.fontScale);

  useEffect(() => {
    markOpened(bookSlug, episode.slug, episode.id);
    window.scrollTo(0, 0);
  }, [bookSlug, episode.slug, episode.id, markOpened]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      if (max > 0 && el.scrollTop / max > 0.82) markCompleted(bookSlug, episode.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [bookSlug, episode.id, markCompleted]);

  const progress = ((episode.id - 1) / book.episodes.length) * 100;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div
        className="pointer-events-none fixed top-0 right-0 left-0 z-40 h-[2px] bg-border"
        aria-hidden
      >
        <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
      <ReaderBar
        current={episode.id}
        total={book.episodes.length}
        title={episode.title}
        book={bookSlug}
      />

      <article className="mx-auto w-full max-w-[40rem] px-5 pb-24 sm:px-8">
        {episode.image ? (
          <figure className="mt-6 overflow-hidden rounded-xl">
            <img src={episode.image} alt="" className="aspect-[16/9] w-full object-cover" />
          </figure>
        ) : null}

        <header className="mt-8">
          <p className="font-display text-xs tracking-[0.22em] text-fg-muted uppercase">
            Épisode {episode.id} · {episode.minutes} min
          </p>
          <h1 className="mt-2 font-display text-[2.15rem] leading-[1.05] font-semibold tracking-tight sm:text-5xl">
            {episode.title}
          </h1>
          <p className="mt-3 font-display text-base text-fg-muted italic">
            {episode.place}
            <span className="mx-2 text-border">·</span>
            {episode.when}
          </p>
        </header>

        <RichParagraphs
          paragraphs={episode.paragraphs}
          className={`mt-8 font-serif text-fg ${FONT_CLASS[fontScale]}`}
        />

        <footer className="mt-16 border-t border-border pt-8">
          <p className="font-display text-sm tracking-wide text-fg-muted">
            Fin de l’épisode {episode.id}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {next ? (
              <Link
                to="/livre/$book/lire/$slug"
                params={{ book: bookSlug, slug: next.slug }}
                onClick={() => markCompleted(bookSlug, episode.id)}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-fg px-5 font-display text-lg font-semibold text-bg transition-opacity hover:opacity-90"
              >
                Continuer · {next.title}
              </Link>
            ) : (
              <Link
                to="/livre/$book/fin"
                params={{ book: bookSlug }}
                onClick={() => markCompleted(bookSlug, episode.id)}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-fg px-5 font-display text-lg font-semibold text-bg transition-opacity hover:opacity-90"
              >
                Le vrai et l’inventé
              </Link>
            )}
            <Link
              to="/livre/$book/sommaire"
              params={{ book: bookSlug }}
              className="inline-flex h-12 items-center justify-center rounded-lg px-2 font-display text-base text-fg-muted underline-offset-4 hover:text-fg hover:underline"
            >
              S’arrêter ici
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

function NotFoundEpisode() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div>
        <h1 className="font-display text-3xl font-semibold">Épisode introuvable</h1>
        <Link to="/" className="mt-4 inline-block text-fg-muted underline">
          Retour à la bibliothèque
        </Link>
      </div>
    </main>
  );
}
