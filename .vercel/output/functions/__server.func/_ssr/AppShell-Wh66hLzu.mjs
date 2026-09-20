import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react, l as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as BookOpen, S as BriefcaseBusiness, d as LayoutDashboard, m as FileSpreadsheet, o as Plus, u as ListChecks } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-Wh66hLzu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var NAV = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/lamaran",
		label: "Daftar Lamaran",
		icon: ListChecks
	},
	{
		to: "/import",
		label: "Import Excel",
		icon: FileSpreadsheet
	},
	{
		to: "/panduan",
		label: "Panduan",
		icon: BookOpen
	}
];
function AppShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b bg-card/80 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-float",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden truncate text-base font-extrabold tracking-tight sm:block",
								children: "Job Tracker"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ml-2 flex flex-1 items-center gap-1 overflow-x-auto",
							children: NAV.map(({ to, label, icon: Icon, ...rest }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to,
								activeOptions: { exact: "exact" in rest },
								className: "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
								activeProps: { className: "bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden md:inline",
									children: label
								})]
							}, to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "shrink-0 shadow-float",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/lamaran/baru",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Tambah Lamaran"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "Tambah"
									})
								]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto max-w-7xl px-4 pb-8 text-xs text-muted-foreground sm:px-6",
				children: "Data tersimpan secara lokal di browser ini. Ekspor ke Excel secara berkala untuk cadangan."
			})
		]
	});
}
function PageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold tracking-tight sm:text-3xl",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			})]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 flex-wrap gap-2",
			children: actions
		})]
	});
}
//#endregion
export { cn as a, buttonVariants as i, Button as n, PageHeader as r, AppShell as t };
