import { useMemo, useState } from "react";
import { GLOSSARY, GLOSSARY_KEYS } from "@/lib/glossary";

type Seg =
  | { kind: "text"; value: string }
  | { kind: "em"; value: string }
  | { kind: "term"; value: string; def: string };

function splitItalics(input: string): { em: boolean; value: string }[] {
  const out: { em: boolean; value: string }[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    if (m.index > last) out.push({ em: false, value: input.slice(last, m.index) });
    out.push({ em: true, value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < input.length) out.push({ em: false, value: input.slice(last) });
  return out;
}

function splitTerms(
  value: string,
  used: Set<string>,
): ( { kind: "text"; value: string } | { kind: "term"; value: string; def: string } )[] {
  const out: ( { kind: "text"; value: string } | { kind: "term"; value: string; def: string } )[] = [];
  let rest = value;
  while (rest.length) {
    let hit: { at: number; key: string } | null = null;
    for (const key of GLOSSARY_KEYS) {
      if (used.has(key.toLowerCase())) continue;
      const at = rest.indexOf(key);
      if (at === -1) continue;
      const beforeOk = at === 0 || !/[\p{L}\p{N}]/u.test(rest[at - 1] ?? "");
      const after = rest[at + key.length] ?? "";
      const afterOk = after === "" || !/[\p{L}\p{N}]/u.test(after);
      if (!beforeOk || !afterOk) continue;
      if (!hit || at < hit.at || (at === hit.at && key.length > hit.key.length)) {
        hit = { at, key };
      }
    }
    if (!hit) {
      out.push({ kind: "text", value: rest });
      break;
    }
    if (hit.at > 0) out.push({ kind: "text", value: rest.slice(0, hit.at) });
    const def = GLOSSARY[hit.key];
    out.push({ kind: "term", value: hit.key, def });
    used.add(hit.key.toLowerCase());
    const canon = Object.keys(GLOSSARY).find(
      (k) => k.toLowerCase() === hit.key.toLowerCase(),
    );
    if (canon) used.add(canon.toLowerCase());
    rest = rest.slice(hit.at + hit.key.length);
  }
  return out;
}

function parseParagraph(text: string, used: Set<string>): Seg[] {
  const segs: Seg[] = [];
  for (const part of splitItalics(text)) {
    if (part.em) {
      segs.push({ kind: "em", value: part.value });
      continue;
    }
    segs.push(...splitTerms(part.value, used));
  }
  return segs;
}

function Term({ value, def }: { value: string; def: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline">
      <button
        type="button"
        className="border-b border-dotted border-accent/70 text-inherit decoration-transparent"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {value}
      </button>
      {open ? (
        <span
          role="note"
          className="absolute top-[calc(100%+0.35rem)] left-1/2 z-20 w-[min(18rem,70vw)] -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 font-serif text-[0.85rem] leading-snug text-fg shadow-[0_8px_28px_rgba(26,20,16,0.18)]"
        >
          <span className="mb-1 block font-display text-sm font-semibold text-accent">
            {value}
          </span>
          {def}
        </span>
      ) : null}
    </span>
  );
}

export function RichParagraphs({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  const parsed = useMemo(() => {
    const used = new Set<string>();
    return paragraphs.map((p) => parseParagraph(p, used));
  }, [paragraphs]);

  return (
    <div className={className}>
      {parsed.map((segs, i) => {
        const raw = paragraphs[i] ?? "";
        const isDialogue = raw.startsWith("— ");
        const isRegister = raw.startsWith("«");
        return (
          <p
            key={i}
            className={
              isDialogue
                ? "my-[0.85em] pl-1"
                : isRegister
                  ? "my-[1.1em] pl-4 text-fg-muted italic"
                  : "my-[0.95em]"
            }
          >
            {segs.map((s, j) => {
              if (s.kind === "em") return <em key={j}>{s.value}</em>;
              if (s.kind === "term")
                return <Term key={j} value={s.value} def={s.def} />;
              return <span key={j}>{s.value}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
