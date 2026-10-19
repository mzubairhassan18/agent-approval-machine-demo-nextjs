"use client";

/**
 * The ten use cases, identical to the ones in the framework-free docs demo and
 * in the Vue and Angular versions. Only the presentation differs per framework;
 * the data, the flags and the failure modes are deliberately the same.
 *
 * This file also holds the one adapter they all share: an approval item here is
 * `{ id, title, subtitle, body?, amount?, slot?, risk? }`, so a single adapter
 * renders all ten flows with the shipped ApprovalDialog.
 */

import { Badge } from "@/src/ui";
import type { ApprovalAdapter, AdapterRenderContext } from "@/src/adapters/types";
import type { UseApprovalConfig } from "agent-approval-machine";

export type Risk = "high" | "destructive";

export interface DemoItem {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  amount?: number;
  slot?: string;
  risk?: Risk;
}

export interface DemoEdit {
  key: "body" | "amount" | "slot";
  label: string;
  kind: "textarea" | "text" | "number";
}

export interface DemoUseCase {
  id: string;
  label: string;
  blurb: string;
  /** The machine's rules, exactly as the package's presets express them. */
  flags: Pick<UseApprovalConfig<DemoItem>, "canUndo" | "undoMs" | "canEdit" | "canSelect">;
  edit?: DemoEdit;
  items: DemoItem[];
  /** id -> the error the fake provider returns for that item. */
  fail?: Record<string, string>;
  /** One extra item that can arrive while a batch is executing. */
  arrival?: DemoItem;
}

