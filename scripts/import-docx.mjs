#!/usr/bin/env node
/**
 * Convertit un .docx de feuilleton en dossier texte.
 *
 *   node scripts/import-docx.mjs chemin/vers/fichier.docx
 *   node scripts/import-docx.mjs inbox/*.docx --out content
 *
 * Dans Word : Titre 1 = « ÉPISODE 1 — Titre », Titre 2 = « Lieu, année ».
 */
import fs from "node:fs";
import path from "node:path";
import mammoth from "mammoth";
import { parseFeuilletonHtml, toContentFiles } from "../src/lib/parse-feuilleton.ts";

const args = process.argv.slice(2).filter((a) => a !== "--");
const outIdx = args.indexOf("--out");
const outRoot = outIdx >= 0 ? args[outIdx + 1] : "content";
const niveauIdx = args.indexOf("--niveau");
const matiereIdx = args.indexOf("--matiere");
const niveau = niveauIdx >= 0 ? args[niveauIdx + 1] : undefined;
const matiere = matiereIdx >= 0 ? args[matiereIdx + 1] : undefined;

const files = args.filter(
  (a, i) =>
    !a.startsWith("--") &&
    a !== niveau &&
    a !== matiere &&
    a !== outRoot &&
    (i === 0 || !["--out", "--niveau", "--matiere"].includes(args[i - 1])),
);

if (files.length === 0) {
  console.error(
    "Usage: node scripts/import-docx.mjs fichier.docx [--out content] [--niveau 4e] [--matiere Histoire]",
  );
  process.exit(1);
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error("Introuvable:", file);
    process.exit(1);
  }
  const buffer = fs.readFileSync(file);
  const result = await mammoth.convertToHtml(
    { buffer },
    { convertImage: mammoth.images.imgElement(async () => ({ src: "" })) },
  );
  const parsed = parseFeuilletonHtml(result.value, path.basename(file));
  const written = toContentFiles(parsed, { niveau, matiere });
  for (const f of written) {
    const dest = path.join(outRoot, f.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, f.body, "utf8");
    console.log("écrit", dest);
  }
  for (const w of parsed.warnings) console.warn("!", w);
  console.log(
    `→ ${parsed.title} · ${parsed.episodes.length} épisode(s) · ${parsed.niveau ?? "niveau ?"}`,
  );
}
