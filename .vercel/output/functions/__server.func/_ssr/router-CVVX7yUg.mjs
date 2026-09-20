import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-Wh66hLzu.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$6 } from "./lamaran._id.edit-DcY9aWYg.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CVVX7yUg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BSCBi6Uf.css";
function reportRuntimeError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__appRuntimeEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__appReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Job Tracker — Pencatatan Lamaran Kerja" },
			{
				name: "description",
				content: "Catat, kelola, dan pantau seluruh proses lamaran kerja Anda."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "id",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$4 = () => import("./routes-CZRCJ-0t.mjs");
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Dashboard — Job Tracker" },
		{
			name: "description",
			content: "Ringkasan statistik seluruh lamaran kerja: aktif, tes, interview, diterima, ditolak."
		},
		{
			property: "og:title",
			content: "Dashboard — Job Tracker"
		},
		{
			property: "og:description",
			content: "Ringkasan statistik seluruh lamaran kerja Anda."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./import-BufkQgld.mjs");
var Route$3 = createFileRoute("/import")({
	head: () => ({ meta: [
		{ title: "Import Excel — Job Tracker" },
		{
			name: "description",
			content: "Impor data lamaran kerja lama dari file Excel (.xlsx / .xls) dengan preview dan validasi."
		},
		{
			property: "og:title",
			content: "Import Excel — Job Tracker"
		},
		{
			property: "og:description",
			content: "Impor data lamaran lama dari file Excel."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./panduan-BZOZ7psv.mjs");
var Route$2 = createFileRoute("/panduan")({
	head: () => ({ meta: [
		{ title: "Panduan — Job Tracker" },
		{
			name: "description",
			content: "Cara menggunakan Job Tracker: mencatat lamaran, arti status, import/export Excel, dan backup data."
		},
		{
			property: "og:title",
			content: "Panduan — Job Tracker"
		},
		{
			property: "og:description",
			content: "Panduan penggunaan aplikasi pencatatan lamaran kerja."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./lamaran.index-D5tC3qNi.mjs");
var Route$1 = createFileRoute("/lamaran/")({
	head: () => ({ meta: [
		{ title: "Daftar Lamaran — Job Tracker" },
		{
			name: "description",
			content: "Tabel seluruh lamaran kerja dengan pencarian, filter status, dan pengurutan tanggal."
		},
		{
			property: "og:title",
			content: "Daftar Lamaran — Job Tracker"
		},
		{
			property: "og:description",
			content: "Kelola seluruh lamaran kerja Anda dalam satu tabel."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./lamaran.baru-XMwYo2QY.mjs");
var Route = createFileRoute("/lamaran/baru")({
	head: () => ({ meta: [
		{ title: "Tambah Lamaran — Job Tracker" },
		{
			name: "description",
			content: "Catat lamaran kerja baru dengan status, tanggal WIB otomatis, dan catatan."
		},
		{
			property: "og:title",
			content: "Tambah Lamaran — Job Tracker"
		},
		{
			property: "og:description",
			content: "Catat lamaran kerja baru."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var ImportRoute = Route$3.update({
	id: "/import",
	path: "/import",
	getParentRoute: () => Route$5
});
var PanduanRoute = Route$2.update({
	id: "/panduan",
	path: "/panduan",
	getParentRoute: () => Route$5
});
var LamaranIndexRoute = Route$1.update({
	id: "/lamaran/",
	path: "/lamaran/",
	getParentRoute: () => Route$5
});
var rootRouteChildren = {
	IndexRoute,
	ImportRoute,
	PanduanRoute,
	LamaranBaruRoute: Route.update({
		id: "/lamaran/baru",
		path: "/lamaran/baru",
		getParentRoute: () => Route$5
	}),
	LamaranIndexRoute,
	LamaranIdEditRoute: Route$6.update({
		id: "/lamaran/$id/edit",
		path: "/lamaran/$id/edit",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
