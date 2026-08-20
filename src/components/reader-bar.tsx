import { Link } from "@tanstack/react-router";
import { Library, Moon, Sun, Type, X } from "lucide-react";
import { useProgress, type FontScale } from "@/lib/progress";

export function ReaderBar({
  current,
  total,
  title,
  book,
}: {
  current?: number;
  total?: number;
  title?: string;
  book?: string;
}) {
  const theme = useProgress((s) => s.theme);
  const fontScale = useProgress((s) => s.fontScale);
  const setTheme = useProgress((s) => s.setTheme);
  const setFontScale = useProgress((s) => s.setFontScale);

  const cycleFont = () => {
    const next = ((fontScale + 1) % 3) as FontScale;
    setFontScale(next);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/70 bg-bg/90 px-3 backdrop-blur-md sm:px-5">
      {book ? (
        <Link
          to="/livre/$book"
          params={{ book }}
          className="flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg"
          aria-label="Fermer et revenir à la couverture"
        >
          <X className="size-5" strokeWidth={1.6} />
        </Link>
      ) : (
        <Link
          to="/"
          className="flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg"
          aria-label="Retour à la bibliothèque"
        >
          <Library className="size-5" strokeWidth={1.6} />
        </Link>
      )}

      <p className="min-w-0 flex-1 truncate text-center font-display text-sm tracking-wide text-fg-muted sm:text-base">
        {typeof current === "number" && typeof total === "number" ? (
          <>
            <span className="tabular-nums text-fg">
              {current} / {total}
            </span>
            {title ? <span className="hidden sm:inline"> · {title}</span> : null}
          </>
        ) : (
          title
        )}
      </p>

      <div className="flex items-center">
        <button
          type="button"
          onClick={cycleFont}
          className="flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg"
          aria-label="Changer la taille du texte"
        >
          <Type className="size-5" strokeWidth={1.6} />
        </button>
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
  );
}

export const FONT_CLASS: Record<FontScale, string> = {
  0: "text-[1.02rem] leading-[1.7] sm:text-[1.08rem]",
  1: "text-[1.12rem] leading-[1.72] sm:text-[1.2rem]",
  2: "text-[1.26rem] leading-[1.75] sm:text-[1.35rem]",
};
