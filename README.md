# agent-approval-machine — Next.js + shadcn/ui demo

Ten real-world human-in-the-loop approval flows built on
[`agent-approval-machine`](https://www.npmjs.com/package/agent-approval-machine): a **2.5 kB,
zero-dependency, framework-free** approval state machine.

This repo is the React reference implementation. It also keeps the library's original shadcn/ui
components (`ApprovalDialog`, `ApprovalCard`, `ApprovalTable`, five adapters) as copy-paste source,
so React users get the polished version by owning the code rather than installing another package.

**The published package contains no JSX, no components and no CSS.** Radix and Tailwind live here,
in this demo.

**Live: https://mzubairhassan18.github.io/agent-approval-machine-demo-nextjs/**

> Changing this UI, or how it deploys? [`notes/PROJECTS.md`](https://github.com/mzubairhassan18/agent-approval-machine/blob/main/notes/PROJECTS.md)
> in the library repo maps all four repos and names the file to open for each kind of change.

## The ten flows

Same data and same flags as the [vanilla demo](https://mzubairhassan18.github.io/agent-approval-machine/),
the Vue version and the Angular version — only the presentation differs.

| # | Flow | What it exercises |
| --- | --- | --- |
| 1 | Support replies | edit before approve, partial failure (429), queue, 5s undo |
| 2 | Refunds and payments | 30s undo, no editing, risk badge |
| 3 | Multi-platform publishing | editable copy, per-platform failure, queue |
| 4 | Meeting scheduling | editable slot, calendar conflict |
| 5 | Account cancellations | no undo, no edit — irreversible |
| 6 | CI/CD deploy approvals | no undo, one deployment fails its smoke test |
| 7 | GDPR deletion requests | no undo, no edit, destructive risk |
| 8 | Purchase orders | editable amount, second-approver failure, 30s undo |
| 9 | Contract signing | no undo, no edit |
| 10 | Ad campaign launches | editable budget, spend-limit failure, queue, 30s undo |

Each section has a **new item arrives** button: press it while a batch is executing and the item is
held as `queued`, then released when the batch settles, instead of being lost.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm test             # the moved React suite: machine, hook and UI
```

## Where the live demo comes from

This repo has no CI and no external host. `npm run build:pages` builds the static export and
writes it to `docs/`, which GitHub Pages serves (source: `main`, `/docs`):

```bash
npm run build:pages
git add docs && git commit -m "chore: rebuild pages" && git push
```

The site is served from a subpath (`/<repo>/`), so the build bakes in
`basePath: "/agent-approval-machine-demo-nextjs"`. The script also writes `docs/.nojekyll` —
without it, Pages' Jekyll step silently drops `_next/` and the page loads with no JavaScript.

## How it uses the package

Everything is state; this repo adds presentation.

```tsx
import { createApprovalStore } from "agent-approval-machine";

const store = createApprovalStore({
  items,                       // T extends { id: string }
  canUndo: true,
  undoMs: 5000,
  canEdit: true,
  canSelect: true,
  onExecute: async (batch) => ({ succeeded, failed }),   // partial failure is first class
});

store.subscribe(() => render(store.getSnapshot()));
await store.approve();
```

React needs one bridge, `useSyncExternalStore`. It is ~30 lines and lives in
[`src/core/useApproval.ts`](src/core/useApproval.ts) — copy it into your app instead of installing a
binding:

```tsx
export function useApproval<T extends { id: string }>(config: UseApprovalConfig<T>) {
  const ref = useRef<ApprovalStore<T> | null>(null);
  if (ref.current === null) ref.current = createApprovalStore(config);
  const store = ref.current;

  store.setConfig(config);                        // flags + callbacks, never state
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  useEffect(() => { store.syncItems(config.items); }, [store, config.items]);
  useEffect(() => () => store.destroy(), [store]); // undo timers outlive the component otherwise

  return { ...snapshot, ...store };               // snapshot + verbs
}
```

Two details that matter: `getSnapshot()` is referentially stable until state changes (that is what
makes it safe for `useSyncExternalStore`), and items are compared **by value**, so a list built inline
on every render does not loop while an agent streams new data in.

## Layout

```
app/
  page.tsx                    header, twelve sections, sticky jump list
  _demos/
    use-cases.tsx             the ten flows + the one shared adapter + the fake executor
    use-case-section.tsx      a flow = data + ApprovalDialog
    send-demo.tsx ...         the five prebuilt machines (section 11)
    docs-demo.tsx             the Next.js usage guide (section 12)
src/
  core/useApproval.ts         the React bridge (copy this)
  machines/useSendApproval.ts … five presets as hooks
  adapters/                   one adapter per payload kind
  ui/                         shadcn/ui components: dialog, card, table, parts
tests/                        the moved React suite (24 tests)
```

## Links

- Package: [npm/agent-approval-machine](https://www.npmjs.com/package/agent-approval-machine)
- Core repo: [github.com/mzubairhassan18/agent-approval-machine](https://github.com/mzubairhassan18/agent-approval-machine)
- Vanilla demo (no install): [mzubairhassan18.github.io/agent-approval-machine](https://mzubairhassan18.github.io/agent-approval-machine/)
- Vue + Vuetify version: [agent-approval-machine-demo-vue](https://github.com/mzubairhassan18/agent-approval-machine-demo-vue)
- Angular + Material version: [agent-approval-machine-demo-angular](https://github.com/mzubairhassan18/agent-approval-machine-demo-angular)

MIT.
