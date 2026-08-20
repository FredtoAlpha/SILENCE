import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { requireReaderHandle } from "@/lib/reader-handle";
import { emptyProgress, sanitizeProgress, type ProgressSnapshot } from "@/lib/progress";

type OpenPayload = { handle: string; initialProgress?: ProgressSnapshot };
type SavePayload = { handle: string; progress: ProgressSnapshot };

type ProfileRow = { progress: unknown };

function parseStoredProgress(value: unknown): ProgressSnapshot {
  if (typeof value === "string") {
    try {
      return sanitizeProgress(JSON.parse(value));
    } catch {
      return emptyProgress();
    }
  }
  return sanitizeProgress(value);
}

export const openReaderProfile = createServerFn({ method: "POST" })
  .validator((data: OpenPayload) => {
    const reader = requireReaderHandle(data?.handle ?? "");
    return {
      ...reader,
      initialProgress: sanitizeProgress(data?.initialProgress),
    };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const initial = JSON.stringify(data.initialProgress);
    const rows = await sql.query<ProfileRow>(
      `insert into reader_profiles
        (handle, class_code, first_name, last_prefix, progress)
       values ($1, $2, $3, $4, $5::jsonb)
       on conflict (handle) do update
         set last_seen_at = now(), updated_at = reader_profiles.updated_at
       returning progress`,
      [data.handle, data.classCode, data.firstName, data.lastPrefix, initial],
    );
    return {
      handle: data.handle,
      progress: parseStoredProgress(rows[0]?.progress),
    };
  });

export const saveReaderProgress = createServerFn({ method: "POST" })
  .validator((data: SavePayload) => {
    const reader = requireReaderHandle(data?.handle ?? "");
    const progress = sanitizeProgress(data?.progress);
    const encoded = JSON.stringify(progress);
    if (encoded.length > 50_000) throw new Error("Progression trop volumineuse.");
    return { ...reader, progress, encoded };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(
      `update reader_profiles
       set progress = $2::jsonb, updated_at = now(), last_seen_at = now()
       where handle = $1`,
      [data.handle, data.encoded],
    );
    return { ok: true };
  });
