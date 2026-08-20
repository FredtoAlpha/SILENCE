import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as useProgress } from "./router-DdT8GJ8n.mjs";
import { n as BOOK, r as EPISODES } from "./book-DtWYxc3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CPGbO7sZ.js
var import_jsx_runtime = require_jsx_runtime();
function Cover() {
	const lastSlug = useProgress((s) => s.lastSlug);
	const completed = useProgress((s) => s.completed);
	const resume = lastSlug ? EPISODES.find((e) => e.slug === lastSlug) : null;
	const firstUnread = EPISODES.find((e) => !completed.includes(e.id)) ?? EPISODES[0];
	const cta = resume ?? firstUnread;
	const started = completed.length > 0 || Boolean(lastSlug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden bg-ink text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/art/cover.jpg",
				alt: "Deux navires quittent les quais de Bordeaux à l’aube.",
				className: "absolute inset-0 h-full w-full object-cover object-[center_30%]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-end px-6 pb-10 pt-16 sm:px-8 sm:pb-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[0.72rem] tracking-[0.28em] text-paper/70 uppercase",
						children: "Nouvelle historique · 4e"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 font-display text-[2.6rem] leading-[0.95] font-semibold tracking-tight sm:text-6xl",
						children: [
							"Le prix",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"du sucre"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-sm font-serif text-[1.05rem] leading-relaxed text-paper/80",
						children: "Bordeaux, 1768. Deux navires larguent les amarres le même matin. Ils ne prennent pas la même route. Ils ramèneront la même chose."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-sm tracking-wide text-paper/55",
						children: BOOK.logline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/lire/$slug",
							params: { slug: cta.slug },
							className: "inline-flex h-12 items-center justify-center rounded-lg bg-paper px-6 font-display text-lg font-semibold tracking-wide text-ink transition-transform hover:scale-[1.01] active:scale-[0.99]",
							children: started ? "Reprendre la lecture" : "Ouvrir le livre"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/sommaire",
							className: "inline-flex h-12 items-center justify-center rounded-lg px-2 font-display text-base text-paper/75 underline-offset-4 hover:text-paper hover:underline",
							children: "Sommaire"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { Cover as component };
