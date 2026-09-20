import { useSyncExternalStore } from "react";
import { applicationStore, type JobApplication } from "@/lib/applications";

const noop = () => () => {};

/** Reactive list of applications from localStorage. Empty during SSR/hydration. */
export function useApplications(): JobApplication[] {
  return useSyncExternalStore(
    applicationStore.subscribe,
    applicationStore.getSnapshot,
    applicationStore.getServerSnapshot,
  );
}

/** True once the component runs on the client (safe to show "empty" states). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
