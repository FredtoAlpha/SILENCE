import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lire._slug-CCYNmVQe.js
var import_jsx_runtime = require_jsx_runtime();
function NotFoundEpisode() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Épisode introuvable"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/sommaire",
			className: "mt-4 inline-block text-fg-muted underline",
			children: "Retour au sommaire"
		})] })
	});
}
//#endregion
export { NotFoundEpisode as notFoundComponent };
