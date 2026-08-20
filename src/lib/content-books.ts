import type { AfterSection, Episode } from "@/lib/book";
import type { FeuilletonMeta, LoadedBook, Matiere, Niveau } from "@/lib/catalog";
import { slugify } from "@/lib/parse-feuilleton";

const files = import.meta.glob("../../content/**/*.txt", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function titleLines(title: string): [string] | [string, string] {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 2) return [title];
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

function asNiveau(raw: string | undefined): Niveau {
  return raw?.replace(/ème/i, "e").toLowerCase() === "3e" ? "3e" : "4e";
}

function asMatiere(raw: string | undefined): Matiere {
  const n = (raw ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  if (n.startsWith("geo")) return "Géographie";
  if (n === "emc") return "EMC";
  if (n.startsWith("fran")) return "Français";
  return "Histoire";
}

function parseInfo(body: string) {
  const map: Record<string, string> = {};
  for (const line of body.split("\n")) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (m) map[m[1].trim().toLowerCase()] = m[2].trim();
  }
  return map;
}

function parseEpisodeFile(filename: string, body: string): Episode {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const title = (lines[0] ?? "").trim() || filename;
  let i = 1;
  while (i < lines.length && !lines[i].trim()) i++;
  const placeWhen = (lines[i] ?? "").trim();
  i++;
  const rest = lines.slice(i).join("\n").trim();
  const paragraphs = rest
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
  const year = placeWhen.match(/,?\s*((?:1[7-9]|20)\d{2}|.+)$/);
  const comma = placeWhen.indexOf(",");
  const place =
    comma > 0 ? placeWhen.slice(0, comma).trim() : placeWhen.replace(/,?\s*\d{4}$/, "").trim();
  const when =
    comma > 0 ? placeWhen.slice(comma + 1).trim() : year ? year[1] : "";
  const idMatch = filename.match(/(\d+)/);
  const words = paragraphs.join(" ").split(/\s+/).length;
  return {
    id: idMatch ? Number(idMatch[1]) : 1,
    slug: slugify(title),
    title,
    place,
    when,
    minutes: Math.max(8, Math.min(14, Math.round(words / 160) || 10)),
    image: "",
    paragraphs,
  };
}

function parseAfter(body: string): AfterSection[] {
  const sections: AfterSection[] = [];
  const chunks = body.replace(/\r\n/g, "\n").split(/^# /m);
  for (const chunk of chunks) {
    const t = chunk.trim();
    if (!t) continue;
    const lines = t.split("\n");
    const title = (lines.shift() ?? "Notes").trim();
    const paragraphs = lines
      .join("\n")
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\n/g, " ").trim())
      .filter(Boolean);
    sections.push({ title, paragraphs });
  }
  return sections;
}

type Folder = {
  dir: string;
  info?: string;
  episodes: { name: string; body: string }[];
  after?: string;
};

function groupFiles(): Folder[] {
  const folders = new Map<string, Folder>();
  for (const [key, body] of Object.entries(files)) {
    const name = key.split("/").pop() ?? "";
    const dir = key.slice(0, key.length - name.length);
    let folder = folders.get(dir);
    if (!folder) {
      folder = { dir, episodes: [] };
      folders.set(dir, folder);
    }
    if (name === "info.txt") folder.info = body;
    else if (name === "vrai-et-invente.txt") folder.after = body;
    else folder.episodes.push({ name, body });
  }
  return [...folders.values()].filter((f) => f.info);
}

export function importedCatalog(): FeuilletonMeta[] {
  return groupFiles().map((folder) => {
    const info = parseInfo(folder.info ?? "");
    const title = info.titre || "Sans titre";
    const cover = info.couverture || "";
    return {
      slug: slugify(title),
      title,
      titleLines: titleLines(title),
      logline: info.accroche || "",
      pact: [
        "Cette histoire se lit en plusieurs soirs. Environ dix minutes à chaque fois.",
        "Elle mélange des faits réels et des personnages inventés. À la fin, tu sauras lesquels.",
      ],
      niveau: asNiveau(info.niveau),
      matiere: asMatiere(info.matière || info.matiere),
      evenings: folder.episodes.length || Number(info.épisodes) || 6,
      minutes: 10,
      cover,
      coverAlt: title,
      available: folder.episodes.length > 0,
    };
  });
}

export function loadImported(slug: string): Omit<LoadedBook, "meta"> | null {
  for (const folder of groupFiles()) {
    const info = parseInfo(folder.info ?? "");
    if (slugify(info.titre || "") !== slug) continue;
    const episodes = folder.episodes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((f) => parseEpisodeFile(f.name, f.body));
    return {
      episodes,
      afterword: folder.after ? parseAfter(folder.after) : [],
      sources: [],
    };
  }
  return null;
}
