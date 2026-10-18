/**
 * useApproval - the React binding, kept here as copy-paste reference.
 *
 * The state itself ships in `agent-approval-machine`: zero dependencies, no
 * framework, no JSX. This file only wires the published store into React so a
 * component re-renders when the machine moves. It is the whole React story —
 * copy these ~40 lines into your own app instead of installing a binding.
 *
 * React >= 18 (useSyncExternalStore).
 */

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import { createApprovalStore } from "agent-approval-machine";
import type { ApprovalStore, UseApprovalConfig, UseApprovalReturn } from "agent-approval-machine";

// Re-export the package so the moved components can keep importing types,
// presets and helpers from one place.
export * from "agent-approval-machine";

export function useApproval<T extends { id: string }>(
  config: UseApprovalConfig<T>,
): UseApprovalReturn<T> {
  // One store per component instance. Created during the first render so SSR
  // and the first client paint agree.
  const storeRef = useRef<ApprovalStore<T> | null>(null);
  if (storeRef.current === null) storeRef.current = createApprovalStore(config);
  const store = storeRef.current;

  // Flags and callbacks are read at call time from the latest config, so they
  // never go stale. This does not touch state (see setConfig).
  store.setConfig(config);

  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  // The item list is a source of truth: reconcile when it changes.
  const { items } = config;
  useEffect(() => {
    store.syncItems(items);
  }, [store, items]);

  // Undo timers outlive the component unless we stop them.
  useEffect(() => {
    return () => store.destroy();
  }, [store]);

  return useMemo(
    () => ({
      ...snapshot,
      select: store.select,
      selectAll: store.selectAll,
      edit: store.edit,
      approve: store.approve,
      deny: store.deny,
      undo: store.undo,
      retryFailed: store.retryFailed,
      addItems: store.addItems,
      clearQueue: store.clearQueue,
      reset: store.reset,
    }),
    [snapshot, store],
  );
}
