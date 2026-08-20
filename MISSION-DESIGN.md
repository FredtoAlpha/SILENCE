# Ordre de mission — design SILENCE / Feuilletons

Pour : Claude Code  
Dépôt : [FredtoAlpha/SILENCE](https://github.com/FredtoAlpha/SILENCE), branche `main`  
Lire d’abord : `PRODUIT.md`

---

## Critère

> Un élève lit chez lui un épisode court, sur l’appareil qu’il possède, puis retrouve simplement sa lecture le lendemain.

Toute proposition qui échoue à ce test est refusée.  
Le geste à servir : **ouvrir, lire, s’arrêter, reprendre.**

Appareil principal : **téléphone, le soir**. Tablette ensuite. Le PC est le même texte, centré. Pas un autre produit.

---

## Interdit (non négociable)

- Double colonne, double page, hauteur fixe, flèches de pagination, « comme un livre imprimé ».
- Réduire la colonne ou augmenter les marges **sur mobile**. `px-5` et `max-w-[40rem]` restent.
- Console enseignant, quiz, notes, temps de lecture, classement.
- Imposer un mot de passe à l’élève.
- Changer la palette papier / encre / vin (`src/styles.css`). C’est l’identité.
- Refaire l’app en dashboard scolaire, en SaaS, ou en « redesign moderne ».
- Toucher à `inbox/`, au parseur Word, aux migrations auth, sauf si un fichier design l’exige vraiment.

Si une idée d’audit précédent contredit `PRODUIT.md`, `PRODUIT.md` gagne.

---

## Ce qui est déjà juste — ne pas casser

- Une colonne, défilement continu.
- Pact de lecture, six soirs, ~10 min.
- Glossaire à la **première** occurrence seulement.
- Dialogues (`— `) et extraits (`«`) composés, pas en `<p>` génériques.
- Page « Le vrai et l’inventé ».
- Mode nuit par jeton CSS `data-theme`.
- Bibliothèque : filtres 3e / 4e × matière, cartes 2:3.
- Identifiant `4e1.marie.dup` sans mot de passe.

Direction artistique actuelle : A. On **affine**, on ne remplace pas.

---

## Mission (dans cet ordre)

### 1. Reprise exacte + bandeau

Aujourd’hui on mémorise l’épisode (`lastSlug`), pas l’endroit dans la page. Un élève qui s’arrête au milieu recommence en haut.

À faire :

- Enregistrer le défilement (`window.scrollY` / ratio de l’article), débouncé, dans le progrès du livre.
- Au retour sur le même épisode : restaurer la position.
- Bandeau discret en haut du texte, une fois : **« Tu t’étais arrêté ici »** + action Reprendre (ancre / scroll). Disparaît au scroll.

Fichiers : `src/lib/progress.ts`, `src/routes/livre.$book.lire.$slug.tsx`, éventuellement `src/components/reader-bar.tsx`.

C’est le seul point produit de cette mission. Sans lui, le design de lecture reste incomplet.

### 2. Corps de texte

Fichier : `src/components/reader-bar.tsx`, `FONT_CLASS`.

Actuel (mobile) :

```
0: 1.02rem   (~16,3 px)
1: 1.12rem   (~17,9 px)   ← défaut
2: 1.26rem   (~20 px)
```

Cible, **une seule colonne, même largeur** :

```
0: ~19 px
1: ~21 px    ← nouveau défaut
2: ~24 px
```

Interligne un peu plus aéré si le corps monte. Ne pas compenser en rétrécissant la colonne.  
Le bouton Aa cycle toujours sur 3 tailles. Cible tactile ≥ 44 px, déjà en `size-11`.

### 3. Glossaire dans le flux

Fichier : `src/components/rich-text.tsx`.

Aujourd’hui : bulle `absolute` `w-[min(18rem,70vw)]`, centrée sous le mot — sur téléphone elle sort de l’écran, recouvre la ligne, et plusieurs peuvent rester ouvertes.

À faire :

- Clic sur le mot : la définition s’ouvre **dans le flux**, sous la ligne / sous le paragraphe, pas en superposition.
- Une seule définition ouverte à la fois.
- Fermer : reclic, Échap, ou clic ailleurs.
- Toujours : première occurrence seulement, jamais un champ de dictionnaire.

### 4. Cormorant pour les titres, pas pour l’interface

Fichiers : `src/styles.css`, `src/components/reader-bar.tsx`, en-têtes d’épisode, métadonnées.

- **Cormorant Garamond** : titres de livres, titres d’épisodes, grand « Feuilletons » de la bibliothèque.
- **Source Serif 4** (ou une sans lisible, ex. Source Sans 3) : barre `1 / 6`, boutons, chips de filtre, « Épisode 1 · 10 min », pastilles 4e / Histoire.
- `--font-sans` ne doit plus pointer vers Source Serif.

Contraste : aujourd’hui « ÉPISODE 1 · 10 MIN » est du Cormorant 12 px, capitales, tracking 0.22em — illisible au soir. Viser du 14 px, pas tout en capitales, ou capitales avec un vrai tracking et une police d’UI.

### 5. Confort PC, sans nouveau layout

Sur écran large : **la même colonne**, centrée, marges vides assumées.  
Pas de sommaire latéral, pas de glossaire en rail, pas de « pour remplir ».  
Flèches clavier épisode précédent / suivant : confort secondaire, après le reste.

### 6. Bibliothèque : une collection, pas un chantier

Fichier : `src/routes/index.tsx`.

Un seul titre disponible + grille de 4 colonnes = étagère vide.  
Mettre le livre en avant (une grande carte, ou grille qui se resserre quand il y a peu de titres). Ne pas inventer de faux livres.

---

## Hors mission (plus tard, pas toi)

- Console enseignant.
- Option dys / sans-serif dédiée (P1, seulement si le temps le permet après 1–4).
- Fusion lecture-avant-identifiant vs profil existant.
- Jeton anti-écrasement de profil (personne ne vole un feuilleton ; ne pas « sécuriser »).

---

## Définition de fini

Sur un iPhone ~390 px et un desktop ~1280 px :

1. On ouvre un épisode, on scrolle à mi-texte, on quitte, on revient : on est au même endroit, avec le bandeau une fois.
2. Le texte par défaut est nettement plus grand qu’aujourd’hui. La colonne n’a pas rétréci sur mobile.
3. Un mot du glossaire s’explique dans la page, sans recouvrir le paragraphe suivant.
4. La barre `1 / 6` se lit. Les titres restent en Cormorant.
5. Aucune double colonne nulle part.
6. Palette papier / nuit intacte.

Vérifier au moins : `/`, `/livre/le-prix-du-sucre`, `/livre/le-prix-du-sucre/lire/deux-navires` (ou le slug réel), mode nuit, Aa × 3.

---

## Ton

Calme, éditorial, français, collège 12–15 ans, le soir.  
Moins d’interface, pas plus. Si un ornement n’aide pas à lire, il sort.
