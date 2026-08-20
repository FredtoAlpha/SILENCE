import type { AfterSection, Episode } from "@/lib/book";
import { importedCatalog, loadImported } from "@/lib/content-books";

export type Niveau = "3e" | "4e";
export type Matiere = "Histoire" | "Géographie" | "EMC" | "Français";

export const NIVEAUX: Niveau[] = ["4e", "3e"];
export const MATIERES: Matiere[] = ["Histoire", "Géographie", "EMC", "Français"];

export type FeuilletonMeta = {
  slug: string;
  title: string;
  titleLines: [string, string] | [string];
  logline: string;
  pact: string[];
  niveau: Niveau;
  matiere: Matiere;
  evenings: number;
  minutes: number;
  cover: string;
  coverAlt: string;
  afterImage?: string;
  hasMap?: boolean;
  available: boolean;
};

export type LoadedBook = {
  meta: FeuilletonMeta;
  episodes: Episode[];
  afterword: AfterSection[];
  sources: { label: string; href: string }[];
};

export const CATALOG: FeuilletonMeta[] = importedCatalog();

export function getMeta(slug: string) {
  return CATALOG.find((f) => f.slug === slug);
}

export function loadBook(slug: string): LoadedBook | null {
  const meta = getMeta(slug);
  if (!meta || !meta.available) return null;
  const body = loadImported(slug);
  if (!body) return null;
  return { meta, ...body };
}

export function filterCatalog(opts: { niveau?: Niveau | "tous"; matiere?: Matiere | "toutes" }) {
  return CATALOG.filter((f) => {
    if (opts.niveau && opts.niveau !== "tous" && f.niveau !== opts.niveau) {
      return false;
    }
    if (opts.matiere && opts.matiere !== "toutes" && f.matiere !== opts.matiere) {
      return false;
    }
    return true;
  });
}

export function getEpisode(book: LoadedBook, slug: string) {
  return book.episodes.find((e) => e.slug === slug);
}

export function getNext(book: LoadedBook, slug: string) {
  const i = book.episodes.findIndex((e) => e.slug === slug);
  if (i < 0 || i >= book.episodes.length - 1) return null;
  return book.episodes[i + 1];
}
