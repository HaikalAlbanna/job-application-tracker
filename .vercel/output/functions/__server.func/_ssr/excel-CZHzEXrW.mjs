import { d as parseDateFlexible, f as resolveStatus, l as formatDateID, p as todayWIB, r as STATUS_MAP } from "./StatusBadge-B95OIv_H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/excel-CZHzEXrW.js
var EXCEL_HEADERS = [
	"Tempat / Perusahaan",
	"Posisi",
	"Link Pendaftaran",
	"Status",
	"Tanggal Pendaftaran",
	"Catatan"
];
var normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
var COLUMN_ALIASES = {
	company: [
		"tempatperusahaan",
		"perusahaan",
		"tempat",
		"namaperusahaan",
		"company",
		"instansi"
	],
	position: [
		"posisi",
		"posisiyangdilamar",
		"position",
		"jabatan",
		"role"
	],
	link: [
		"linkpendaftaran",
		"link",
		"url",
		"tautan",
		"linkpendaftar"
	],
	status: ["status", "statuslamaran"],
	appliedDate: [
		"tanggalpendaftaran",
		"tanggal",
		"tanggaldaftar",
		"date",
		"applieddate"
	],
	notes: [
		"catatan",
		"notes",
		"keterangan",
		"note"
	]
};
function findKey(headers, aliases) {
	const map = new Map(headers.map((h) => [normalize(h), h]));
	for (const a of aliases) {
		const hit = map.get(a);
		if (hit) return hit;
	}
}
var isUrl = (s) => {
	try {
		const u = new URL(s);
		return u.protocol === "http:" || u.protocol === "https:";
	} catch {
		return false;
	}
};
async function parseExcelFile(file) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const buffer = await file.arrayBuffer();
	let workbook;
	try {
		workbook = XLSX.read(buffer, {
			type: "array",
			cellDates: true
		});
	} catch {
		throw new Error("File tidak dapat dibaca. Pastikan format file .xlsx atau .xls yang valid.");
	}
	const sheetName = workbook.SheetNames[0];
	if (!sheetName) throw new Error("File Excel tidak memiliki sheet.");
	const sheet = workbook.Sheets[sheetName];
	const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
	if (json.length === 0) throw new Error("Sheet pertama kosong. Tidak ada data yang dapat diimpor.");
	const headers = Object.keys(json[0]);
	const keyCompany = findKey(headers, COLUMN_ALIASES.company);
	const keyPosition = findKey(headers, COLUMN_ALIASES.position);
	if (!keyCompany || !keyPosition) throw new Error(`Kolom wajib tidak ditemukan. Pastikan ada kolom "Tempat / Perusahaan" dan "Posisi". Kolom terbaca: ${headers.join(", ")}`);
	const keyLink = findKey(headers, COLUMN_ALIASES.link);
	const keyStatus = findKey(headers, COLUMN_ALIASES.status);
	const keyDate = findKey(headers, COLUMN_ALIASES.appliedDate);
	const keyNotes = findKey(headers, COLUMN_ALIASES.notes);
	const str = (v) => v == null ? "" : String(v).trim();
	return {
		rows: json.map((raw, i) => {
			const errors = [];
			const company = str(raw[keyCompany]);
			const position = str(raw[keyPosition]);
			const link = keyLink ? str(raw[keyLink]) : "";
			const statusRaw = keyStatus ? raw[keyStatus] : "";
			const dateRaw = keyDate ? raw[keyDate] : "";
			const notes = keyNotes ? str(raw[keyNotes]) : "";
			if (!company) errors.push("Nama perusahaan kosong");
			if (!position) errors.push("Posisi kosong");
			if (link && !isUrl(link)) errors.push("Link bukan URL valid (harus diawali http:// atau https://)");
			let status = resolveStatus(statusRaw);
			if (!status) if (str(statusRaw)) errors.push(`Status "${str(statusRaw)}" tidak dikenali`);
			else status = "baru";
			let appliedDate = parseDateFlexible(dateRaw);
			if (!appliedDate) if (str(dateRaw)) errors.push(`Tanggal "${str(dateRaw)}" tidak valid (gunakan DD-MM-YYYY)`);
			else appliedDate = todayWIB();
			const data = errors.length === 0 && status && appliedDate ? {
				company,
				position,
				link,
				status,
				appliedDate,
				notes
			} : null;
			return {
				rowNumber: i + 2,
				data,
				raw,
				errors
			};
		}),
		sheetName
	};
}
function toSheetRows(apps) {
	return apps.map((a) => ({
		[EXCEL_HEADERS[0]]: a.company,
		[EXCEL_HEADERS[1]]: a.position,
		[EXCEL_HEADERS[2]]: a.link,
		[EXCEL_HEADERS[3]]: STATUS_MAP[a.status]?.label ?? a.status,
		[EXCEL_HEADERS[4]]: formatDateID(a.appliedDate),
		[EXCEL_HEADERS[5]]: a.notes
	}));
}
async function writeWorkbook(rows, filename) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const ws = XLSX.utils.json_to_sheet(rows, { header: [...EXCEL_HEADERS] });
	ws["!cols"] = [
		{ wch: 28 },
		{ wch: 24 },
		{ wch: 40 },
		{ wch: 20 },
		{ wch: 18 },
		{ wch: 40 }
	];
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Lamaran");
	XLSX.writeFile(wb, filename);
}
async function exportApplicationsToExcel(apps) {
	const stamp = todayWIB();
	await writeWorkbook(toSheetRows(apps), `lamaran-kerja-${stamp}.xlsx`);
}
async function downloadTemplate() {
	await writeWorkbook([{
		[EXCEL_HEADERS[0]]: "PT ABC Indonesia",
		[EXCEL_HEADERS[1]]: "IT Staff",
		[EXCEL_HEADERS[2]]: "https://www.jobstreet.co.id/",
		[EXCEL_HEADERS[3]]: "Menunggu Review",
		[EXCEL_HEADERS[4]]: "01-09-2026",
		[EXCEL_HEADERS[5]]: "Kontak HR: 0812xxxx"
	}], "template-import-lamaran.xlsx");
}
//#endregion
export { parseExcelFile as i, downloadTemplate as n, exportApplicationsToExcel as r, EXCEL_HEADERS as t };
