import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button, r as PageHeader } from "./AppShell-Wh66hLzu.mjs";
import { m as updateApplication } from "./StatusBadge-B95OIv_H.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./lamaran._id.edit-DcY9aWYg.mjs";
import { n as useHydrated, t as useApplications } from "./useApplications-DUtJUXw-.mjs";
import { t as ApplicationForm } from "./ApplicationForm-BKdO_vD0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lamaran._id.edit-DUQQ6IUT.js
var import_jsx_runtime = require_jsx_runtime();
function EditPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const apps = useApplications();
	const hydrated = useHydrated();
	const app = apps.find((a) => a.id === id);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "surface mx-auto h-96 max-w-3xl animate-pulse" });
	if (!app) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface mx-auto max-w-lg p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold",
				children: "Lamaran tidak ditemukan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Data mungkin sudah dihapus."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lamaran",
					children: "Kembali ke daftar"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Edit Lamaran",
			description: `${app.position} — ${app.company}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationForm, {
			initial: app,
			submitLabel: "Simpan Perubahan",
			onSubmit: (data) => {
				updateApplication(app.id, data);
				toast.success("Perubahan tersimpan.");
				navigate({ to: "/lamaran" });
			}
		}, app.id)]
	});
}
//#endregion
export { EditPage as component };
