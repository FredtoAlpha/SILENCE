import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Moon, i as Sun, n as Type, t as X } from "../_libs/lucide-react.mjs";
import { s as useProgress } from "./router-DdT8GJ8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reader-bar-C69-oO0w.js
var import_jsx_runtime = require_jsx_runtime();
function ReaderBar({ current, total, title }) {
	const theme = useProgress((s) => s.theme);
	const fontScale = useProgress((s) => s.fontScale);
	const setTheme = useProgress((s) => s.setTheme);
	const setFontScale = useProgress((s) => s.setFontScale);
	const cycleFont = () => {
		const next = (fontScale + 1) % 3;
		setFontScale(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/70 bg-bg/90 px-3 backdrop-blur-md sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg",
				"aria-label": "Fermer et revenir à la couverture",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "size-5",
					strokeWidth: 1.6
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-w-0 flex-1 truncate text-center font-display text-sm tracking-wide text-fg-muted sm:text-base",
				children: typeof current === "number" && typeof total === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums text-fg",
					children: [
						current,
						" / ",
						total
					]
				}), title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden sm:inline",
					children: [" · ", title]
				}) : null] }) : title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: cycleFont,
					className: "flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg",
					"aria-label": "Changer la taille du texte",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, {
						className: "size-5",
						strokeWidth: 1.6
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTheme(theme === "paper" ? "night" : "paper"),
					className: "flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg",
					"aria-label": theme === "paper" ? "Passer en mode nuit" : "Passer en mode jour",
					children: theme === "paper" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
						className: "size-5",
						strokeWidth: 1.6
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
						className: "size-5",
						strokeWidth: 1.6
					})
				})]
			})
		]
	});
}
var FONT_CLASS = {
	0: "text-[1.02rem] leading-[1.7] sm:text-[1.08rem]",
	1: "text-[1.12rem] leading-[1.72] sm:text-[1.2rem]",
	2: "text-[1.26rem] leading-[1.75] sm:text-[1.35rem]"
};
//#endregion
export { ReaderBar as n, FONT_CLASS as t };
