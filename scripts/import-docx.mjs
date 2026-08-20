#!/usr/bin/env node
/**
 * Convertit un .docx de feuilleton en dossier texte.
 *
 *   node scripts/import-docx.mjs inbox/4e/histoire/mon-livre.docx
 *   node scripts/import-docx.mjs --inbox
 *
 * Le dossier inbox/4e/histoire/ (ou 3e, geographie, emc, francais)
 * classe le livre. La fiche en tête du Word (Titre, Niveau, Matière, Accroche)
 * complète si le fichier est déposé à la racine de inbox/.
 */
import fs from "node:fs";
import path from "node:path";
import mammoth from "mammoth";
import { parseFeuilletonHtml, slugify, toContentFiles } from "../src/lib/parse-feuilleton.ts";

const INBOX = "inbox";
const args = process.argv.slice(2).filter((a) => a !== "--");
const outIdx = args.indexOf("--out");
const outRoot = outIdx >= 0 ? args[outIdx + 1] : "content";
const useInbox = args.includes("--inbox");

function walkDocx(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith("_") || name.startsWith(".")) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkDocx(p, acc);
    else if (/\.docx$/i.test(name)) acc.push(p);
  }
  return acc;
}

function classFromPath(file) {
  const rel = path.relative(INBOX, file);
  if (rel.startsWith("..")) return {};
  const parts = rel.split(path.sep);
  if (parts.length < 3) return {};
  const niveauRaw = parts[0].toLowerCase();
  const matiereRaw = parts[1].toLowerCase();
  const niveau = niveauRaw === "3e" || niveauRaw === "4e" ? niveauRaw : undefined;
  const matiereMap = {
    histoire: "Histoire",
    geographie: "Géographie",
    géographie: "Géographie",
    emc: "EMC",
    francais: "Français",
    français: "Français",
  };
  return { niveau, matiere: matiereMap[matiereRaw] };
}

function copySidecar(file, bookSlug) {
  const dir = path.dirname(file);
  const base = path.basename(file).replace(/\.docx$/i, "");
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const src = path.join(dir, base + ext);
    if (!fs.existsSync(src)) continue;
    const destDir = path.join("public", "art");
    fs.mkdirSync(destDir, { recursive: true });
    const destName = `${bookSlug}${ext === ".jpeg" ? ".jpg" : ext}`;
    fs.copyFileSync(src, path.join(destDir, destName));
    const href = `/art/${destName}`;
    console.log("couverture", href);
    return href;
  }
  return "";
}

const files = useInbox
  ? walkDocx(INBOX)
  : args.filter(
      (a, i) =>
        !a.startsWith("--") &&
        a !== outRoot &&
        (i === 0 || args[i - 1] !== "--out"),
    );

if (files.length === 0) {
  console.error(
    "Usage: node scripts/import-docx.mjs fichier.docx [--out content]\n       node scripts/import-docx.mjs --inbox",
  );
  process.exit(useInbox ? 0 : 1);
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error("Introuvable:", file);
    process.exit(1);
  }
  const fromPath = classFromPath(file);
  const buffer = fs.readFileSync(file);
  const result = await mammoth.convertToHtml(
    { buffer },
    { convertImage: mammoth.images.imgElement(async () => ({ src: "" })) },
  );
  const parsed = parseFeuilletonHtml(result.value, path.basename(file));
  const bookSlug = slugify(parsed.title) || "feuilleton";
  const cover = copySidecar(file, bookSlug);
  const written = toContentFiles(parsed, {
    niveau: fromPath.niveau || parsed.niveau || undefined,
    matiere: fromPath.matiere || parsed.matiere || undefined,
    cover: cover || undefined,
  });
  for (const f of written) {
    const dest = path.join(outRoot, f.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, f.body, "utf8");
    console.log("écrit", dest);
  }
  for (const w of parsed.warnings) console.warn("!", w);
  console.log(
    `→ ${parsed.title} · ${parsed.episodes.length} épisode(s) · ${fromPath.niveau || parsed.niveau || "niveau ?"}`,
  );
}
