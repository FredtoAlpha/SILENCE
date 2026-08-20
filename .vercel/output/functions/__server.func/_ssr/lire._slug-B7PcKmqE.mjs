import { o as __toESM } from "../_runtime.mjs";
import { R as notFound, _ as Link, y as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$1, s as useProgress } from "./router-DdT8GJ8n.mjs";
import { n as ReaderBar, t as FONT_CLASS } from "./reader-bar-C69-oO0w.mjs";
import { a as getEpisode, o as getNext, r as EPISODES } from "./book-DtWYxc3o.mjs";
import { t as RichParagraphs } from "./rich-text-Jvg5_Dq4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lire._slug-B7PcKmqE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EpisodePage() {
	const { slug } = Route$1.useParams();
	const episode = getEpisode(slug);
	if (!episode) throw notFound();
	const next = getNext(slug);
	const markOpened = useProgress((s) => s.markOpened);
	const markCompleted = useProgress((s) => s.markCompleted);
	const fontScale = useProgress((s) => s.fontScale);
	(0, import_react.useEffect)(() => {
		markOpened(episode.slug, episode.id);
		window.scrollTo(0, 0);
	}, [
		episode.slug,
		episode.id,
		markOpened
	]);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			const el = document.documentElement;
			const max = el.scrollHeight - el.clientHeight;
			if (max > 0 && el.scrollTop / max > .82) markCompleted(episode.id);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, [episode.id, markCompleted]);
	const progress = (episode.id - 1) / EPISODES.length * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed top-0 right-0 left-0 z-40 h-[2px] bg-border",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-accent",
					style: { width: `${progress}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReaderBar, {
				current: episode.id,
				total: EPISODES.length,
				title: episode.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mx-auto w-full max-w-[40rem] px-5 pb-24 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: "mt-6 overflow-hidden rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: episode.image,
							alt: "",
							className: "aspect-[16/9] w-full object-cover"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-xs tracking-[0.22em] text-fg-muted uppercase",
								children: [
									"Épisode ",
									episode.id,
									" · ",
									episode.minutes,
									" min"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-display text-[2.15rem] leading-[1.05] font-semibold tracking-tight sm:text-5xl",
								children: episode.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-base text-fg-muted italic",
								children: [
									episode.place,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2 text-border",
										children: "·"
									}),
									episode.when
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichParagraphs, {
						paragraphs: episode.paragraphs,
						className: `mt-8 font-serif text-fg ${FONT_CLASS[fontScale]}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "mt-16 border-t border-border pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-sm tracking-wide text-fg-muted",
							children: ["Fin de l’épisode ", episode.id]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-col gap-3 sm:flex-row",
							children: [next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/lire/$slug",
								params: { slug: next.slug },
								onClick: () => markCompleted(episode.id),
								className: "inline-flex h-12 items-center justify-center rounded-lg bg-fg px-5 font-display text-lg font-semibold text-bg transition-opacity hover:opacity-90",
								children: ["Continuer · ", next.title]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/fin",
								onClick: () => markCompleted(episode.id),
								className: "inline-flex h-12 items-center justify-center rounded-lg bg-fg px-5 font-display text-lg font-semibold text-bg transition-opacity hover:opacity-90",
								children: "Le vrai et l’inventé"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/sommaire",
								className: "inline-flex h-12 items-center justify-center rounded-lg px-2 font-display text-base text-fg-muted underline-offset-4 hover:text-fg hover:underline",
								children: "S’arrêter ici"
							})]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { EpisodePage as component };
