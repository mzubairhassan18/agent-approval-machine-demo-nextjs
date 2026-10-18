"use client";

import { useEffect, useState } from "react";

import { Badge, Button } from "@/src/ui";

import { ActionDemo } from "./_demos/action-demo";
import { DocsDemo } from "./_demos/docs-demo";
import { PaymentDemo } from "./_demos/payment-demo";
import { PublishDemo } from "./_demos/publish-demo";
import { ScheduleDemo } from "./_demos/schedule-demo";
import { SendDemo } from "./_demos/send-demo";
import { UseCaseSection } from "./_demos/use-case-section";
import { USE_CASES } from "./_demos/use-cases";

const LINKS = {
  npm: "https://www.npmjs.com/package/agent-approval-machine",
  github: "https://github.com/mzubairhassan18/agent-approval-machine",
  vanilla: "https://mzubairhassan18.github.io/agent-approval-machine/",
  vue: "https://github.com/mzubairhassan18/agent-approval-machine-demo-vue",
  angular: "https://github.com/mzubairhassan18/agent-approval-machine-demo-angular",
};

/** The five machines, each with its own adapter, straight from the moved library UI. */
const COMPONENT_DEMOS: { key: string; label: string; machine: string; render: () => React.ReactElement }[] = [
  { key: "send", label: "AI SDR inbox", machine: "useSendApproval", render: () => <SendDemo /> },
  { key: "action", label: "Support refund", machine: "useActionApproval", render: () => <ActionDemo /> },
  { key: "schedule", label: "Exec assistant", machine: "useScheduleApproval", render: () => <ScheduleDemo /> },
  { key: "payment", label: "Payments", machine: "usePaymentApproval", render: () => <PaymentDemo /> },
  { key: "publish", label: "Publisher", machine: "usePublishApproval", render: () => <PublishDemo /> },
];

const NAV = [
  ...USE_CASES.map((useCase, index) => ({
    id: useCase.id,
    label: useCase.label,
    number: String(index + 1).padStart(2, "0"),
  })),
  { id: "components", label: "Prebuilt components", number: "11" },
  { id: "docs", label: "Using it in Next.js", number: "12" },
];

export default function Page() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState(NAV[0].id);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-96px 0px -68% 0px", threshold: 0 },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("aam-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 lg:px-8">
          <a className="flex items-center gap-2 font-semibold" href="#top">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-400 text-[13px] font-extrabold text-emerald-950">
              ✓
            </span>
            agent-approval-machine
          </a>
          <nav className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <a className="hover:text-zinc-900 dark:hover:text-zinc-50" href={LINKS.npm}>
              npm
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-50" href={LINKS.github}>
              GitHub
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-50" href={LINKS.vanilla}>
              vanilla demo
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-50" href={LINKS.vue}>
              Vue
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-50" href={LINKS.angular}>
              Angular
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">shadcn/ui</Badge>
            <Badge variant="outline">Next.js 15</Badge>
            <Button onClick={toggleTheme} size="sm" variant="outline">
              {dark ? "☾ dark" : "☀ light"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8" id="top">
        <main className="min-w-0 flex-1 space-y-9">
          <section className="max-w-3xl space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-500">
              human-in-the-loop, without a framework
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Ten real-world approval flows on one 2.5 kB store
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Every flow below is the same published store, the same dialog and the same ten pieces of
              data. State comes from <code className="font-mono text-[12px]">agent-approval-machine</code>,
              presentation from shadcn/ui. Mock tools run in the browser — no keys, no backend.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge variant="success">zero dependencies</Badge>
              <Badge variant="outline">no framework in the core</Badge>
              <Badge variant="outline">partial failure with retry</Badge>
              <Badge variant="outline">undo window</Badge>
              <Badge variant="outline">queue for mid-flight items</Badge>
            </div>
          </section>

          {USE_CASES.map((useCase, index) => (
            <UseCaseSection index={index} key={useCase.id} useCase={useCase} />
          ))}

          <section className="scroll-mt-24 space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800" id="components">
            <header className="max-w-3xl space-y-1.5">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                11 · Prebuilt components
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                The same store with a purpose-built adapter per payload kind. This is the copy-paste
                React reference: read a demo, copy the component, own the source. Radix and Tailwind
                live here in the demo, never in the published package.
              </p>
            </header>

            <div className="space-y-8">
              {COMPONENT_DEMOS.map((demo) => (
                <div className="space-y-2" key={demo.key}>
                  <div className="flex items-center gap-2">
                    <Badge variant="muted">{demo.machine}</Badge>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{demo.label}</span>
                  </div>
                  {demo.render()}
                </div>
              ))}
            </div>
          </section>

          <section className="scroll-mt-24 space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800" id="docs">
            <header className="max-w-3xl space-y-1.5">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                12 · Using it in Next.js
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Install the package, adapt the store into React with{" "}
                <code className="font-mono text-[12px]">useSyncExternalStore</code>, then render. The
                binding is in <code className="font-mono text-[12px]">src/core/useApproval.ts</code> in
                this repo — copy it.
              </p>
            </header>
            <DocsDemo />
          </section>
        </main>

        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                twelve sections
              </p>
              <nav className="flex flex-col gap-px">
                {NAV.map((entry) => {
                  const isActive = entry.id === active;
                  return (
                    <a
                      className={[
                        "flex gap-2 rounded-md border-l-2 px-2 py-1.5 text-xs transition-colors",
                        isActive
                          ? "border-emerald-400 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                          : "border-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                      ].join(" ")}
                      href={`#${entry.id}`}
                      key={entry.id}
                    >
                      <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                        {entry.number}
                      </span>
                      <span>{entry.label}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                the same ten flows
              </p>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a className="text-sky-600 hover:underline dark:text-sky-400" href={LINKS.vanilla}>
                    vanilla HTML/CSS/JS
                  </a>
                </li>
                <li>
                  <a className="text-sky-600 hover:underline dark:text-sky-400" href={LINKS.vue}>
                    Vue + Vuetify
                  </a>
                </li>
                <li>
                  <a className="text-sky-600 hover:underline dark:text-sky-400" href={LINKS.angular}>
                    Angular + Material
                  </a>
                </li>
                <li>
                  <a className="text-sky-600 hover:underline dark:text-sky-400" href={LINKS.npm}>
                    npm
                  </a>
                </li>
              </ul>
              <div className="mt-3 rounded-md bg-zinc-100 px-2 py-1.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                npm i agent-approval-machine
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-zinc-200 px-4 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        MIT · zero dependencies · the core imports nothing at all
      </footer>
    </div>
  );
}
