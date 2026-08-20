import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import mammoth from "mammoth";
import { parseFeuilletonHtml } from "../src/lib/parse-feuilleton.ts";

test("découpe le Word d’origine en 6 épisodes", async () => {
  const buffer = fs.readFileSync(
    "attachments/Le_prix_du_sucre_nouvelle_4e.docx",
  );
  const { value } = await mammoth.convertToHtml(
    { buffer },
    { convertImage: mammoth.images.imgElement(async () => ({ src: "" })) },
  );
  const parsed = parseFeuilletonHtml(value, "Le_prix_du_sucre_nouvelle_4e.docx");
  assert.equal(parsed.episodes.length, 6);
  assert.equal(parsed.episodes[0].title, "Deux navires");
  assert.equal(parsed.episodes[0].place, "Bordeaux");
  assert.equal(parsed.episodes[0].when, "1768");
  assert.match(parsed.episodes[0].paragraphs[0], /Garonne avait la couleur/);
  assert.equal(parsed.episodes[2].slug, "le-fil-rouge");
  assert.ok(parsed.afterword.length >= 2);
  assert.equal(parsed.niveau, "4e");
});

test("prévient si les titres d’épisode manquent", () => {
  const parsed = parseFeuilletonHtml("<p>Un texte sans structure.</p>");
  assert.equal(parsed.episodes.length, 0);
  assert.ok(parsed.warnings.length > 0);
});
