export type ParsedEpisode = {
  id: number;
  title: string;
  slug: string;
  place: string;
  when: string;
  paragraphs: string[];
};

export type ParsedAfter = {
  title: string;
  paragraphs: string[];
};

export type ParsedFeuilleton = {
  title: string;
  logline: string;
  niveau: string | null;
  matiere: string | null;
  episodes: ParsedEpisode[];
  afterword: ParsedAfter[];
  warnings: string[];
};

export type ContentFile = { path: string; body: string };

const EPISODE_RE = /épisode\s*(\d+)\s*[—–\-]\s*(.+)/i;
const AFTER_RE = /après\s+la\s+nouvelle/i;
const MATIERE_RE = /\b(histoire|géographie|geographie|emc|français|francais|arts?\s*plastiques)\b/i;

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function decodeEntities(raw: string): string {
  return raw
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;|'/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTagsKeepEm(html: string): string {
  let s = html.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/(p|div|h[1-6]|li)>/gi, "\n");
  s = s.replace(/<em>|<i>/gi, "*").replace(/<\/em>|<\/i>/gi, "*");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  s = s.replace(/\u00a0/g, " ");
  s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  s = s.replace(/[ \t]{2,}/g, " ");
  return s.trim();
}

function splitPlaceWhen(heading: string): { place: string; when: string } {
  const t = heading.replace(/^[*_]+|[*_]+$/g, "").trim();
  const year = t.match(/,?\s*((?:1[7-9]|20)\d{2})\s*$/);
  if (year && year.index !== undefined) {
    const place = t.slice(0, year.index).replace(/,\s*$/, "").trim();
    return { place: place || t, when: year[1] };
  }
  const comma = t.indexOf(",");
  if (comma > 0) {
    return {
      place: t.slice(0, comma).trim(),
      when: t.slice(comma + 1).trim(),
    };
  }
  return { place: t, when: "" };
}

type Block =
  | { kind: "h1"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string };

function tokenize(html: string): Block[] {
  const clean = html.replace(/<img[^>]*>/gi, "");
  const blocks: Block[] = [];
  const re = /<(h1|h2|h3|p)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean))) {
    const tag = m[1].toLowerCase();
    const text = stripTagsKeepEm(m[3]);
    if (!text) continue;
    if (tag === "h1") blocks.push({ kind: "h1", text });
    else if (tag === "h2") blocks.push({ kind: "h2", text });
    else if (tag === "h3") blocks.push({ kind: "h3", text });
    else blocks.push({ kind: "p", text });
  }
  return blocks;
}

