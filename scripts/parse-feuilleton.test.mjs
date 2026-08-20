import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import mammoth from "mammoth";
import { parseFeuilletonHtml } from "../src/lib/parse-feuilleton.ts";

test("découpe le Word d’origine en 6 épisodes", async () => {
  const buffer = fs.readFileSync("attachments/Le_prix_du_sucre_nouvelle_4e.docx");
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

test("lit la fiche Titre / Niveau / Matière / Accroche", () => {
  const html = `
    <p>Titre : Le sel de la mer</p>
    <p>Niveau : 3e</p>
    <p>Matière : Géographie</p>
    <p>Accroche : Une côte, un bateau, une carte trop lisse.</p>
    <h1>ÉPISODE 1 — La carte</h1>
    <h2>Saint-Malo, 1824</h2>
    <p>Premier paragraphe assez long pour passer le seuil.</p>
    <p>Deuxième paragraphe.</p>
    <p>Troisième paragraphe.</p>
  `;
  const parsed = parseFeuilletonHtml(html, "ignore.docx");
  assert.equal(parsed.title, "Le sel de la mer");
  assert.equal(parsed.niveau, "3e");
  assert.equal(parsed.matiere, "Géographie");
  assert.match(parsed.logline, /côte/);
  assert.equal(parsed.episodes[0].place, "Saint-Malo");
});

test("conserve un intertitre de niveau 3 dans un épisode", () => {
  const html = `
    <h1>ÉPISODE 1 — La traversée</h1>
    <h2>Bordeaux, 1768</h2>
    <p>Premier paragraphe.</p>
    <h3>ÉPILOGUE — SAINT-DOMINGUE, 1791-1804</h3>
    <p>Deuxième paragraphe.</p>
    <p>Troisième paragraphe.</p>
    <h1>APRÈS LA NOUVELLE — LE VRAI ET L’INVENTÉ</h1>
    <h2>Les faits</h2>
    <p>Une note factuelle.</p>
  `;
  const parsed = parseFeuilletonHtml(html, "La traversée.docx");
  assert.equal(parsed.episodes[0].paragraphs[1], "ÉPILOGUE — SAINT-DOMINGUE, 1791-1804");
  assert.deepEqual(
    parsed.afterword.map((section) => section.title),
    ["Les faits"],
  );
});
