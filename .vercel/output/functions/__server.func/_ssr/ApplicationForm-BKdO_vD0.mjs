import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as CalendarDays } from "../_libs/lucide-react.mjs";
import { n as Button } from "./AppShell-Wh66hLzu.mjs";
import { i as StatusBadge, l as formatDateID, p as todayWIB, t as STATUSES } from "./StatusBadge-B95OIv_H.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ApplicationForm-BKdO_vD0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	company: stringType().trim().min(1, "Nama perusahaan wajib diisi").max(150, "Maksimal 150 karakter"),
	position: stringType().trim().min(1, "Posisi wajib diisi").max(150, "Maksimal 150 karakter"),
	link: stringType().trim().max(2e3, "Link terlalu panjang").refine((v) => v === "" || /^https?:\/\/.+/i.test(v), "Link harus diawali http:// atau https://"),
	status: enumType(STATUSES.map((s) => s.value)),
	appliedDate: stringType().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal wajib diisi"),
	notes: stringType().trim().max(2e3, "Catatan maksimal 2000 karakter")
});
function ApplicationForm({ initial, onSubmit, submitLabel }) {
	const navigate = useNavigate();
	const [values, setValues] = (0, import_react.useState)({
		company: initial?.company ?? "",
		position: initial?.position ?? "",
		link: initial?.link ?? "",
		status: initial?.status ?? "baru",
		appliedDate: initial?.appliedDate ?? todayWIB(),
		notes: initial?.notes ?? ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const set = (key, value) => {
		setValues((v) => ({
			...v,
			[key]: value
		}));
		if (errors[key]) setErrors((e) => ({
			...e,
			[key]: void 0
		}));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const result = schema.safeParse(values);
		if (!result.success) {
			const next = {};
			for (const issue of result.error.issues) {
				const key = issue.path[0];
				if (!next[key]) next[key] = issue.message;
			}
			setErrors(next);
			return;
		}
		setSaving(true);
		onSubmit(result.data);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "surface p-6 sm:p-8",
		noValidate: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nama Perusahaan / Tempat",
					required: true,
					error: errors.company,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "PT ABC Indonesia",
						value: values.company,
						onChange: (e) => set("company", e.target.value),
						autoFocus: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Posisi yang Dilamar",
					required: true,
					error: errors.position,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "IT Staff, Admin, Data Analyst",
						value: values.position,
						onChange: (e) => set("position", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Link Pendaftaran",
					error: errors.link,
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						type: "url",
						placeholder: "https://www.jobstreet.co.id/...",
						value: values.link,
						onChange: (e) => set("link", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Status Lamaran",
					required: true,
					error: errors.status,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "field",
						value: values.status,
						onChange: (e) => set("status", e.target.value),
						children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.value,
							children: s.label
						}, s.value))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: values.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: STATUSES.find((s) => s.value === values.status)?.description })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tanggal Pendaftaran",
					required: true,
					error: errors.appliedDate,
					hint: `Otomatis terisi hari ini (WIB). Tampil sebagai ${formatDateID(values.appliedDate)}.`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field pr-10",
							type: "date",
							value: values.appliedDate,
							max: "2200-12-31",
							onChange: (e) => set("appliedDate", e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Catatan",
					error: errors.notes,
					className: "sm:col-span-2",
					hint: "Opsional. Jadwal interview, hasil tes, kontak HR, dll.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field h-28 resize-y py-2",
						placeholder: "Contoh: Interview HR Senin 22 Sep pukul 10.00 via Zoom",
						value: values.notes,
						onChange: (e) => set("notes", e.target.value)
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 flex flex-wrap items-center justify-end gap-3 border-t pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				onClick: () => navigate({ to: "/lamaran" }),
				children: "Batal"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: saving,
				className: "shadow-float",
				children: saving ? "Menyimpan..." : submitLabel
			})]
		})]
	});
}
function Field({ label, required, error, hint, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `block ${className ?? ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mb-1.5 block text-sm font-semibold text-foreground",
				children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-0.5 text-destructive",
					children: "*"
				})]
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-xs font-medium text-destructive",
				children: error
			}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { ApplicationForm as t };
