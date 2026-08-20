import fs from "node:fs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
} from "docx";

const INK = "1A1410";
const MUTED = "6B6258";
const RULE = "C9B8A4";

function run(text, extra = {}) {
  return new TextRun({ text, font: "Georgia", size: 24, color: INK, ...extra });
}

function p(text, extra = {}) {
  return new Paragraph({
    spacing: { after: 240, line: 360 },
    ...extra,
    children: [run(text, extra.run)],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { after: 200, line: 320 },
    children: [run(text, { italics: true, size: 20, color: MUTED })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 560, after: 120 },
    children: [run(text, { bold: true, size: 32 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 280 },
    children: [run(text, { italics: true, size: 26, color: MUTED })],
  });
}

function ficheLine(label, value) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      run(`${label} : `, { bold: true, size: 24 }),
      run(value, { size: 24 }),
    ],
  });
}

const rule = {
  border: {
    bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 8 },
  },
};

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Georgia", size: 24, color: INK } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Georgia", color: INK },
        paragraph: {
          spacing: { before: 560, after: 120 },
          outlineLevel: 0,
        },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, italics: true, font: "Georgia", color: MUTED },
        paragraph: {
          spacing: { before: 80, after: 280 },
          outlineLevel: 1,
        },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
        },
      },
      children: [
        new Paragraph({
          spacing: { after: 80 },
          children: [
            run("FEUILLETON", {
              bold: true,
              size: 18,
              font: "Georgia",
              color: MUTED,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 360 },
          ...rule,
          children: [
            run("Remplis. Ne change pas les styles Titre 1 et Titre 2.", {
              italics: true,
              size: 20,
              color: MUTED,
            }),
          ],
        }),

        ficheLine("Titre", "Le titre du feuilleton"),
        ficheLine("Niveau", "4e"),
        ficheLine("Matière", "Histoire"),
        ficheLine(
          "Accroche",
          "Une phrase. Ce qui donne envie d’ouvrir le livre.",
        ),

        note(
          "Niveau : 3e ou 4e. Matière : Histoire, Géographie, EMC ou Français. Sur GitHub, dépose aussi le fichier dans le dossier qui correspond (inbox/4e/histoire/).",
        ),

        h1("ÉPISODE 1 — Titre de l’épisode"),
        h2("Lieu, 1768"),
        p(
          "Remplace ces paragraphes par le texte. Un paragraphe, puis un autre. Environ deux pages, dix minutes à voix haute.",
        ),
        p("Les dialogues commencent par un tiret :"),
        p("— Comme ceci, dit-elle."),
        p(
          "Les noms de navires, de journaux, de livres : mets-les en italique, comme le Comte de Vergennes.",
        ),

        h1("ÉPISODE 2 — Titre du deuxième"),
        h2("Autre lieu, quelques semaines plus tard"),
        p("Même structure. Titre 1, Titre 2, puis le texte."),
        p("N’insère pas de quiz, de consigne, de « questions »."),

        h1("ÉPISODE 3 — Titre du troisième"),
        h2("Lieu, année"),
        p("Écris ici."),

        h1("ÉPISODE 4 — Titre du quatrième"),
        h2("Lieu, année"),
        p("Écris ici."),

        h1("ÉPISODE 5 — Titre du cinquième"),
        h2("Lieu, année"),
        p("Écris ici."),

        h1("ÉPISODE 6 — Titre du sixième"),
        h2("Lieu, année"),
        p("Le dernier soir. Quelque chose doit rester après la fermeture du livre."),

        h1("APRÈS LA NOUVELLE — LE VRAI ET L’INVENTÉ"),
        h2("Ce qui est historiquement attesté"),
        p("Les faits, les dates, les personnes réellement existantes."),
        h2("Ce qui relève de la fiction"),
        p("Les personnages inventés, les dialogues, ce que tu as resserré."),
      ],
    },
  ],
});

const buf = await Packer.toBuffer(doc);
fs.mkdirSync("public", { recursive: true });
fs.mkdirSync("inbox", { recursive: true });
fs.writeFileSync("public/modele-feuilleton.docx", buf);
fs.writeFileSync("inbox/_MODELE.docx", buf);
console.log("modele", buf.length, "octets");
