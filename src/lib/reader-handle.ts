export type ReaderHandle = {
  handle: string;
  classCode: string;
  firstName: string;
  lastPrefix: string;
};

const HANDLE_RE = /^((?:3e|4e)\d{1,2})\.([a-z]+(?:-[a-z]+)*)\.([a-z]{3}\d*)$/;

export function normalizeReaderHandle(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s*\.\s*/g, ".")
    .replace(/[’']/g, "-");
}

export function parseReaderHandle(input: string): ReaderHandle | null {
  const handle = normalizeReaderHandle(input);
  const match = handle.match(HANDLE_RE);
  if (!match) return null;
  return {
    handle,
    classCode: match[1],
    firstName: match[2],
    lastPrefix: match[3],
  };
}

export function requireReaderHandle(input: string): ReaderHandle {
  const parsed = parseReaderHandle(input);
  if (!parsed) {
    throw new Error(
      "Identifiant incorrect. Exemple : 4e1.marie.dup (classe.prénom.3 lettres du nom).",
    );
  }
  return parsed;
}
