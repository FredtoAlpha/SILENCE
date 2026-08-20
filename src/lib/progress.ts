import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeId = "paper" | "night";
export type FontScale = 0 | 1 | 2;

export type BookProgress = {
  lastSlug: string | null;
  completed: number[];
};

export type ProgressSnapshot = {
  theme: ThemeId;
  fontScale: FontScale;
  lastBook: string | null;
  books: Record<string, BookProgress>;
};

type ProgressState = ProgressSnapshot & {
  setTheme: (theme: ThemeId) => void;
  setFontScale: (scale: FontScale) => void;
  markOpened: (book: string, slug: string, id: number) => void;
  markCompleted: (book: string, id: number) => void;
  reset: (book: string) => void;
  replace: (progress: unknown) => void;
};

const emptyBook = (): BookProgress => ({ lastSlug: null, completed: [] });

export function emptyProgress(): ProgressSnapshot {
  return { theme: "paper", fontScale: 1, lastBook: null, books: {} };
}

export function bookProgress(
  books: Record<string, BookProgress> | undefined,
  slug: string,
): BookProgress {
  const b = books?.[slug];
  return {
    lastSlug: typeof b?.lastSlug === "string" ? b.lastSlug : null,
    completed: Array.isArray(b?.completed) ? b.completed : [],
  };
}

export function sanitizeProgress(progress: unknown): ProgressSnapshot {
  if (!progress || typeof progress !== "object") return emptyProgress();
  const raw = progress as Record<string, unknown>;
  const books: Record<string, BookProgress> = {};
  if (raw.books && typeof raw.books === "object") {
    for (const [slug, value] of Object.entries(raw.books).slice(0, 100)) {
      if (!/^[a-z0-9-]{1,80}$/.test(slug) || !value || typeof value !== "object") {
        continue;
      }
      const item = value as Record<string, unknown>;
      const completed = Array.isArray(item.completed)
        ? [...new Set(item.completed.filter((id) => Number.isInteger(id) && id > 0 && id <= 200))]
            .slice(0, 200)
            .sort((a, b) => a - b)
        : [];
      books[slug] = {
        lastSlug:
          typeof item.lastSlug === "string" && /^[a-z0-9-]{1,80}$/.test(item.lastSlug)
            ? item.lastSlug
            : null,
        completed,
      };
    }
  }
  return {
    theme: raw.theme === "night" ? "night" : "paper",
    fontScale: raw.fontScale === 0 || raw.fontScale === 2 ? raw.fontScale : 1,
    lastBook:
      typeof raw.lastBook === "string" && Object.hasOwn(books, raw.lastBook) ? raw.lastBook : null,
    books,
  };
}

export function progressSnapshot(state: ProgressState): ProgressSnapshot {
  return sanitizeProgress(state);
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...emptyProgress(),
      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
      markOpened: (book, slug) =>
        set((state) => {
          const previous = bookProgress(state.books, book);
          return {
            lastBook: book,
            books: {
              ...state.books,
              [book]: { ...previous, lastSlug: slug },
            },
          };
        }),
      markCompleted: (book, id) =>
        set((state) => {
          const previous = bookProgress(state.books, book);
          return {
            lastBook: book,
            books: {
              ...state.books,
              [book]: {
                ...previous,
                completed: previous.completed.includes(id)
                  ? previous.completed
                  : [...previous.completed, id].sort((a, b) => a - b),
              },
            },
          };
        }),
      reset: (book) =>
        set((state) => {
          const books = { ...state.books };
          delete books[book];
          return {
            books,
            lastBook: state.lastBook === book ? null : state.lastBook,
          };
        }),
      replace: (progress) => set(sanitizeProgress(progress)),
    }),
    {
      name: "silence-reading-progress",
      version: 3,
      migrate: (persisted, version) => {
        const previous = persisted as Record<string, unknown>;
        if (version < 2) {
          const completed = Array.isArray(previous.completed)
            ? (previous.completed as number[])
            : [];
          const lastSlug = typeof previous.lastSlug === "string" ? previous.lastSlug : null;
          return sanitizeProgress({
            theme: previous.theme,
            fontScale: previous.fontScale,
            lastBook: completed.length || lastSlug ? "le-prix-du-sucre" : null,
            books:
              completed.length || lastSlug ? { "le-prix-du-sucre": { lastSlug, completed } } : {},
          });
        }
        return sanitizeProgress(previous);
      },
    },
  ),
);
