import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ReaderBar } from "./reader-bar-C69-oO0w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/carte-Bb0J6GUG.js
var import_jsx_runtime = require_jsx_runtime();
function Carte() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReaderBar, { title: "La carte" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-2xl px-5 py-10 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-semibold",
					children: "Deux routes, un sucre"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 max-w-prose font-serif text-[1.05rem] leading-relaxed text-fg-muted",
					children: [
						"Le ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Comte de Vergennes" }),
						" va droit aux Antilles. Le",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Saint-André" }),
						" descend vers l’Afrique, puis traverse. Au retour, les deux cales portent la même marchandise."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 overflow-hidden rounded-xl border border-border bg-surface p-3 sm:p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtlanticMap, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 space-y-4 font-serif text-[1.02rem] leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-semibold text-accent",
							children: "La droiture."
						}),
						" ",
						"Bordeaux → Saint-Domingue → Bordeaux. Farine, vin, planches à l’aller. Sucre, café, indigo au retour."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-semibold text-accent",
							children: "La traite."
						}),
						" ",
						"Bordeaux → Juda (Ouidah) → Saint-Domingue → Bordeaux. Fusils, fer, cauris, alcool contre des captifs. Puis le même sucre."
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/sommaire",
					className: "mt-10 inline-block font-display text-fg-muted underline-offset-4 hover:text-fg hover:underline",
					children: "Retour au sommaire"
				})
			]
		})]
	});
}
function AtlanticMap() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 640 360",
		role: "img",
		"aria-label": "Carte de l’Atlantique : Bordeaux, Juda, Saint-Domingue.",
		className: "h-auto w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "640",
				height: "360",
				fill: "#e7dcc6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "320",
				y: "36",
				textAnchor: "middle",
				fill: "#6d5f52",
				fontFamily: "Cormorant Garamond, serif",
				fontSize: "13",
				letterSpacing: "2",
				children: "OCÉAN ATLANTIQUE · 1768"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M470 50 C500 80 520 140 545 210 C560 255 575 300 560 340 L640 340 L640 50 Z",
				fill: "#c9b89a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M430 210 C450 230 470 270 455 330 L400 340 C390 280 400 230 430 210 Z",
				fill: "#c9b89a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M70 70 C120 60 150 90 130 140 C110 175 40 170 30 130 C25 100 45 75 70 70 Z",
				fill: "#c9b89a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 175 C90 180 95 230 70 250 C45 265 20 230 40 175 Z",
				fill: "#c9b89a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M505 96 C380 70 220 90 108 155",
				fill: "none",
				stroke: "#1a1410",
				strokeWidth: "1.6",
				strokeDasharray: "5 4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M505 96 C470 150 455 200 448 248",
				fill: "none",
				stroke: "#6e2430",
				strokeWidth: "1.6",
				strokeDasharray: "2 5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M448 248 C320 230 200 190 108 155",
				fill: "none",
				stroke: "#6e2430",
				strokeWidth: "1.6",
				strokeDasharray: "2 5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				x: 505,
				y: 96,
				label: "Bordeaux",
				align: "right"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				x: 448,
				y: 248,
				label: "Juda",
				align: "right"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				x: 108,
				y: 155,
				label: "Saint-Domingue",
				align: "left"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fontFamily: "Source Serif 4, serif",
				fontSize: "11",
				fill: "#6d5f52",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "40",
						y1: "318",
						x2: "68",
						y2: "318",
						stroke: "#1a1410",
						strokeWidth: "1.6",
						strokeDasharray: "5 4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "76",
						y: "322",
						children: "droiture"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "160",
						y1: "318",
						x2: "188",
						y2: "318",
						stroke: "#6e2430",
						strokeWidth: "1.6",
						strokeDasharray: "2 5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "196",
						y: "322",
						children: "traite"
					})
				]
			})
		]
	});
}
function Dot({ x, y, label, align }) {
	const tx = align === "right" ? x + 10 : x - 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: x,
			cy: y,
			r: "5",
			fill: "#6e2430"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: x,
			cy: y,
			r: "2",
			fill: "#f3ead9"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: tx,
			y: y + 4,
			textAnchor: align === "right" ? "start" : "end",
			fill: "#1a1410",
			fontFamily: "Cormorant Garamond, serif",
			fontSize: "13",
			fontWeight: 600,
			children: label
		})
	] });
}
//#endregion
export { Carte as component };
