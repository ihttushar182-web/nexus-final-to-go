#!/usr/bin/env node
/**
 * Copies the self-hosted font files used by app/layout.tsx out of the official
 * @fontsource packages. Run after upgrading a font package:
 *
 *   npm run fonts:sync
 */
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "app", "fonts");

const files = [
  ["@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", "inter-latin-variable.woff2"],
  ["@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2", "space-grotesk-latin-variable.woff2"],
  ["@fontsource/hind-siliguri/files/hind-siliguri-bengali-400-normal.woff2", "hind-siliguri-bengali-400.woff2"],
  ["@fontsource/hind-siliguri/files/hind-siliguri-bengali-600-normal.woff2", "hind-siliguri-bengali-600.woff2"],
  ["@fontsource/hind-siliguri/files/hind-siliguri-bengali-700-normal.woff2", "hind-siliguri-bengali-700.woff2"],
];

await mkdir(outDir, { recursive: true });

for (const [from, to] of files) {
  const source = path.join(root, "node_modules", from);
  const target = path.join(outDir, to);
  await copyFile(source, target);
  console.log(`✓ ${to}`);
}

console.log("\nFonts synced. All three families are licensed under the SIL Open Font License.");