export const euro = (value: number) =>
  "€" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const USE_CASES: DemoUseCase[] = [
  {
    id: "support-replies",
    label: "Support replies",
    blurb:
      "An agent drafts replies to a support queue. A human reads each one, rewrites what is wrong, and sends. One mailbox is rate-limited, so that send fails alone.",
    flags: { canUndo: true, undoMs: 5000, canEdit: true, canSelect: true },
    edit: { key: "body", label: "Reply body", kind: "textarea" },
    items: [
      {
        id: "t-4412",
        title: "Re: Refund not received",
        subtitle: "to priya@acme.io · order #88213",
        body: "Hi Priya — the refund was issued on the 3rd and usually lands within 5 business days. I have asked the payment team to trace it and will update you tomorrow.",
      },
      {
        id: "t-4417",
        title: "Re: Cannot invite teammates",
        subtitle: "to dan@lumen.dev · plan: Team",
        body: "Hi Dan — invitations need the Team plan plus the Admin role. I have upgraded your seat and resent the invite; it should arrive in a minute.",
      },
      {
        id: "t-4420",
        title: "Re: Invoice address change",
        subtitle: "to legal@northwind.co · VAT update",
        body: "Hello — I have updated your billing entity and VAT number, and reissued last month's invoice with the new details. The original is now void.",
      },
      {
        id: "t-4421",
        title: "Re: API latency in EU region",
        subtitle: "to sre@finch.app · incident #1183",
        body: "Hi — we saw elevated p95 in eu-west between 09:12 and 09:41 UTC. The cause was a noisy neighbour on one node; it has been drained and your latency is back to baseline.",
      },
    ],
    fail: { "t-4420": "mailbox rate limit exceeded (429) — retry in a few seconds" },
    arrival: {
      id: "t-4433",
      title: "Re: Export stuck at 92%",
      subtitle: "to marco@terrace.io · arrived while sending",
      body: "Hi Marco — your export hit a large attachment table and timed out. I have split it into two jobs and both are running now.",
    },
  },
  {
    id: "refunds",
    label: "Refunds and payments",
    blurb:
      "The agent proposes refunds and payouts from the finance queue. Amounts are not editable — that is the number the agent computed — and the recall window is 30 seconds, because moving money by accident is expensive.",
    flags: { canUndo: true, undoMs: 30000, canEdit: false, canSelect: true },
    items: [
      {
        id: "p-901",
        title: "Refund — duplicate charge",
        subtitle: "stripe · customer #4412",
        amount: 249,
      },
      {
        id: "p-902",
        title: "Payout — contractor invoice",
        subtitle: "sepa · INV-2291",
        amount: 4120.5,
      },
      {
        id: "p-903",
        title: "Refund — goodwill credit",
        subtitle: "stripe · customer #7781",
        amount: 49,
        risk: "high",
      },
    ],
  },
  {
    id: "publishing",
    label: "Multi-platform publishing",
    blurb:
      "One post fans out to several platforms. The copy is editable per platform, one API rejects the payload, and a mistake can be recalled inside five seconds.",
    flags: { canUndo: true, undoMs: 5000, canEdit: true, canSelect: true },
    edit: { key: "body", label: "Post copy", kind: "textarea" },
    items: [
      {
        id: "pub-x",
        title: "X / Twitter — thread open",
        subtitle: "account @mzubairhassan18 · 3 posts",
        body: "We shipped a 2.5 kB state machine for agent approvals. Edit before approve, partial failure with retry, undo window, and a queue. No framework, no dependencies.",
      },
      {
        id: "pub-li",
        title: "LinkedIn — company page",
        subtitle: "account /agent-approval-machine",
        body: "Most agent approvals are one button. The hard parts are the other four conditions: editing before approving, retrying only what failed, undoing inside a window, and not losing items that arrive mid-flight.",
      },
      {
        id: "pub-bsky",
        title: "Bluesky — tech feed",
        subtitle: "account @approval.bsky.social",
        body: "Ten real approval flows on one 2.5 kB store: support replies, refunds, publishing, deploys, GDPR deletion and more.",
      },
    ],
    fail: { "pub-bsky": "platform API rejected the payload (422): link card missing" },
    arrival: {
      id: "pub-threads",
      title: "Threads — mirror of X thread",
      subtitle: "queued after the batch started",
      body: "Mirroring the announcement thread.",
    },
  },
  {
    id: "meetings",
    label: "Meeting scheduling",
    blurb:
      "The agent proposes slots for external meetings. Nothing can be booked until a human picks a time, which is an edit to the payload the executor receives.",
    flags: { canUndo: true, undoMs: 5000, canEdit: true, canSelect: true },
    edit: { key: "slot", label: "Chosen slot", kind: "text" },
    items: [
      {
        id: "m-1",
        title: "Design review with Northwind",
        subtitle: "4 attendees · 45 min · Zoom",
        slot: "Thu 15:00 CET",
      },
      {
        id: "m-2",
        title: "Contract walkthrough",
        subtitle: "legal@northwind.co · 30 min",
        slot: "Fri 09:30 CET",
      },
      {
        id: "m-3",
        title: "Onboarding — Terrace.io",
        subtitle: "2 attendees · 60 min",
        slot: "Mon 11:00 CET",
      },
    ],
    fail: { "m-2": "calendar conflict: the slot was taken while the batch was in flight" },
  },
  {
    id: "account-cancellations",
    label: "Account cancellations",
    blurb:
      "Irreversible, so there is no undo and no editing — only a deliberate yes. This is the preset where the flags are switched off.",
    flags: { canUndo: false, canEdit: false, canSelect: true },
    items: [
      {
        id: "c-1",
        title: "Cancel workspace — Terrace.io",
        subtitle: "12 seats · data retained 30 days",
        risk: "destructive",
      },
      {
        id: "c-2",
        title: "Close enterprise trial — Finch",
        subtitle: "trial ends in 6 days",
        risk: "destructive",
      },
      { id: "c-3", title: "Downgrade plan — Lumen", subtitle: "Team → Free at period end", risk: "high" },
    ],
  },
  {
    id: "deploys",
    label: "CI/CD deploy approvals",
    blurb:
      "A release bot asks a human to ship. No undo window — you roll forward, not back — and a failed smoke test lands back on that one deployment, not on the whole batch.",
    flags: { canUndo: false, canEdit: false, canSelect: true },
    items: [
      {
        id: "d-1",
        title: "web@2.14.0 → production",
        subtitle: "42 commits · canary 5%",
        risk: "high",
      },
      { id: "d-2", title: "api@1.9.3 → production", subtitle: "migration +2 · backwards compatible" },
      { id: "d-3", title: "worker@0.7.1 → eu-west", subtitle: "no schema change" },
    ],
    fail: { "d-1": "staging smoke test failed: /checkout returned 500 three times" },
  },
  {
    id: "gdpr",
    label: "GDPR deletion requests",
    blurb:
      "Data deletion cannot be recalled or rewritten, and every request carries an identity reference so the audit trail stays intact.",
    flags: { canUndo: false, canEdit: false, canSelect: true },
    items: [
      {
        id: "g-1",
        title: "Erasure request — subject #1204",
        subtitle: "verified by ID · 17 records across 4 systems",
        risk: "destructive",
      },
      {
        id: "g-2",
        title: "Erasure request — subject #3391",
        subtitle: "verified by ID · 6 records",
        risk: "destructive",
      },
      {
        id: "g-3",
        title: "Export then erase — subject #0982",
        subtitle: "portability bundle attached",
        risk: "high",
      },
    ],
  },
  {
    id: "purchase-orders",
    label: "Purchase orders",
    blurb:
      "Procurement approvals need a human to correct the amount before it goes out, with a long recall window because suppliers confirm fast.",
    flags: { canUndo: true, undoMs: 30000, canEdit: true, canSelect: true },
    edit: { key: "amount", label: "Order total (€)", kind: "number" },
    items: [
      {
        id: "po-77",
        title: "MacBook Pro × 4 — onboarding",
        subtitle: "supplier: Kessler IT · net 30",
        amount: 9600,
        risk: "high",
      },
      { id: "po-78", title: "Standing desk × 6", subtitle: "supplier: OfficeLoop", amount: 2340 },
      {
        id: "po-79",
        title: "GPU hours — training run",
        subtitle: "supplier: cloud credits",
        amount: 12200,
      },
    ],
    fail: { "po-79": "requires a second approver above €10,000" },
  },
  {
    id: "contracts",
    label: "Contract signing",
    blurb:
      "Signing is final and the document cannot be edited by the agent, so both flags are closed: no undo, no edit.",
    flags: { canUndo: false, canEdit: false, canSelect: true },
    items: [
      { id: "s-1", title: "MSA — Northwind Co", subtitle: "12 month term · auto-renew off", risk: "high" },
      { id: "s-2", title: "DPA addendum — Terrace.io", subtitle: "sub-processor list attached" },
      { id: "s-3", title: "SOW #14 — Finch", subtitle: "3 milestones · €48,000" },
    ],
  },
  {
    id: "ad-campaigns",
    label: "Ad campaign launches",
    blurb:
      "The agent writes the copy and proposes a daily budget. A human can edit the budget, and the 30 second window exists because spend starts the moment the campaign goes live.",
    flags: { canUndo: true, undoMs: 30000, canEdit: true, canSelect: true },
    edit: { key: "amount", label: "Daily budget (€)", kind: "number" },
    items: [
      {
        id: "ad-1",
        title: "Google Search — 'approval workflow'",
        subtitle: "keywords: 14 · geo: DE, NL",
        amount: 120,
      },
      {
        id: "ad-2",
        title: "Meta — retargeting lookalike",
        subtitle: "audience 2.1M · 3 creatives",
        amount: 240,
      },
      { id: "ad-3", title: "Reddit — r/SaaS awareness", subtitle: "12 subreddits", amount: 90, risk: "high" },
    ],
    fail: { "ad-2": "ad account spend limit reached — raise the limit and retry" },
    arrival: {
      id: "ad-4",
      title: "LinkedIn — job title targeting",
      subtitle: "arrived while launching",
      amount: 150,
    },
  },
];

