import { i as __toESM } from "../_runtime.mjs";
import { f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as applicationStore } from "./StatusBadge-B95OIv_H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useApplications-DUtJUXw-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var noop = () => () => {};
/** Reactive list of applications from localStorage. Empty during SSR/hydration. */
function useApplications() {
	return (0, import_react.useSyncExternalStore)(applicationStore.subscribe, applicationStore.getSnapshot, applicationStore.getServerSnapshot);
}
/** True once the component runs on the client (safe to show "empty" states). */
function useHydrated() {
	return (0, import_react.useSyncExternalStore)(noop, () => true, () => false);
}
//#endregion
export { useHydrated as n, useApplications as t };
