import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ReaderBar } from "./reader-bar-C69-oO0w.mjs";
import { i as SOURCES, t as AFTERWORD } from "./book-DtWYxc3o.mjs";
import { t as RichParagraphs } from "./rich-text-Jvg5_Dq4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fin-0HQGXdZQ.js
var import_jsx_runtime = require_jsx_runtime();
function Afterword() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReaderBar, { title: "Après la nouvelle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto w-full max-w-[40rem] px-5 pb-24 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
					className: "mt-6 overflow-hidden rounded-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/art/testas.jpg",
						alt: "Une femme assise sur un quai, de dos, regardant le fleuve.",
						className: "aspect-[16/9] w-full object-cover object-center"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs tracking-[0.22em] text-fg-muted uppercase",
							children: "Après la nouvelle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-[2.15rem] leading-[1.05] font-semibold tracking-tight sm:text-5xl",
							children: "Le vrai et l’inventé"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-serif text-[1.08rem] leading-relaxed text-fg-muted",
							children: "Tu as lu une histoire. Voici ce qui reste quand on referme le livre."
						})
					]
				}),
				AFTERWORD.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: section.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichParagraphs, {
						paragraphs: section.paragraphs,
						className: "mt-4 font-serif text-[1.08rem] leading-[1.7] text-fg"
					})]
				}, section.title)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "Sources principales"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-[0.98rem] leading-relaxed",
						children: SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: s.href,
							target: "_blank",
							rel: "noreferrer",
							className: "text-fg underline decoration-border underline-offset-4 hover:decoration-accent",
							children: s.label
						}) }, s.href))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-14 font-display text-lg text-fg-muted italic",
					children: "Si ces pages t’ont traversé, parle-en à quelqu’un. L’histoire tient mieux à deux que seule, le soir."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/carte",
						className: "inline-flex h-12 items-center justify-center rounded-lg bg-fg px-5 font-display text-lg font-semibold text-bg",
						children: "Voir la carte"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex h-12 items-center justify-center rounded-lg px-2 font-display text-base text-fg-muted underline-offset-4 hover:text-fg hover:underline",
						children: "Retour à la couverture"
					})]
				})
			]
		})]
	});
}
//#endregion
export { Afterword as component };
