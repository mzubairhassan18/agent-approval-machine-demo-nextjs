"use client";

import { useCallback, useMemo, useState } from "react";

import { ApprovalDialog, Badge, Button } from "@/src/ui";

import { createExecutor, createGenericAdapter } from "./use-cases";
import type { DemoItem, DemoUseCase } from "./use-cases";

const FLAGS: { key: "canSelect" | "canEdit" | "canUndo"; label: string }[] = [
  { key: "canSelect", label: "canSelect" },
  { key: "canEdit", label: "canEdit" },
  { key: "canUndo", label: "canUndo" },
];

/**
 * One real-world flow. The state lives in the published store; the presentation
 * is the shipped ApprovalDialog; the only thing this component adds is the
 * use-case data and a button that makes an item arrive mid-flight.
 */
export function UseCaseSection({ index, useCase }: { index: number; useCase: DemoUseCase }) {
  const [items, setItems] = useState<DemoItem[]>(() => useCase.items.map((item) => ({ ...item })));
  const [arrivals, setArrivals] = useState(0);

  const adapter = useMemo(() => createGenericAdapter(useCase), [useCase]);
  const onExecute = useMemo(() => createExecutor(useCase), [useCase]);

  const onUndo = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 260));
  }, []);

  const reset = useCallback(() => {
    setArrivals(0);
    setItems(useCase.items.map((item) => ({ ...item })));
  }, [useCase]);

  const addArrival = useCallback(() => {
    const arrival = useCase.arrival;
    if (!arrival) return;
    const next = arrivals + 1;
    setArrivals(next);
    setItems((prev) => [...prev, { ...arrival, id: `${arrival.id}-${next}` }]);
  }, [arrivals, useCase.arrival]);

  return (
    <section className="scroll-mt-24 space-y-2.5" id={useCase.id}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {FLAGS.map((flag) => (
            <Badge key={flag.key} variant={useCase.flags[flag.key] ? "success" : "muted"}>
              {flag.label} {String(useCase.flags[flag.key])}
            </Badge>
          ))}
          <Badge variant={useCase.flags.canUndo ? "warning" : "muted"}>
            undoMs {useCase.flags.undoMs ?? 0}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {useCase.arrival && (
            <Button onClick={addArrival} size="sm" variant="outline">
              new item arrives
            </Button>
          )}
          <Button onClick={reset} size="sm" variant="ghost">
            Reset
          </Button>
        </div>
      </div>

      <ApprovalDialog
        adapter={adapter}
        canEdit={useCase.flags.canEdit}
        canSelect={useCase.flags.canSelect}
        canUndo={useCase.flags.canUndo}
        description={useCase.blurb}
        items={items}
        onExecute={onExecute}
        onUndo={onUndo}
        title={`${String(index + 1).padStart(2, "0")} · ${useCase.label}`}
        undoMs={useCase.flags.undoMs}
      />
    </section>
  );
}
