import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileUp, Download, AlertTriangle, Check } from "lucide-react";
import { importDocx } from "@/lib/import-docx-fn";
import {
  toContentFiles,
  toSingleTxt,
  type ParsedFeuilleton,
} from "@/lib/parse-feuilleton";
import { ReaderBar } from "@/components/reader-bar";

export const Route = createFileRoute("/atelier")({ component: Atelier });

function Atelier() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedFeuilleton | null>(null);
  const [fileName, setFileName] = useState<string>("");

  async function onFile(file: File) {
    setError(null);
    setParsed(null);
    setFileName(file.name);
    if (!/\.docx$/i.test(file.name)) {
      setError("Envoie un fichier Word .docx (pas un .doc, pas un PDF).");
      return;
    }
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      }
      const base64 = btoa(binary);
      const result = await importDocx({ data: { base64, name: file.name } });
      setParsed(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion impossible.");
    } finally {
      setBusy(false);
    }
  }

  function downloadTxt() {
    if (!parsed) return;
    const blob = new Blob([toSingleTxt(parsed)], {
      type: "text/plain;charset=utf-8",
    });
    triggerDownload(blob, `${slugOrFallback(parsed)}.txt`);
  }

  async function downloadZip() {
    if (!parsed) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const f of toContentFiles(parsed)) {
      zip.file(f.path, f.body);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    triggerDownload(blob, `${slugOrFallback(parsed)}.zip`);
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ReaderBar title="Atelier Word" />
      <main className="mx-auto w-full max-w-xl px-5 py-10 sm:px-8">
        <p className="font-display text-xs tracking-[0.22em] text-fg-muted uppercase">
          Auteur · pas pour les élèves
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Word → feuilleton
        </h1>
        <p className="mt-4 font-serif text-[1.05rem] leading-relaxed text-fg-muted">
          Télécharge le modèle, remplis-le, dépose-le sur GitHub dans{" "}
          <span className="text-fg">inbox/4e/histoire/</span> (ou 3e,
          géographie, EMC, français). L’étagère se met à jour toute seule.
        </p>

        <ol className="mt-8 space-y-3 border-y border-border py-6 font-serif text-[1.02rem] leading-relaxed">
          <li>
            <span className="font-display font-semibold">Titre 1</span>
            {" — "}
            <span className="italic">ÉPISODE 1 — Deux navires</span>
          </li>
          <li>
            <span className="font-display font-semibold">Titre 2</span>
            {" — "}
            <span className="italic">Bordeaux, 1768</span>
          </li>
          <li>
            <span className="font-display font-semibold">Normal</span>
            {" — le texte. Italique pour les navires. Dialogue avec un tiret."}
          </li>
        </ol>
        <p className="mt-4 font-serif text-[1.02rem] leading-relaxed text-fg-muted">
          À la fin, un Titre 1{" "}
          <span className="italic text-fg">Après la nouvelle</span>, puis des
          Titre 2 pour le vrai et l’inventé. La première page peut dire{" "}
          <span className="italic">Classe de 4e</span> et{" "}
          <span className="italic">Histoire</span> : ça suffit à classer le
          livre.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/modele-feuilleton.docx"
            download
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-5 font-display text-base font-semibold"
          >
            Télécharger le modèle
          </a>
        </div>

        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center transition-colors hover:border-fg-muted">
          <FileUp className="size-7 text-fg-muted" strokeWidth={1.5} />
          <span className="mt-3 font-display text-xl font-semibold">
            {busy ? "Lecture du Word…" : "Déposer le .docx"}
          </span>
          <span className="mt-1 text-sm text-fg-muted">
            ou cliquer pour choisir un fichier
          </span>
          <input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
        </label>

        {error ? (
          <p className="mt-6 flex gap-2 text-sm text-accent" role="alert">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        ) : null}

        {parsed ? (
          <Result parsed={parsed} fileName={fileName} onTxt={downloadTxt} onZip={downloadZip} />
        ) : null}

        <p className="mt-10 text-sm text-fg-muted">
          Sur GitHub : pose le Word dans{" "}
          <code className="text-fg">inbox/</code>, le script{" "}
          <code className="text-fg">scripts/import-docx.mjs</code> écrit le
          dossier texte.{" "}
          <Link to="/" className="underline-offset-4 hover:underline">
            Retour à la bibliothèque
          </Link>
        </p>
      </main>
    </div>
  );
}

function Result({
  parsed,
  fileName,
  onTxt,
  onZip,
}: {
  parsed: ParsedFeuilleton;
  fileName: string;
  onTxt: () => void;
  onZip: () => void;
}) {
  return (
    <section className="mt-10">
      <p className="text-sm text-fg-muted">{fileName}</p>
      <h2 className="mt-1 font-display text-3xl font-semibold">{parsed.title}</h2>
      <p className="mt-1 text-sm text-fg-muted">
        {[parsed.niveau, parsed.matiere, parsed.logline]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {parsed.episodes.map((ep) => (
          <li key={ep.id} className="flex items-baseline gap-4 py-3">
            <span className="w-8 font-display text-lg text-accent tabular-nums">
              {String(ep.id).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold">
                {ep.title}
              </span>
              <span className="text-sm text-fg-muted">
                {[ep.place, ep.when].filter(Boolean).join(" · ")} ·{" "}
                {ep.paragraphs.length} paragraphes
              </span>
            </span>
            <Check className="size-4 shrink-0 text-fg-muted" strokeWidth={1.6} />
          </li>
        ))}
      </ul>

      {parsed.afterword.length > 0 ? (
        <p className="mt-4 text-sm text-fg-muted">
          Après la nouvelle : {parsed.afterword.map((s) => s.title).join(" · ")}
        </p>
      ) : null}

      {parsed.warnings.length > 0 ? (
        <ul className="mt-4 space-y-1 text-sm text-accent">
          {parsed.warnings.map((w) => (
            <li key={w} className="flex gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              {w}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onTxt}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-fg px-5 font-display text-lg font-semibold text-bg"
        >
          <Download className="size-4" strokeWidth={1.8} />
          Texte seul
        </button>
        <button
          type="button"
          onClick={() => void onZip()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 font-display text-base font-semibold"
        >
          Dossier (zip)
        </button>
      </div>
    </section>
  );
}

function slugOrFallback(parsed: ParsedFeuilleton) {
  return (
    parsed.title
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "feuilleton"
  );
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
