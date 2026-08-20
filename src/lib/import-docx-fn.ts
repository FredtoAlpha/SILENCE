import { createServerFn } from "@tanstack/react-start";
import { parseFeuilletonHtml } from "@/lib/parse-feuilleton";

type Payload = { base64: string; name: string };

export const importDocx = createServerFn({ method: "POST" })
  .validator((data: Payload) => {
    if (!data?.base64 || !data?.name) {
      throw new Error("Fichier manquant.");
    }
    if (data.base64.length > 12_000_000) {
      throw new Error("Fichier trop lourd (max ~8 Mo).");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const mammoth = await import("mammoth");
    const buffer = Buffer.from(data.base64, "base64");
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async () => ({ src: "" })),
      },
    );
    return parseFeuilletonHtml(result.value, data.name);
  });
