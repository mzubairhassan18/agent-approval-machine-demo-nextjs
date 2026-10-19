#!/usr/bin/env node
/**
 * Builds the demo as static files and writes them to `docs/`, which is the
 * folder GitHub Pages serves (source: main, /docs). Commit the result.
 *
 *   npm run build:pages && git add docs && git commit -m "chore: rebuild pages"
 *
 * The site lives at https://mzubairhassan18.github.io/agent-approval-machine-demo-nextjs/,
 * so that subpath is baked into the build. `npm run dev` and `npm run build`
 * keep the root path.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

const BASE_PATH = "/agent-approval-machine-demo-nextjs";
const OUT = "out";
const DOCS = "docs";

execSync("npm run build", {
  stdio: "inherit",
  env: { ...process.env, PAGES_BASE_PATH: BASE_PATH },
});

if (!existsSync(`${OUT}/index.html`)) {
  console.error(`\nNo ${OUT}/index.html. Is \`output: "export"\` still set in next.config.ts?`);
  process.exit(1);
}

rmSync(DOCS, { recursive: true, force: true });
mkdirSync(DOCS, { recursive: true });
cpSync(OUT, DOCS, { recursive: true });

// Pages runs Jekyll, which silently drops any folder starting with `_` —
// including Next's `_next/`. This file opts the whole folder out.
writeFileSync(`${DOCS}/.nojekyll`, "");

console.log(`\nWrote ${DOCS}/ (served at ${BASE_PATH}/). Commit it and Pages redeploys.`);
