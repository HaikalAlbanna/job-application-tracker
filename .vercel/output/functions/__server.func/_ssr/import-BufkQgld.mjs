import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Download, m as FileSpreadsheet, n as Upload, r as TriangleAlert, t as X, y as CircleCheck } from "../_libs/lucide-react.mjs";
import { a as cn, n as Button, r as PageHeader } from "./AppShell-Wh66hLzu.mjs";
import { i as StatusBadge, l as formatDateID, o as addManyApplications } from "./StatusBadge-B95OIv_H.mjs";
import { i as parseExcelFile, n as downloadTemplate, t as EXCEL_HEADERS } from "./excel-CZHzEXrW.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-BufkQgld.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImportPage() {
	const navigate = useNavigate();
	const inputRef = (0, import_react.useRef)(null);
	const [fileName, setFileName] = (0, import_react.useState)(null);
	const [rows, setRows] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const handleFile = async (file) => {
		if (!file) return;
		setError(null);
		setRows(null);
		if (!/\.(xlsx|xls)$/i.test(file.name)) {
			setError("Format file tidak didukung. Gunakan file .xlsx atau .xls.");
			return;
		}
		setFileName(file.name);
		setLoading(true);
		try {
			const result = await parseExcelFile(file);
			setRows(result.rows);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Gagal membaca file.");
			setFileName(null);
		} finally {
			setLoading(false);
		}
	};
	const reset = () => {
		setRows(null);
		setFileName(null);
		setError(null);
		if (inputRef.current) inputRef.current.value = "";
	};
	const valid = rows?.filter((r) => r.data) ?? [];
	const invalid = rows?.filter((r) => !r.data) ?? [];
	const handleImport = () => {
		if (valid.length === 0) return;
		const n = addManyApplications(valid.map((r) => r.data));
		toast.success(`${n} data berhasil diimpor.${invalid.length ? ` ${invalid.length} baris dilewati karena tidak valid.` : ""}`);
		navigate({ to: "/lamaran" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Import Excel",
		description: "Masukkan data lamaran lama dari file .xlsx / .xls. Data baru akan ditambahkan tanpa menghapus data yang sudah ada.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			onClick: () => downloadTemplate(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Unduh Template"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			!rows && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				onDragOver: (e) => {
					e.preventDefault();
					setDragging(true);
				},
				onDragLeave: () => setDragging(false),
				onDrop: (e) => {
					e.preventDefault();
					setDragging(false);
					handleFile(e.dataTransfer.files[0]);
				},
				className: cn("surface flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-12 text-center transition-colors", dragging ? "border-primary bg-primary-soft/50" : "hover:border-primary/50 hover:bg-muted/40"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "file",
						accept: ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
						className: "sr-only",
						onChange: (e) => handleFile(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-7 animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base font-bold",
						children: loading ? "Membaca file..." : "Pilih atau seret file Excel ke sini"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Mendukung .xlsx dan .xls. Sheet pertama akan dibaca."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-5 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-float",
						children: "Import Excel"
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 p-4 text-sm text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error })]
			}),
			rows && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b bg-muted/60 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4 shrink-0 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate font-semibold",
									children: fileName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										"· ",
										rows.length,
										" baris"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-xs font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-success",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }),
										" ",
										valid.length,
										" valid"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("inline-flex items-center gap-1", invalid.length ? "text-destructive" : "text-muted-foreground"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5" }),
										" ",
										invalid.length,
										" gagal"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: reset,
									"aria-label": "Batalkan",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[520px] overflow-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[820px] text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "sticky top-0 bg-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b text-left text-xs uppercase tracking-wide text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2 font-semibold",
											children: "#"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2 font-semibold",
											children: "Perusahaan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2 font-semibold",
											children: "Posisi"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2 font-semibold",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2 font-semibold",
											children: "Tanggal"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2 font-semibold",
											children: "Keterangan"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: cn("border-b last:border-0", !r.data && "bg-destructive/5"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 tabular-nums text-muted-foreground",
										children: r.rowNumber
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 font-medium",
										children: r.data?.company ?? String(Object.values(r.raw)[0] ?? "")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: r.data?.position ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: r.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.data.status }) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 tabular-nums",
										children: r.data ? formatDateID(r.data.appliedDate) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: r.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-success",
											children: "Siap diimpor"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "text-xs text-destructive",
											children: r.errors.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, e))
										})
									})
								]
							}, r.rowNumber)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Baris yang gagal akan dilewati. Perbaiki di Excel lalu impor ulang jika perlu."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: reset,
								children: "Pilih file lain"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleImport,
								disabled: valid.length === 0,
								className: "shadow-float",
								children: [
									"Tambahkan ",
									valid.length,
									" data"
								]
							})]
						})]
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "surface h-fit p-5 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Format kolom Excel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Baris pertama adalah judul kolom. Urutan kolom bebas."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: EXCEL_HEADERS.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start justify-between gap-2 rounded-md bg-muted/60 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: h
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: i < 2 ? "wajib" : "opsional"
						})]
					}, h))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1.5 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"• Status kosong → ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Baru Didaftarkan" }),
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "• Tanggal kosong → hari ini (WIB). Format DD-MM-YYYY, DD/MM/YYYY, atau tanggal Excel." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "• Status harus sesuai salah satu nama status di aplikasi." })
					]
				})
			]
		})]
	})] });
}
//#endregion
export { ImportPage as component };
