import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { loadBook } from "@/lib/catalog";
import { ReaderBar } from "@/components/reader-bar";
import { RichParagraphs } from "@/components/rich-text";

export const Route = createFileRoute("/livre/$book/fin")({
  component: Afterword,
  notFoundComponent: NotFoundBook,
});

function Afterword() {
  const { book: slug } = Route.useParams();
  const loaded = loadBook(slug);
  if (!loaded) throw notFound();
  const { meta, afterword, sources } = loaded;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ReaderBar title="Après la nouvelle" book={slug} />
      <article className="mx-auto w-full max-w-[40rem] px-5 pb-24 sm:px-8">
        {meta.afterImage ? (
          <figure className="mt-6 overflow-hidden rounded-xl">
            <img
              src={meta.afterImage}
              alt=""
              className="aspect-[16/9] w-full object-cover object-center"
            />
          </figure>
        ) : null}
        <header className="mt-8">
          <p className="font-display text-xs tracking-[0.22em] text-fg-muted uppercase">
            Après la nouvelle
          </p>
          <h1 className="mt-2 font-display text-[2.15rem] leading-[1.05] font-semibold tracking-tight sm:text-5xl">
            Le vrai et l’inventé
          </h1>
          <p className="mt-4 font-serif text-[1.08rem] leading-relaxed text-fg-muted">
            Les faits historiques, les éléments inventés et les mots utiles.
          </p>
        </header>

        {afterword.map((section) => (
          <section key={section.title} className="mt-12">
            <h2 className="font-display text-2xl font-semibold">{section.title}</h2>
            <RichParagraphs
              paragraphs={section.paragraphs}
              className="mt-4 font-serif text-[1.08rem] leading-[1.7] text-fg"
            />
          </section>
        ))}

        {sources.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">Sources principales</h2>
            <ul className="mt-4 space-y-2 text-[0.98rem] leading-relaxed">
              {sources.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg underline decoration-border underline-offset-4 hover:decoration-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {meta.hasMap ? (
            <Link
              to="/livre/$book/carte"
              params={{ book: slug }}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-fg px-5 font-display text-lg font-semibold text-bg"
            >
              Voir la carte
            </Link>
          ) : null}
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-lg px-2 font-display text-base text-fg-muted underline-offset-4 hover:text-fg hover:underline"
          >
            Retour à la bibliothèque
          </Link>
        </div>
      </article>
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
