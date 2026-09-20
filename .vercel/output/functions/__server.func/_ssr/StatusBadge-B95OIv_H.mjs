import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn } from "./AppShell-Wh66hLzu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatusBadge-B95OIv_H.js
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	{
		value: "baru",
		label: "Baru Didaftarkan",
		description: "Lamaran baru saja dikirim.",
		color: "status-baru",
		active: true
	},
	{
		value: "menunggu",
		label: "Menunggu Review",
		description: "Menunggu perusahaan meninjau lamaran.",
		color: "status-menunggu",
		active: true
	},
	{
		value: "screening",
		label: "Lolos Screening",
		description: "Lolos seleksi administrasi / screening awal.",
		color: "status-screening",
		active: true
	},
	{
		value: "tes",
		label: "Tes / Assessment",
		description: "Sedang menjalani tes kemampuan, psikotes, atau assessment.",
		color: "status-tes",
		active: true
	},
	{
		value: "interview_hr",
		label: "Interview HR",
		description: "Sedang mengikuti wawancara HR.",
		color: "status-interview-hr",
		active: true
	},
	{
		value: "interview_user",
		label: "Interview User",
		description: "Sedang mengikuti wawancara dengan user / departemen terkait.",
		color: "status-interview-user",
		active: true
	},
	{
		value: "offering",
		label: "Offering",
		description: "Mendapatkan penawaran pekerjaan.",
		color: "status-offering",
		active: true
	},
	{
		value: "diterima",
		label: "Diterima",
		description: "Berhasil diterima bekerja.",
		color: "status-diterima",
		active: false
	},
	{
		value: "ditolak",
		label: "Ditolak",
		description: "Lamaran tidak berhasil atau ditolak.",
		color: "status-ditolak",
		active: false
	},
	{
		value: "mundur",
		label: "Mengundurkan Diri",
		description: "Mengundurkan diri dari proses rekrutmen.",
		color: "status-mundur",
		active: false
	},
	{
		value: "tidak_ada_kabar",
		label: "Tidak Ada Kabar",
		description: "Tidak ada informasi lanjutan dari perusahaan.",
		color: "status-tidak-ada-kabar",
		active: false
	},
	{
		value: "ditutup",
		label: "Lowongan Ditutup",
		description: "Lowongan sudah ditutup oleh perusahaan.",
		color: "status-ditutup",
		active: false
	}
];
var STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.value, s]));
/** Match a free-text status (label or value, case-insensitive) to a status value. */
function resolveStatus(raw) {
	if (raw == null) return null;
	const text = String(raw).trim().toLowerCase();
	if (!text) return null;
	const normalized = text.replace(/[^a-z]/g, "");
	for (const s of STATUSES) {
		if (s.value === text) return s.value;
		if (s.label.toLowerCase() === text) return s.value;
		if (s.label.toLowerCase().replace(/[^a-z]/g, "") === normalized) return s.value;
	}
	return null;
}
function todayWIB() {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Jakarta",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(/* @__PURE__ */ new Date());
}
/** YYYY-MM-DD -> DD-MM-YYYY */
function formatDateID(iso) {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!m) return iso;
	return `${m[3]}-${m[2]}-${m[1]}`;
}
/** Month label from YYYY-MM-DD, e.g. "Sep 2026" */
function monthLabel(iso) {
	const [y, m] = iso.split("-");
	return `${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"Mei",
		"Jun",
		"Jul",
		"Agu",
		"Sep",
		"Okt",
		"Nov",
		"Des"
	][Number(m) - 1] ?? m} ${y}`;
}
var pad = (n) => String(n).padStart(2, "0");
function validYMD(y, m, d) {
	if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2200) return null;
	return `${y}-${pad(m)}-${pad(d)}`;
}
/** Parse many date shapes (DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, Excel serial, Date) into YYYY-MM-DD. */
function parseDateFlexible(raw) {
	if (raw == null || raw === "") return null;
	if (raw instanceof Date && !isNaN(raw.getTime())) return validYMD(raw.getFullYear(), raw.getMonth() + 1, raw.getDate());
	if (typeof raw === "number") {
		const ms = Math.round((raw - 25569) * 86400 * 1e3);
		const d = new Date(ms);
		return validYMD(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
	}
	const text = String(raw).trim();
	let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(text);
	if (m) return validYMD(Number(m[1]), Number(m[2]), Number(m[3]));
	m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(text);
	if (m) return validYMD(Number(m[3]), Number(m[2]), Number(m[1]));
	const d = new Date(text);
	if (!isNaN(d.getTime())) return validYMD(d.getFullYear(), d.getMonth() + 1, d.getDate());
	return null;
}
var STORAGE_KEY = "job-tracker:applications:v1";
var EMPTY = [];
var cache = null;
var listeners = /* @__PURE__ */ new Set();
function read() {
	if (cache) return cache;
	if (typeof window === "undefined") return EMPTY;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		cache = Array.isArray(parsed) ? parsed : [];
	} catch {
		cache = [];
	}
	return cache;
}
function write(next) {
	cache = next;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	} catch (e) {
		console.error("Gagal menyimpan ke localStorage", e);
	}
	listeners.forEach((l) => l());
}
if (typeof window !== "undefined") window.addEventListener("storage", (e) => {
	if (e.key === STORAGE_KEY) {
		cache = null;
		listeners.forEach((l) => l());
	}
});
var applicationStore = {
	subscribe(listener) {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},
	getSnapshot: () => read(),
	getServerSnapshot: () => EMPTY
};
function newId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function addApplication(input) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const app = {
		...input,
		id: newId(),
		createdAt: now,
		updatedAt: now
	};
	write([app, ...read()]);
	return app;
}
function addManyApplications(inputs) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const apps = inputs.map((input) => ({
		...input,
		id: newId(),
		createdAt: now,
		updatedAt: now
	}));
	write([...apps, ...read()]);
	return apps.length;
}
function updateApplication(id, input) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	write(read().map((a) => a.id === id ? {
		...a,
		...input,
		updatedAt: now
	} : a));
}
function deleteApplication(id) {
	write(read().filter((a) => a.id !== id));
}
var COLOR_CLASSES = {
	baru: "bg-status-baru/12 text-status-baru border-status-baru/25",
	menunggu: "bg-status-menunggu/15 text-status-menunggu border-status-menunggu/30",
	screening: "bg-status-screening/12 text-status-screening border-status-screening/25",
	tes: "bg-status-tes/12 text-status-tes border-status-tes/25",
	interview_hr: "bg-status-interview-hr/12 text-status-interview-hr border-status-interview-hr/25",
	interview_user: "bg-status-interview-user/12 text-status-interview-user border-status-interview-user/25",
	offering: "bg-status-offering/15 text-status-offering border-status-offering/30",
	diterima: "bg-status-diterima/12 text-status-diterima border-status-diterima/25",
	ditolak: "bg-status-ditolak/12 text-status-ditolak border-status-ditolak/25",
	mundur: "bg-status-mundur/12 text-status-mundur border-status-mundur/25",
	tidak_ada_kabar: "bg-status-tidak-ada-kabar/15 text-status-tidak-ada-kabar border-status-tidak-ada-kabar/30",
	ditutup: "bg-status-ditutup/12 text-status-ditutup border-status-ditutup/25"
};
var STATUS_DOT = {
	baru: "bg-status-baru",
	menunggu: "bg-status-menunggu",
	screening: "bg-status-screening",
	tes: "bg-status-tes",
	interview_hr: "bg-status-interview-hr",
	interview_user: "bg-status-interview-user",
	offering: "bg-status-offering",
	diterima: "bg-status-diterima",
	ditolak: "bg-status-ditolak",
	mundur: "bg-status-mundur",
	tidak_ada_kabar: "bg-status-tidak-ada-kabar",
	ditutup: "bg-status-ditutup"
};
function StatusBadge({ status, className }) {
	const meta = STATUS_MAP[status];
	if (!meta) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold", COLOR_CLASSES[status], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", STATUS_DOT[status]) }), meta.label]
	});
}
//#endregion
export { addApplication as a, deleteApplication as c, parseDateFlexible as d, resolveStatus as f, StatusBadge as i, formatDateID as l, updateApplication as m, STATUS_DOT as n, addManyApplications as o, todayWIB as p, STATUS_MAP as r, applicationStore as s, STATUSES as t, monthLabel as u };
