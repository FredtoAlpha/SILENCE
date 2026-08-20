import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeReaderHandle,
  parseReaderHandle,
  requireReaderHandle,
} from "../src/lib/reader-handle.ts";

test("normalise l’identifiant de lecteur", () => {
  assert.equal(normalizeReaderHandle(" 4E1 . MaRïe . DUP "), "4e1.marie.dup");
});

test("extrait la classe, le prénom et le préfixe du nom", () => {
  assert.deepEqual(parseReaderHandle("4e1.marie.dup"), {
    handle: "4e1.marie.dup",
    classCode: "4e1",
    firstName: "marie",
    lastPrefix: "dup",
  });
});

test("accepte un suffixe pour les rares doublons", () => {
  assert.equal(parseReaderHandle("3e2.lee.mar2")?.handle, "3e2.lee.mar2");
});

test("refuse les identifiants incomplets", () => {
  assert.throws(() => requireReaderHandle("marie.dup"), /4e1\.marie\.dup/);
  assert.equal(parseReaderHandle("4e1.marie.du"), null);
});
