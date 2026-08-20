import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-fg">
      <div className="w-full max-w-sm">
        <p className="font-display text-sm tracking-[0.18em] text-fg-muted uppercase">
          Feuilletons
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold">Connexion</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          La lecture n’a pas besoin de compte. Tu peux t’identifier si tu
          veux garder une trace sur cet appareil.
        </p>
        <div className="mt-6 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm transition-colors hover:bg-bg"
              >
                Continuer avec {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-fg-muted">Connexion désactivée.</p>
          )}
        </div>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-fg-muted underline-offset-4 hover:underline"
        >
          Retour au livre
        </Link>
      </div>
    </main>
  );
}
