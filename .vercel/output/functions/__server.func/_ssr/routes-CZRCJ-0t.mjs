import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Activity, T as ArrowRight, _ as ClipboardList, c as MessagesSquare, l as LogOut, m as FileSpreadsheet, o as Plus, p as Hourglass, v as CircleX, x as Briefcase, y as CircleCheck } from "../_libs/lucide-react.mjs";
import { a as cn, n as Button, r as PageHeader } from "./AppShell-Wh66hLzu.mjs";
import { i as StatusBadge, l as formatDateID, n as STATUS_DOT, r as STATUS_MAP, t as STATUSES, u as monthLabel } from "./StatusBadge-B95OIv_H.mjs";
import { n as useHydrated, t as useApplications } from "./useApplications-DUtJUXw-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CZRCJ-0t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function computeStats(apps) {
	const count = (pred) => apps.filter(pred).length;
	return {
		total: apps.length,
		aktif: count((a) => STATUS_MAP[a.status]?.active),
		menunggu: count((a) => a.status === "baru" || a.status === "menunggu"),
		tes: count((a) => a.status === "tes"),
		interview: count((a) => a.status === "interview_hr" || a.status === "interview_user"),
		diterima: count((a) => a.status === "diterima"),
		ditolak: count((a) => a.status === "ditolak"),
		mundur: count((a) => a.status === "mundur")
	};
}
function Dashboard() {
	const apps = useApplications();
	const hydrated = useHydrated();
	const stats = (0, import_react.useMemo)(() => computeStats(apps), [apps]);
	const byStatus = (0, import_react.useMemo)(() => STATUSES.map((s) => ({
		...s,
		count: apps.filter((a) => a.status === s.value).length
	})), [apps]);
	const maxStatus = Math.max(1, ...byStatus.map((s) => s.count));
	const byMonth = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const a of apps) {
			const key = a.appliedDate.slice(0, 7);
			map.set(key, (map.get(key) ?? 0) + 1);
		}
		return [...map.entries()].sort(([a], [b]) => a < b ? -1 : 1).slice(-6).map(([key, count]) => ({
			key,
			label: monthLabel(`${key}-01`),
			count
		}));
	}, [apps]);
	const maxMonth = Math.max(1, ...byMonth.map((m) => m.count));
	const recent = (0, import_react.useMemo)(() => [...apps].sort((a, b) => a.appliedDate < b.appliedDate ? 1 : a.appliedDate > b.appliedDate ? -1 : b.createdAt.localeCompare(a.createdAt)).slice(0, 6), [apps]);
	const cards = [
		{
			label: "Total Lamaran",
			value: stats.total,
			icon: Briefcase,
			tone: "text-primary bg-primary-soft"
		},
		{
			label: "Aktif / Dalam Proses",
			value: stats.aktif,
			icon: Activity,
			tone: "text-status-baru bg-status-baru/12"
		},
		{
			label: "Menunggu Review",
			value: stats.menunggu,
			icon: Hourglass,
			tone: "text-status-menunggu bg-status-menunggu/15"
		},
		{
			label: "Sedang Tes",
			value: stats.tes,
			icon: ClipboardList,
			tone: "text-status-tes bg-status-tes/12"
		},
		{
			label: "Sedang Interview",
			value: stats.interview,
			icon: MessagesSquare,
			tone: "text-status-interview-hr bg-status-interview-hr/12"
		},
		{
			label: "Diterima",
			value: stats.diterima,
			icon: CircleCheck,
			tone: "text-status-diterima bg-status-diterima/12"
		},
		{
			label: "Ditolak",
			value: stats.ditolak,
			icon: CircleX,
			tone: "text-status-ditolak bg-status-ditolak/12"
		},
		{
			label: "Mengundurkan Diri",
			value: stats.mundur,
			icon: LogOut,
			tone: "text-status-mundur bg-status-mundur/12"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dashboard",
			description: "Ringkasan seluruh lamaran kerja Anda. Diperbarui otomatis saat data berubah.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/import",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, {}), " Import Excel"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "shadow-float",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/lamaran/baru",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Tambah Lamaran"]
				})
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-4",
			children: cards.map(({ label, value, icon: Icon, tone }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("grid size-9 shrink-0 place-items-center rounded-lg", tone),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-3xl font-extrabold tabular-nums tracking-tight",
					children: hydrated ? value : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-8 w-12 animate-pulse rounded bg-muted" })
				})]
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 grid gap-6 lg:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface p-6 lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: "Lamaran per Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [stats.total, " total"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: byStatus.map((s) => {
						const pct = stats.total ? Math.round(s.count / stats.total * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "grid grid-cols-[150px_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[170px_1fr_auto]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 truncate font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 shrink-0 rounded-full", STATUS_DOT[s.value]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: s.label
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2.5 overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-full rounded-full transition-all duration-500", STATUS_DOT[s.value]),
										style: { width: `${s.count / maxStatus * 100}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-20 text-right tabular-nums text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: s.count
										}),
										" · ",
										pct,
										"%"
									]
								})
							]
						}, s.value);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface p-6 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-lg font-bold",
					children: "Lamaran per Bulan"
				}), byMonth.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "Belum ada data."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-48 items-end gap-3",
					children: byMonth.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold tabular-nums",
								children: m.count
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative w-full flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-x-0 bottom-0 rounded-t-md bg-primary/85 transition-all duration-500",
									style: { height: `${Math.max(6, m.count / maxMonth * 100)}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: m.label
							})
						]
					}, m.key))
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "surface mt-6 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: "Lamaran Terbaru"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/lamaran",
					className: "inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline",
					children: ["Lihat semua ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				})]
			}), hydrated && recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-dashed p-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Belum ada lamaran yang dicatat."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Mulai dengan menambah lamaran atau mengimpor file Excel lama Anda."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y",
				children: recent.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-semibold",
								children: a.position
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-muted-foreground",
								children: a.company
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: a.status }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden w-24 text-right text-sm tabular-nums text-muted-foreground sm:block",
							children: formatDateID(a.appliedDate)
						})
					]
				}, a.id))
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };
