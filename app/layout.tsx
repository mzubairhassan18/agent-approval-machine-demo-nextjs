import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "agent-approval-machine — ten real-world approval flows (Next.js + shadcn/ui)",
  description:
    "Ten human-in-the-loop approval flows on a 2.5 kB framework-free state machine: edit before approve, partial failure with retry, undo windows, and a queue for items that arrive mid-flight.",
};

const THEME_SCRIPT = `
try {
  const stored = localStorage.getItem("aam-theme");
  const dark = stored ? stored === "dark" : true;
  document.documentElement.classList.toggle("dark", dark);
} catch (_) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}