/**
 * One adapter for all ten flows. The dialog renders the state; this renders the
 * payload — and swapping it is the only thing that changes between an email, a
 * payment and a deploy.
 */
export function createGenericAdapter(useCase: DemoUseCase): ApprovalAdapter<DemoItem> {
  const { edit } = useCase;

  return {
    name: useCase.id,
    editFields: edit ? [edit.key] : [],
    validate: (item) => {
      if (edit?.kind === "number" && (item.amount === undefined || Number.isNaN(item.amount))) {
        return "Enter an amount before approving — the executor receives exactly this value.";
      }
      return null;
    },
    render: (item, onEdit, ctx: AdapterRenderContext) => (
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{item.title}</span>
          {item.risk && (
            <Badge variant={item.risk === "destructive" ? "danger" : "warning"}>{item.risk}</Badge>
          )}
        </div>

        <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
          {[
            item.subtitle,
            item.amount !== undefined ? euro(item.amount) : null,
            item.slot ? `slot: ${item.slot}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>

        {edit && ctx.editable && (
          <label className="block space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {edit.label}
            </span>
            {edit.kind === "textarea" ? (
              <textarea
                aria-label={edit.label}
                className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs text-zinc-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                onChange={(event) => onEdit({ [edit.key]: event.target.value })}
                rows={3}
                value={item.body ?? ""}
              />
            ) : (
              <input
                aria-label={edit.label}
                className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                onChange={(event) =>
                  onEdit({
                    [edit.key]: edit.kind === "number" ? Number(event.target.value) : event.target.value,
                  })
                }
                type={edit.kind === "number" ? "number" : "text"}
                value={edit.kind === "number" ? (item.amount ?? "") : (item.slot ?? "")}
              />
            )}
          </label>
        )}

        {!edit && item.body && (
          <p className="text-xs text-zinc-600 dark:text-zinc-300">{item.body}</p>
        )}

        {edit && !ctx.editable && (
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            {edit.kind === "number" ? euro(item.amount ?? 0) : String(item[edit.key] ?? "")}
          </p>
        )}
      </div>
    ),
  };
}

/**
 * The fake provider behind every use case: slow, partial, and honest about it.
 * Like the shared executors in `mock-executors.ts`, an item fails its first
 * attempt and then goes through — so "Retry 1 failed" actually recovers, which
 * is what the failure messages promise.
 */
export function createExecutor(useCase: DemoUseCase, failedOnce: Set<string>) {
  return async (batch: DemoItem[]) => {
    await new Promise((resolve) => setTimeout(resolve, 700 + batch.length * 260));
    const succeeded: DemoItem[] = [];
    const failed: { item: DemoItem; error: string }[] = [];
    for (const item of batch) {
      const error = useCase.fail?.[item.id];
      if (error && !failedOnce.has(item.id)) {
        failedOnce.add(item.id);
        failed.push({ item, error });
      } else {
        succeeded.push(item);
      }
    }
    return { succeeded, failed };
  };
}
