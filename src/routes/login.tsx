import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useReaderProfile } from "@/components/reader-profile-provider";

export const Route = createFileRoute("/login")({ component: ReaderLogin });

function ReaderLogin() {
  const navigate = useNavigate();
  const { handle, loading, open, changeReader } = useReaderProfile();
  const [value, setValue] = useState(handle ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await open(value);
      await navigate({ to: "/" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Identifiant impossible à ouvrir.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 py-12 text-fg">
      <div className="w-full max-w-sm">
        <p className="font-display text-sm tracking-[0.18em] text-fg-muted uppercase">
          Feuilletons
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-semibold">
          Retrouver ma bibliothèque
        </h1>
        <p className="mt-3 font-serif text-[1.05rem] leading-relaxed text-fg-muted">
          Tape toujours le même identifiant. Il est créé automatiquement la première fois.
        </p>

        {handle ? (
          <div className="mt-6 rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-fg-muted">Lecteur actuel</p>
            <p className="mt-1 font-display text-lg font-semibold">{handle}</p>
            <button
              type="button"
              onClick={() => {
                changeReader();
                setValue("");
              }}
              className="mt-3 text-sm text-fg-muted underline decoration-border underline-offset-4 hover:text-fg"
            >
              Changer de lecteur
            </button>
          </div>
        ) : null}

        {!handle ? (
          <form onSubmit={submit} className="mt-7">
            <label htmlFor="reader-handle" className="font-display text-sm font-semibold">
              Ton identifiant
            </label>
            <input
              id="reader-handle"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="4e1.marie.dup"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              disabled={loading || submitting}
              className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-4 font-mono text-base text-fg outline-none transition-colors placeholder:text-fg-muted/60 focus:border-accent"
            />
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              classe.prénom.3 premières lettres du nom
              <br />
              Exemple : <span className="font-mono text-fg">4e1.marie.dup</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Aucun mot de passe. Sur un autre ordinateur, retape simplement le même identifiant.
            </p>

            {error ? (
              <p role="alert" className="mt-4 text-sm leading-relaxed text-accent">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading || submitting || !value.trim()}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-fg px-5 font-display text-lg font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-45"
            >
              {submitting ? "Ouverture…" : "Ouvrir ma bibliothèque"}
            </button>
          </form>
        ) : null}

        <p className="mt-4 text-sm text-fg-muted">
          En cas de doublon, ajoute un chiffre à la fin :{" "}
          <span className="font-mono text-fg">4e1.marie.dup2</span>
        </p>

        <Link
          to="/"
          className="mt-7 inline-block text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Retour à la bibliothèque
        </Link>
      </div>
    </main>
  );
}
