import { o as __toESM } from "../_runtime.mjs";
import { y as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rich-text-Jvg5_Dq4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GLOSSARY = {
	Cauris: "Petits coquillages utilisés comme monnaie dans certaines régions d’Afrique.",
	cauris: "Petits coquillages utilisés comme monnaie dans certaines régions d’Afrique.",
	droiture: "Commerce direct entre un port européen et une colonie, sans passer par l’Afrique.",
	traite: "Commerce et déportation forcée de personnes africaines vers les Amériques.",
	Entrepont: "Niveau bas d’un navire. Ici, l’espace aménagé pour y entasser les captifs.",
	entrepont: "Niveau bas d’un navire. Ici, l’espace aménagé pour y entasser les captifs.",
	Captiverie: "Enclos ou bâtiment près de la côte, où l’on enfermait les captifs avant l’embarquement.",
	captiverie: "Enclos ou bâtiment près de la côte, où l’on enfermait les captifs avant l’embarquement.",
	habitation: "Dans les colonies françaises, grande exploitation agricole — ce qu’on appelle aujourd’hui une plantation.",
	"Code noir": "Édit de 1685 qui encadrait l’esclavage dans les colonies françaises. Son article 44 déclarait les personnes esclavisées « biens meubles ».",
	"passage du milieu": "Nom donné à la traversée de l’Atlantique imposée aux captifs entre l’Afrique et les Amériques.",
	Juda: "Port du golfe du Bénin, appelé aujourd’hui Ouidah, au Bénin.",
	"Cap-Français": "Principal port du nord de Saint-Domingue. Aujourd’hui Cap-Haïtien, en Haïti.",
	"Saint-Domingue": "Alors la plus riche colonie française des Antilles. L’île devient Haïti en 1804.",
	commandeur: "Homme chargé de faire exécuter le travail et la discipline dans une plantation.",
	négociant: "Marchand qui arme des navires, achète et revend des cargaisons, souvent sans voyager lui-même.",
	barriques: "Tonneaux de bois servant au transport du vin, du sucre, de l’eau-de-vie.",
	barrique: "Tonneau de bois servant au transport du vin, du sucre, de l’eau-de-vie."
};
var GLOSSARY_KEYS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
function splitItalics(input) {
	const out = [];
	const re = /\*([^*]+)\*/g;
	let last = 0;
	let m;
	while (m = re.exec(input)) {
		if (m.index > last) out.push({
			em: false,
			value: input.slice(last, m.index)
		});
		out.push({
			em: true,
			value: m[1]
		});
		last = m.index + m[0].length;
	}
	if (last < input.length) out.push({
		em: false,
		value: input.slice(last)
	});
	return out;
}
function splitTerms(value, used) {
	const out = [];
	let rest = value;
	while (rest.length) {
		let hit = null;
		for (const key of GLOSSARY_KEYS) {
			if (used.has(key.toLowerCase())) continue;
			const at = rest.indexOf(key);
			if (at === -1) continue;
			const beforeOk = at === 0 || !/[\p{L}\p{N}]/u.test(rest[at - 1] ?? "");
			const after = rest[at + key.length] ?? "";
			const afterOk = after === "" || !/[\p{L}\p{N}]/u.test(after);
			if (!beforeOk || !afterOk) continue;
			if (!hit || at < hit.at || at === hit.at && key.length > hit.key.length) hit = {
				at,
				key
			};
		}
		if (!hit) {
			out.push({
				kind: "text",
				value: rest
			});
			break;
		}
		if (hit.at > 0) out.push({
			kind: "text",
			value: rest.slice(0, hit.at)
		});
		const def = GLOSSARY[hit.key];
		out.push({
			kind: "term",
			value: hit.key,
			def
		});
		used.add(hit.key.toLowerCase());
		const canon = Object.keys(GLOSSARY).find((k) => k.toLowerCase() === hit.key.toLowerCase());
		if (canon) used.add(canon.toLowerCase());
		rest = rest.slice(hit.at + hit.key.length);
	}
	return out;
}
function parseParagraph(text, used) {
	const segs = [];
	for (const part of splitItalics(text)) {
		if (part.em) {
			segs.push({
				kind: "em",
				value: part.value
			});
			continue;
		}
		segs.push(...splitTerms(part.value, used));
	}
	return segs;
}
function Term({ value, def }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative inline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "border-b border-dotted border-accent/70 text-inherit decoration-transparent",
			"aria-expanded": open,
			onClick: () => setOpen((v) => !v),
			children: value
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			role: "note",
			className: "absolute top-[calc(100%+0.35rem)] left-1/2 z-20 w-[min(18rem,70vw)] -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 font-serif text-[0.85rem] leading-snug text-fg shadow-[0_8px_28px_rgba(26,20,16,0.18)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block font-display text-sm font-semibold text-accent",
				children: value
			}), def]
		}) : null]
	});
}
function RichParagraphs({ paragraphs, className }) {
	const parsed = (0, import_react.useMemo)(() => {
		const used = /* @__PURE__ */ new Set();
		return paragraphs.map((p) => parseParagraph(p, used));
	}, [paragraphs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children: parsed.map((segs, i) => {
			const raw = paragraphs[i] ?? "";
			const isDialogue = raw.startsWith("— ");
			const isRegister = raw.startsWith("«");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: isDialogue ? "my-[0.85em] pl-1" : isRegister ? "my-[1.1em] pl-4 text-fg-muted italic" : "my-[0.95em]",
				children: segs.map((s, j) => {
					if (s.kind === "em") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: s.value }, j);
					if (s.kind === "term") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Term, {
						value: s.value,
						def: s.def
					}, j);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.value }, j);
				})
			}, i);
		})
	});
}
//#endregion
export { RichParagraphs as t };
