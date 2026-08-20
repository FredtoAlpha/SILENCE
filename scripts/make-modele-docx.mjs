import fs from "node:fs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 200 },
    ...opts,
    children: [
      new TextRun({
        text,
        font: "Georgia",
        size: 24,
        ...opts.run,
      }),
    ],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Georgia", size: 32 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 240 },
    children: [
      new TextRun({ text, italics: true, font: "Georgia", size: 26 }),
    ],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Georgia", size: 24 } } },
  },
  sections: [
    {
      children: [
        p("NOUVELLE HISTORIQUE", { run: { bold: true, size: 20 } }),
        p("Six épisodes d’environ dix minutes · Classe de 4e", {
          run: { italics: true, size: 20 },
        }),
        p("Le titre du feuilleton", { run: { bold: true, size: 48 } }),
        h1("ÉPISODE 1 — Titre de l’épisode"),
        h2("Lieu, 1768"),
        p(
          "Ici tu écris le texte. Un paragraphe, puis un autre. Les dialogues commencent par un tiret cadratin :",
        ),
        p("— Comme ceci, dit-elle."),
        p("Les noms de navires vont en italique, comme le Comte de Vergennes."),
        h1("ÉPISODE 2 — Titre du deuxième"),
        h2("Autre lieu, quelques semaines plus tard"),
        p("Et ainsi de suite jusqu’à l’épisode 6."),
        h1("APRÈS LA NOUVELLE — LE VRAI ET L’INVENTÉ"),
        h2("Ce qui est historiquement attesté"),
        p("Ce qui s’est vraiment passé."),
        h2("Ce qui relève de la fiction"),
        p("Les personnages inventés, le dispositif narratif."),
      ],
    },
  ],
});

const buf = await Packer.toBuffer(doc);
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/modele-feuilleton.docx", buf);
console.log("public/modele-feuilleton.docx", buf.length, "octets");
