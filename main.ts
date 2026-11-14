// ai-happy-01 entry: place the bundled image at $MAKEFUN_OUTPUT_DIR/entry.png.
// The image itself is the entry; this program only copies it there,
// deterministically, byte for byte, using the Node standard library only.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const source = fileURLToPath(new URL("./entry.png", import.meta.url));
// Validate the bundled image is really a PNG before copying it:
// the 8-byte PNG signature, then the IHDR chunk that follows it.
const header = readFileSync(source, { start: 0, end: 23 });
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!header.subarray(0, 8).equals(pngSignature) || header.toString("ascii", 12, 16) !== "IHDR") {
  throw new Error("entry.png is not a valid PNG image");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "entry.png"));
