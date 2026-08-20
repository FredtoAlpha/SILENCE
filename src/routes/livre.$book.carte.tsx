import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { loadBook } from "@/lib/catalog";
import { ReaderBar } from "@/components/reader-bar";

export const Route = createFileRoute("/livre/$book/carte")({
  component: Carte,
  notFoundComponent: NotFoundBook,
});

function Carte() {
  const { book: slug } = Route.useParams();
  const loaded = loadBook(slug);
  if (!loaded || !loaded.meta.hasMap) throw notFound();

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ReaderBar title="La carte" book={slug} />
      <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-4xl font-semibold">Deux routes, un sucre</h1>
        <p className="mt-3 max-w-prose font-serif text-[1.05rem] leading-relaxed text-fg-muted">
          Le <em>Comte de Vergennes</em> va droit aux Antilles. Le{" "}
          <em>Saint-André</em> descend vers l’Afrique, puis traverse. Au retour,
          les deux cales portent la même marchandise.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface p-3 sm:p-5">
          <AtlanticMap />
        </div>

        <ul className="mt-8 space-y-4 font-serif text-[1.02rem] leading-relaxed">
          <li>
            <span className="font-display font-semibold text-accent">La droiture.</span>{" "}
            Bordeaux → Saint-Domingue → Bordeaux. Farine, vin, planches à l’aller.
            Sucre, café, indigo au retour.
          </li>
          <li>
            <span className="font-display font-semibold text-accent">La traite.</span>{" "}
            Bordeaux → Juda (Ouidah) → Saint-Domingue → Bordeaux. Fusils, fer,
            cauris, alcool contre des captifs. Puis le même sucre.
          </li>
        </ul>

        <Link
          to="/livre/$book/sommaire"
          params={{ book: slug }}
          className="mt-10 inline-block font-display text-fg-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Retour au sommaire
        </Link>
      </main>
    </div>
  );
}

function AtlanticMap() {
  return (
    <svg
      viewBox="0 0 640 360"
      role="img"
      aria-label="Carte de l’Atlantique : Bordeaux, Juda, Saint-Domingue."
      className="h-auto w-full"
    >
      <rect width="640" height="360" fill="#e7dcc6" />
      <text
        x="320"
        y="36"
        textAnchor="middle"
        fill="#6d5f52"
        fontFamily="Cormorant Garamond, serif"
        fontSize="13"
        letterSpacing="2"
      >
        OCÉAN ATLANTIQUE · 1768
      </text>
      <path
        d="M470 50 C500 80 520 140 545 210 C560 255 575 300 560 340 L640 340 L640 50 Z"
        fill="#c9b89a"
      />
      <path
        d="M430 210 C450 230 470 270 455 330 L400 340 C390 280 400 230 430 210 Z"
        fill="#c9b89a"
      />
      <path
        d="M70 70 C120 60 150 90 130 140 C110 175 40 170 30 130 C25 100 45 75 70 70 Z"
        fill="#c9b89a"
      />
      <path
        d="M40 175 C90 180 95 230 70 250 C45 265 20 230 40 175 Z"
        fill="#c9b89a"
      />
      <path
        d="M505 96 C380 70 220 90 108 155"
        fill="none"
        stroke="#1a1410"
        strokeWidth="1.6"
        strokeDasharray="5 4"
      />
      <path
        d="M505 96 C470 150 455 200 448 248"
        fill="none"
        stroke="#6e2430"
        strokeWidth="1.6"
        strokeDasharray="2 5"
      />
      <path
        d="M448 248 C320 230 200 190 108 155"
        fill="none"
        stroke="#6e2430"
        strokeWidth="1.6"
        strokeDasharray="2 5"
      />
      <Dot x={505} y={96} label="Bordeaux" align="right" />
      <Dot x={448} y={248} label="Juda" align="right" />
      <Dot x={108} y={155} label="Saint-Domingue" align="left" />
      <g fontFamily="Source Serif 4, serif" fontSize="11" fill="#6d5f52">
        <line
          x1="40"
          y1="318"
          x2="68"
          y2="318"
          stroke="#1a1410"
          strokeWidth="1.6"
          strokeDasharray="5 4"
        />
        <text x="76" y="322">
          droiture
        </text>
        <line
          x1="160"
          y1="318"
          x2="188"
          y2="318"
          stroke="#6e2430"
          strokeWidth="1.6"
          strokeDasharray="2 5"
        />
        <text x="196" y="322">
          traite
        </text>
      </g>
    </svg>
  );
}

function Dot({
  x,
  y,
  label,
  align,
}: {
  x: number;
  y: number;
  label: string;
  align: "left" | "right";
}) {
  const tx = align === "right" ? x + 10 : x - 10;
  return (
    <g>
      <circle cx={x} cy={y} r="5" fill="#6e2430" />
      <circle cx={x} cy={y} r="2" fill="#f3ead9" />
      <text
        x={tx}
        y={y + 4}
        textAnchor={align === "right" ? "start" : "end"}
        fill="#1a1410"
        fontFamily="Cormorant Garamond, serif"
        fontSize="13"
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

function NotFoundBook() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div>
        <h1 className="font-display text-3xl font-semibold">Carte introuvable</h1>
        <Link to="/" className="mt-4 inline-block text-fg-muted underline">
          Retour à la bibliothèque
        </Link>
      </div>
    </main>
  );
}
