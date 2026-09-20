import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Download } from "../_libs/lucide-react.mjs";
import { n as Button, r as PageHeader } from "./AppShell-Wh66hLzu.mjs";
import { i as StatusBadge, t as STATUSES } from "./StatusBadge-B95OIv_H.mjs";
import { n as downloadTemplate, t as EXCEL_HEADERS } from "./excel-CZHzEXrW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panduan-BZOZ7psv.js
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE = [[
	"PT ABC Indonesia",
	"IT Staff",
	"https://www.jobstreet.co.id/...",
	"Menunggu Review",
	"01-09-2026",
	"Kontak HR: 0812xxxx"
], [
	"Bank XYZ",
	"Data Analyst",
	"https://www.linkedin.com/jobs/...",
	"Interview HR",
	"05-09-2026",
	"Interview Senin 10.00"
]];
function GuidePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Panduan Penggunaan",
				description: "Semua yang perlu Anda ketahui untuk memakai Job Tracker."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "1. Mencatat lamaran",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "list-decimal space-y-1.5 pl-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Klik ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tambah Lamaran" }),
							" di pojok kanan atas."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Isi nama perusahaan dan posisi (wajib), link pendaftaran, status, dan catatan." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tanggal pendaftaran terisi otomatis dengan tanggal hari ini (WIB) — ubah manual jika mencatat lamaran lama." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Buka ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/lamaran",
								className: "font-semibold text-primary hover:underline",
								children: "Daftar Lamaran"
							}),
							" untuk mencari, memfilter status, mengurutkan tanggal, mengedit, atau menghapus."
						] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "2. Arti setiap status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2 sm:grid-cols-2",
					children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 rounded-lg bg-muted/50 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: s.value,
							className: "mt-0.5 shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: s.description
						})]
					}, s.value))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: [
						"Status ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Baru Didaftarkan" }),
						" sampai ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Offering" }),
						" dihitung sebagai lamaran ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "aktif" }),
						" di dashboard."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "3. Import data dari Excel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Buka ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/import",
							className: "font-semibold text-primary hover:underline",
							children: "Import Excel"
						}),
						", pilih file .xlsx/.xls, periksa preview, lalu klik ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tambahkan" }),
						". Data lama tidak dihapus — data hasil import ditambahkan ke daftar."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto rounded-lg border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[720px] text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: EXCEL_HEADERS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left font-semibold",
									children: h
								}, h)) })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: SAMPLE.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "border-t",
								children: row.map((cell, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-muted-foreground",
									children: cell
								}, j))
							}, i)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Kolom ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tempat / Perusahaan" }),
								" dan ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Posisi" }),
								" wajib diisi; kolom lain opsional."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Status ditulis sesuai nama di atas (huruf besar/kecil tidak berpengaruh). Kosong → Baru Didaftarkan." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tanggal boleh DD-MM-YYYY, DD/MM/YYYY, atau format tanggal Excel. Kosong → hari ini." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "mt-4",
						onClick: () => downloadTemplate(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Unduh template Excel"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "4. Penyimpanan, backup, dan restore",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Aplikasi ini berjalan sepenuhnya di browser dan menyimpan data di ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "localStorage" }),
					" browser Anda. Data tetap ada setelah halaman di-refresh atau browser ditutup, tanpa memerlukan server atau database online."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 list-disc space-y-1 pl-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Backup:" }),
							" klik ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Export Excel" }),
							" di Daftar Lamaran untuk mengunduh seluruh data."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Restore:" }), " impor kembali file hasil export lewat halaman Import Excel."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Data terikat pada browser dan perangkat ini. Membersihkan data situs (clear site data) atau memakai mode incognito akan menghapus data — lakukan export secara berkala." })
					]
				})]
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface p-6 text-sm leading-relaxed",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-lg font-bold",
			children: title
		}), children]
	});
}
//#endregion
export { GuidePage as component };
