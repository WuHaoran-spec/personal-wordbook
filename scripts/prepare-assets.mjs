import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
mkdirSync(path.join(root, "public"), { recursive: true });
copyFileSync(
  path.join(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
  path.join(root, "public/pdf.worker.min.mjs"),
);
if (
  !existsSync(path.join(root, "public/icon-192.png")) ||
  !existsSync(path.join(root, "public/icon-512.png"))
) {
  const { default: sharp } = await import("sharp");
  for (const size of [192, 512])
    await sharp(readFileSync(path.join(root, "public/favicon.svg")))
      .resize(size, size)
      .png()
      .toFile(path.join(root, `public/icon-${size}.png`));
}
