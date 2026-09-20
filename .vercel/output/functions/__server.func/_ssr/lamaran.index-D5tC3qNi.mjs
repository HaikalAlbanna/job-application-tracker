import { i as __toESM } from "../_runtime.mjs";
import { a as Overlay2, c as Title2, d as require_jsx_runtime, f as require_react, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ArrowDownWideNarrow, a as Search, f as Inbox, g as Download, h as ExternalLink, i as Trash2, m as FileSpreadsheet, o as Plus, s as Pencil, w as ArrowUpNarrowWide } from "../_libs/lucide-react.mjs";
import { a as cn, i as buttonVariants, n as Button, r as PageHeader } from "./AppShell-Wh66hLzu.mjs";
import { c as deleteApplication, i as StatusBadge, l as formatDateID, t as STATUSES } from "./StatusBadge-B95OIv_H.mjs";
import { r as exportApplicationsToExcel } from "./excel-CZHzEXrW.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useHydrated, t as useApplications } from "./useApplications-DUtJUXw-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lamaran.index-D5tC3qNi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function ApplicationTable({ applications, hydrated, emptyMessage }) {
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const confirmDelete = () => {
		if (!pendingDelete) return;
		deleteApplication(pendingDelete.id);
		toast.success(`Lamaran di ${pendingDelete.company} dihapus.`);
		setPendingDelete(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[880px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold",
							children: "Perusahaan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold",
							children: "Posisi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold",
							children: "Link"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold",
							children: "Tanggal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold",
							children: "Catatan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right font-semibold",
							children: "Aksi"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: !hydrated ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b last:border-0",
					children: Array.from({ length: 7 }).map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 animate-pulse rounded bg-muted" })
					}, j))
				}, i)) : applications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
					colSpan: 7,
					className: "px-4 py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "mx-auto mb-3 size-10 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: emptyMessage ?? "Belum ada data lamaran"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Tambah lamaran baru atau impor dari file Excel."
						})
					]
				}) }) : applications.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b transition-colors last:border-0 hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "max-w-[220px] px-4 py-3 font-semibold text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-2",
								children: a.company
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "max-w-[200px] px-4 py-3 text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-2",
								children: a.position
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: a.link ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: a.link,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex items-center gap-1 font-medium text-primary hover:underline",
								children: ["Buka ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "—"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: a.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "whitespace-nowrap px-4 py-3 tabular-nums text-foreground",
							children: formatDateID(a.appliedDate)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "max-w-[260px] px-4 py-3 text-muted-foreground",
							children: a.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-2",
								title: a.notes,
								children: a.notes
							}) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "ghost",
									size: "icon",
									"aria-label": "Edit",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/lamaran/$id/edit",
										params: { id: a.id },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Hapus",
									className: "text-destructive hover:bg-destructive/10 hover:text-destructive",
									onClick: () => setPendingDelete(a),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})]
							})
						})
					]
				}, a.id)) })]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: !!pendingDelete,
		onOpenChange: (open) => !open && setPendingDelete(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus lamaran ini?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
			"Data lamaran ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pendingDelete?.position }),
			" di",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pendingDelete?.company }),
			" akan dihapus permanen dan tidak dapat dikembalikan."
		] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			onClick: confirmDelete,
			className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			children: "Hapus"
		})] })] })
	})] });
}
function ListPage() {
	const apps = useApplications();
	const hydrated = useHydrated();
	const [query, setQuery] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("desc");
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return apps.filter((a) => status === "all" || a.status === status).filter((a) => !q || a.company.toLowerCase().includes(q) || a.position.toLowerCase().includes(q)).sort((a, b) => {
			const cmp = a.appliedDate.localeCompare(b.appliedDate) || a.createdAt.localeCompare(b.createdAt);
			return sort === "desc" ? -cmp : cmp;
		});
	}, [
		apps,
		query,
		status,
		sort
	]);
	const handleExport = async () => {
		if (apps.length === 0) {
			toast.error("Belum ada data untuk diekspor.");
			return;
		}
		setExporting(true);
		try {
			await exportApplicationsToExcel(apps);
			toast.success(`${apps.length} data diekspor ke Excel.`);
		} catch (e) {
			toast.error("Gagal mengekspor data.");
			console.error(e);
		} finally {
			setExporting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Daftar Lamaran",
			description: hydrated ? `${apps.length} lamaran tercatat` : "Memuat data...",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: handleExport,
					disabled: exporting,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}),
						" ",
						exporting ? "Mengekspor..." : "Export Excel"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/import",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, {}), " Import"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "shadow-float",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/lamaran/baru",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Tambah"]
					})
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 sm:grid-cols-[1fr_220px_auto]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field pl-9",
						placeholder: "Cari perusahaan atau posisi...",
						value: query,
						onChange: (e) => setQuery(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "field",
					value: status,
					onChange: (e) => setStatus(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "Semua status"
					}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.value,
						children: s.label
					}, s.value))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "h-10",
					onClick: () => setSort((s) => s === "desc" ? "asc" : "desc"),
					children: [sort === "desc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownWideNarrow, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpNarrowWide, {}), sort === "desc" ? "Terbaru" : "Terlama"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationTable, {
			applications: filtered,
			hydrated,
			emptyMessage: apps.length > 0 ? "Tidak ada lamaran yang cocok dengan pencarian/filter" : void 0
		}),
		hydrated && apps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-xs text-muted-foreground",
			children: [
				"Menampilkan ",
				filtered.length,
				" dari ",
				apps.length,
				" lamaran."
			]
		})
	] });
}
//#endregion
export { ListPage as component };