function titleCaseFromHeading(text: string): string {
  const t = text.replace(/\s+/g, " ").replace(/[*]/g, "").trim();
  const letters = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
  const isAllCaps = letters.length > 0 && letters === letters.toUpperCase();
  if (isAllCaps) {
    const lower = t.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return t;
}

function parseFiche(preamble: string[]): {
  titre?: string;
  niveau?: string;
  matiere?: string;
  accroche?: string;
} {
  const out: {
    titre?: string;
    niveau?: string;
    matiere?: string;
    accroche?: string;
  } = {};
  for (const raw of preamble) {
    const m = raw.match(/^(titre|niveau|mati[eè]re|accroche)\s*[:–—]\s*(.+)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
    const value = m[2].replace(/[*]/g, "").trim();
    if (key === "titre") out.titre = value;
    else if (key === "niveau") {
      const n = value.match(/([3-6])/);
      if (n) out.niveau = `${n[1]}e`;
    } else if (key === "matiere") out.matiere = capitalizeMatiere(value);
    else if (key === "accroche") out.accroche = value;
  }
  return out;
}

export function parseFeuilletonHtml(html: string, filename = ""): ParsedFeuilleton {
  const warnings: string[] = [];
  const blocks = tokenize(html);
  const preamble: string[] = [];
  const episodes: ParsedEpisode[] = [];
  const afterword: ParsedAfter[] = [];

  let mode: "pre" | "ep" | "after" = "pre";
  let currentEp: ParsedEpisode | null = null;
  let currentAfter: ParsedAfter | null = null;

  const flushEp = () => {
    if (currentEp) episodes.push(currentEp);
    currentEp = null;
  };
  const flushAfter = () => {
    if (currentAfter?.paragraphs.length) afterword.push(currentAfter);
    currentAfter = null;
  };

  for (const b of blocks) {
    if (b.kind === "h1" || (b.kind === "p" && EPISODE_RE.test(b.text))) {
      const afterHit = AFTER_RE.test(b.text);
      const epHit = b.text.match(EPISODE_RE);
      if (afterHit) {
        flushEp();
        flushAfter();
        mode = "after";
        currentAfter = {
          title: stripTagsKeepEm(b.text).replace(/^[*]+|[*]+$/g, ""),
          paragraphs: [],
        };
        continue;
      }
      if (epHit) {
        flushEp();
        flushAfter();
        mode = "ep";
        const id = Number(epHit[1]);
        const rawTitle = epHit[2].replace(/[*]/g, "").trim();
        currentEp = {
          id,
          title: titleCaseFromHeading(rawTitle),
          slug: slugify(rawTitle),
          place: "",
          when: "",
          paragraphs: [],
        };
        continue;
      }
    }

    if (mode === "pre") {
      preamble.push(b.text);
      continue;
    }

    if (mode === "ep" && currentEp) {
      if (b.kind === "h2" && !currentEp.place && currentEp.paragraphs.length === 0) {
        const { place, when } = splitPlaceWhen(b.text);
        currentEp.place = place;
        currentEp.when = when;
        continue;
      }
      currentEp.paragraphs.push(b.text);
      continue;
    }

    if (mode === "after") {
      if (b.kind === "h2") {
        flushAfter();
        currentAfter = { title: b.text.replace(/^[*]+|[*]+$/g, ""), paragraphs: [] };
        continue;
      }
      if (!currentAfter) {
        currentAfter = { title: "Notes", paragraphs: [] };
      }
      currentAfter.paragraphs.push(b.text);
    }
  }
  flushEp();
  flushAfter();

  const preambleText = preamble.join("\n");
  const fiche = parseFiche(preamble);

  const niveauMatch = fiche.niveau || preambleText.match(/\b([3-6])(?:e|ème)\b/i)?.[1];
  const matiereMatch = fiche.matiere || preambleText.match(MATIERE_RE)?.[1];
  const niveau = fiche.niveau
    ? fiche.niveau
    : niveauMatch
      ? String(niveauMatch)
          .replace(/ème/i, "e")
          .replace(/^(\d)$/, "$1e")
      : null;

  let title = fiche.titre || "";
  const fileBase = filename.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ");
  const strongTitle = preamble.find(
    (p) =>
      p.length > 8 &&
      p.length < 80 &&
      !/nouvelle historique|épisode|classe de|^(titre|niveau|matière|matiere|accroche)\s*:/i.test(
        p,
      ),
  );
  if (!title && strongTitle && !/six épisodes/i.test(strongTitle)) {
    title = strongTitle.replace(/[*]/g, "").trim();
  }
  if (!title && fileBase) {
    title = fileBase
      .replace(/nouvelle\s*4e/i, "")
      .replace(/\s+/g, " ")
      .trim();
    title = titleCaseFromHeading(title);
  }
  if (!title && episodes[0]) title = episodes[0].title;

  const logline =
    fiche.accroche ||
    preamble
      .find((p) => /minute|soir|épisode/i.test(p))
      ?.replace(/[*]/g, "")
      .trim() ||
    "";

  if (episodes.length === 0) {
    warnings.push("Aucun épisode trouvé. Dans Word, utilise Titre 1 : « ÉPISODE 1 — Titre ».");
  }
  for (const ep of episodes) {
    if (ep.paragraphs.length < 3) {
      warnings.push(`L’épisode ${ep.id} (« ${ep.title} ») a trop peu de texte.`);
    }
    if (!ep.place) {
      warnings.push(
        `L’épisode ${ep.id} n’a pas de lieu. Sous le titre, mets un Titre 2 : « Bordeaux, 1768 ».`,
      );
    }
  }
  if (afterword.length === 0) {
    warnings.push(
      "Pas de partie « Après la nouvelle ». Utile pour dire ce qui est vrai et ce qui est inventé.",
    );
  }

  return {
    title,
    logline,
    niveau,
    matiere: fiche.matiere || (matiereMatch ? capitalizeMatiere(matiereMatch) : null),
    episodes,
    afterword,
    warnings,
  };
}

function capitalizeMatiere(raw: string): string {
  const n = raw.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  if (n.startsWith("hist")) return "Histoire";
  if (n.startsWith("geo")) return "Géographie";
  if (n === "emc") return "EMC";
  if (n.startsWith("fran")) return "Français";
  return raw;
}

export function toContentFiles(
  parsed: ParsedFeuilleton,
  opts?: { niveau?: string; matiere?: string; cover?: string },
): ContentFile[] {
  const niveau = (opts?.niveau || parsed.niveau || "4e").toLowerCase();
  const matiereSlug = slugify(opts?.matiere || parsed.matiere || "histoire");
  const bookSlug = slugify(parsed.title) || "feuilleton";
  const root = `${niveau}/${matiereSlug}/${bookSlug}`;

  const info = [
    `titre: ${parsed.title}`,
    `niveau: ${niveau}`,
    `matière: ${opts?.matiere || parsed.matiere || "Histoire"}`,
    `accroche: ${parsed.logline}`,
    `épisodes: ${parsed.episodes.length}`,
    opts?.cover ? `couverture: ${opts.cover}` : "",
    "",
  ]
    .filter((line, i, arr) => line !== "" || i === arr.length - 1)
    .join("\n");

  const files: ContentFile[] = [{ path: `${root}/info.txt`, body: info }];

  for (const ep of parsed.episodes) {
    const n = String(ep.id).padStart(2, "0");
    const body = [
      ep.title,
      "",
      [ep.place, ep.when].filter(Boolean).join(", "),
      "",
      ...ep.paragraphs.flatMap((p) => [p, ""]),
    ].join("\n");
    files.push({ path: `${root}/${n}-${ep.slug}.txt`, body });
  }

  if (parsed.afterword.length) {
    const body = parsed.afterword
      .flatMap((s) => [`# ${s.title}`, "", ...s.paragraphs.flatMap((p) => [p, ""]), ""])
      .join("\n");
    files.push({ path: `${root}/vrai-et-invente.txt`, body });
  }

  return files;
}

export function toSingleTxt(parsed: ParsedFeuilleton): string {
  const lines: string[] = [parsed.title.toUpperCase(), parsed.logline, ""];
  for (const ep of parsed.episodes) {
    lines.push("");
    lines.push(`ÉPISODE ${ep.id} — ${ep.title.toUpperCase()}`);
    lines.push("");
    lines.push([ep.place, ep.when].filter(Boolean).join(", "));
    lines.push("");
    for (const p of ep.paragraphs) {
      lines.push(p);
      lines.push("");
    }
  }
  if (parsed.afterword.length) {
    lines.push("");
    lines.push("APRÈS LA NOUVELLE — LE VRAI ET L’INVENTÉ");
    lines.push("");
    for (const s of parsed.afterword) {
      lines.push(s.title);
      lines.push("");
      for (const p of s.paragraphs) {
        lines.push(p);
        lines.push("");
      }
    }
  }
  return lines.join("\n").trim() + "\n";
}
