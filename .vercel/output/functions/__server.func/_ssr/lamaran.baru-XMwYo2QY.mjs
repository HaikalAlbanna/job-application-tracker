import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./AppShell-Wh66hLzu.mjs";
import { a as addApplication } from "./StatusBadge-B95OIv_H.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ApplicationForm } from "./ApplicationForm-BKdO_vD0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lamaran.baru-XMwYo2QY.js
var import_jsx_runtime = require_jsx_runtime();
function NewPage() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Tambah Lamaran",
			description: "Isi data lamaran baru. Tanggal terisi otomatis dengan waktu Indonesia (WIB)."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationForm, {
			submitLabel: "Simpan Lamaran",
			onSubmit: (data) => {
				addApplication(data);
				toast.success(`Lamaran ${data.position} di ${data.company} tersimpan.`);
				navigate({ to: "/lamaran" });
			}
		})]
	});
}
//#endregion
export { NewPage as component };
