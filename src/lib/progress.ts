import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeId = "paper" | "night";
export type FontScale = 0 | 1 | 2;

type BookProgress = {
  lastSlug: string | null;
  completed: number[];
};

type ProgressState = {
  theme: ThemeId;
  fontScale: FontScale;
  lastBook: string | null;
  books: Record<string, BookProgress>;
  setTheme: (theme: ThemeId) => void;
  setFontScale: (scale: FontScale) => void;
  markOpened: (book: string, slug: string, id: number) => void;
  markCompleted: (book: string, id: number) => void;
  reset: (book: string) => void;
};

const emptyBook = (): BookProgress => ({ lastSlug: null, completed: [] });

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

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      theme: "paper",
      fontScale: 1,
      lastBook: null,
      books: {},
      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
      markOpened: (book, slug) =>
        set((s) => {
          const prev = bookProgress(s.books, book);
          return {
            lastBook: book,
            books: {
              ...s.books,
              [book]: { ...prev, lastSlug: slug },
            },
          };
        }),
      markCompleted: (book, id) =>
        set((s) => {
          const prev = bookProgress(s.books, book);
          return {
            lastBook: book,
            books: {
              ...s.books,
              [book]: {
                ...prev,
                completed: prev.completed.includes(id)
                  ? prev.completed
                  : [...prev.completed, id].sort((a, b) => a - b),
              },
            },
          };
        }),
      reset: (book) =>
        set((s) => {
          const next = { ...s.books };
          delete next[book];
          return {
            books: next,
            lastBook: s.lastBook === book ? null : s.lastBook,
          };
        }),
    }),
    {
      name: "prix-du-sucre-progress",
      version: 2,
      migrate: (persisted, version) => {
        const p = persisted as Record<string, unknown>;
        if (version < 2) {
          const completed = Array.isArray(p.completed) ? (p.completed as number[]) : [];
          const lastSlug = typeof p.lastSlug === "string" ? p.lastSlug : null;
          return {
            theme: p.theme === "night" ? "night" : "paper",
            fontScale: p.fontScale === 0 || p.fontScale === 2 ? p.fontScale : 1,
            lastBook: completed.length || lastSlug ? "le-prix-du-sucre" : null,
            books:
              completed.length || lastSlug
                ? { "le-prix-du-sucre": { lastSlug, completed } }
                : {},
          };
        }
        return p as unknown as ProgressState;
      },
    },
  ),
);
