import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as useProgress } from "./router-DdT8GJ8n.mjs";
import { n as ReaderBar } from "./reader-bar-C69-oO0w.mjs";
import { n as BOOK, r as EPISODES } from "./book-DtWYxc3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sommaire-DhSLPQL-.js
var import_jsx_runtime = require_jsx_runtime();
function Sommaire() {
	const completed = useProgress((s) => s.completed);
	const lastSlug = useProgress((s) => s.lastSlug);
	const reset = useProgress((s) => s.reset);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReaderBar, { title: "Sommaire" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-xl px-5 py-10 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.22em] text-fg-muted uppercase",
					children: BOOK.subtitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold",
					children: "Six soirs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-3 text-[1.02rem] leading-relaxed text-fg-muted",
					children: BOOK.pact.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-10 divide-y divide-border border-y border-border",
					children: [EPISODES.map((ep) => {
						const done = completed.includes(ep.id);
						const current = lastSlug === ep.slug;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/lire/$slug",
							params: { slug: ep.slug },
							className: "flex items-baseline gap-4 py-4 transition-colors hover:bg-surface/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-8 shrink-0 font-display text-xl text-accent tabular-nums",
								children: String(ep.id).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-display text-xl font-semibold leading-tight",
									children: ep.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block text-sm text-fg-muted",
									children: [
										ep.place,
										" · ",
										ep.when,
										" · ",
										ep.minutes,
										" min",
										done ? " · lu" : current ? " · en cours" : ""
									]
								})]
							})]
						}) }, ep.slug);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/fin",
						className: "flex items-baseline gap-4 py-4 transition-colors hover:bg-surface/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-8 shrink-0 font-display text-xl text-accent",
							children: "*"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-xl font-semibold leading-tight",
								children: "Le vrai et l’inventé"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm text-fg-muted",
								children: "Après la nouvelle"
							})]
						})]
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/carte",
							className: "underline-offset-4 hover:text-fg hover:underline",
							children: "La carte"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "underline-offset-4 hover:text-fg hover:underline",
							children: "Couverture"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => reset(),
							className: "underline-offset-4 hover:text-fg hover:underline",
							children: "Recommencer"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { Sommaire as component };
