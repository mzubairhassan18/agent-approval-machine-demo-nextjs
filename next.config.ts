import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The demo is one static page, so it exports to plain files and GitHub Pages
  // serves the committed build from docs/ (see scripts/build-pages.mjs).
  output: "export",
  // Set only for that build: the Pages site lives under /<repo>/. Dev and a
  // plain `next build` stay at the root.
  basePath: process.env.PAGES_BASE_PATH || undefined,
  // The library ships pre-built ESM; transpiling it keeps the "use client"
  // boundaries explicit for the App Router.
  transpilePackages: ["agent-approval-machine"],
};

export default nextConfig;
