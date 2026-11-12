# Avanzamento

Diario di lavoro dell'esecutore (Opus). Aggiornato alla fine di ogni fase.

## F0 — Fondamenta · fatta

**Fatto**
- Git inizializzato; `.gitignore` con `node_modules`, `dist`, `.astro`, `tools/_cache`, `da-fornire/clip`, `__pycache__` e `sorgenti/`.
- Cartelle del piano: `sorgenti/` (i due PDF), `originali/` (vuota), `da-fornire/riferimenti/`, `da-fornire/clip/`, `tools/`, `sito/`.
- Progetto Astro 7.4 in `sito/` con GSAP, Lenis, three, Fontsource; `@astrojs/check` e TypeScript per i controlli (`npm run check`).
- `tools/extract_pages.py`: le 30 immagini native in `tools/_cache/pages/` (p07 e p08 sono PNG, le altre JPEG; quasi tutte 1448×1086, alcune di 1–6 px diverse, p26 è 1454×1082).
- `tools/sample_palette.py` campiona i colori dalle pagine e scrive `sito/src/styles/tokens.css` (colori + spaziature, raggi, ombre, font, scala tipografica). Foglio di controllo in `tools/_cache/palette.png`.
- Pagina `/styleguide` (non nel menu): titoli, corsivo, etichette, pulsanti, pila di libri, cornice dorata, polaroid, campioni colore, affiancati a p4 e p1.
- `tools/make_references.py` → `da-fornire/riferimenti/clip-1…4-start.png` (1920×1080) e `ciak.png`; `LEGGIMI.md` lì dentro spiega a cosa serve ogni file. Il ciak è anche in `sito/src/assets/ciak.png`.

**Scelte**
- Font: titoli **Bodoni Moda** (PORTFOLIO di p1 è un bodoni ad alto contrasto; anche INTERIOR / ABOUT ME); testo **Cormorant Garamond** (i paragrafi di p2 sono un serif da libro); etichette **Jost** (maiuscoletto spaziato geometrico, tipo Futura, come "A MULTIDISCIPLINARY CREATIVE JOURNEY"); corsivo **Allura** (più leggibile di Mrs Saint Delafield nelle frasi lunghe come "Designing Beyond Boundaries"). Sono quattro famiglie invece di tre: il testo corrente in Bodoni sarebbe stancante, in Jost perderebbe il tono di p2.
- Colori principali: crema `#f8edd9` (p4) e `#fbe6d1` (p1), inchiostro `#2f2516`, bordeaux `#690f0e`, velluto `#441719`, oro `#d0a970`, oliva `#534e2b`, pelle dei libri `#533f33`.
- `sorgenti/` fuori da git: il PDF pesa 23 MB e il CV ha dati personali. Gli slot generati invece sono in git, così la build funziona anche senza Python (per esempio su Vercel).

**Deviazioni**
- *clip-1-start*: il piano chiede pellicola, bobina, ulivo e velluto senza titoli né ciak. In un 16:9 senza scritte ci stanno solo pellicola e ulivo (la bobina è sotto le discipline, il velluto sotto il ciak). Ho tenuto pellicola + ulivo, che è il soggetto del movimento.
- *clip-3-start*: in p30 il velluto è solo negli angoli; il ritaglio è 176×99 px ingrandito a 1920×1080, quindi è molto morbido. Serve solo come riferimento di colore e tessuto.
- *ciak.png*: scontornato con un inviluppo convesso dei pixel neri; il piccolo cuneo crema tra asta e corpo e un angolino di velluto in basso a sinistra restano dentro. Da rifinire a mano se in apertura si nota.

**Verifica**: `npm run build` verde; `astro check` 0 errori. Controllo a vista dei fotogrammi di riferimento fatto.
