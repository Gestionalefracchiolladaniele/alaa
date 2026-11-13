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

## F1 — Contenuti e slot · fatta

**Fatto**
- Lette tutte le 30 pagine alla risoluzione nativa e trascritti i testi in `sito/src/content/`:
  - `site.json` (nome, motto, ciak, discipline, contatti, voci del menu);
  - `sections/` about, philosophy, interior, architecture, real-estate, art, fashion, travel (testi, etichette, porte `door`, blocchi di p19, p21–24, p26–27, p29);
  - `projects/interior/` 7 progetti (p5–p11) e `projects/architecture/` 5 progetti (p13–p17), un file per tavola;
  - `cv.json` dal CV, senza data di nascita, stato civile, nazionalità, visto e telefono.
- Schema di validazione in `sito/src/content.config.ts` (collezioni `projects` e `sections`).
- `sito/src/data/slots.json`: **220 slot** (vedi sotto perché più dei 90–110 previsti). `tools/build_slots.py` → `sito/src/assets/slots/` (18 MB, in git) e `sito/src/data/slots-report.json`. `tools/contact_sheet.py` → `tools/_cache/contact/`. `tools/check_slots.mjs` controlla che ogni slot citato nei contenuti esista.
- Componente `Slot.astro` e `lib/slots.ts`: un id sbagliato blocca la build.
- `piano/DA-CONFERMARE.md` con 37 voci.
- Correzioni di `05-correzioni-testi.md` applicate tutte; aggiunte: "Featuring" → "featuring" (p11), "White (Purity, Balance, Simplicity)" (p26), nomi dei colori del bagno (p8).

**Scelte**
- **Ingrandimento: Lanczos 2× con leggera nitidezza.** Real-ESRGAN (ncnn-vulkan, modello x4plus) scaricato e provato su `creo-sharjah-hero`: 206 secondi per una sola immagine, oltre il limite di 2 minuti. Scartato. Il programma scaricato è rimasto solo nella cartella temporanea.
- 220 slot invece di ~100: ogni campione di materiale, ogni elettrodomestico, ogni disegno e ogni opera ha il suo slot, così le pagine progetto mostrano tutto il contenuto delle tavole e ogni immagine si può sostituire singolarmente. Pesano poco (sono piccoli).
- I titoli dentro le immagini sono sempre esclusi dai ritagli (le copertine sono ritagliate a destra del titolo; le etichette sotto le foto di p17 e sotto i campioni di p26 sono tagliate). Restano le scritte che fanno parte dei disegni (nomi delle stanze nelle piante, quote, scritte sui dorsi dei libri).
- Le palette di p9, p10, p11, p13, p14, p15 non esistono come palette nel PDF: ho campionato i colori dai materiali mostrati (segnalato in DA-CONFERMARE #10).
- Le porte (`door`) delle copertine stanno nei file delle sezioni con il rettangolo in percentuale sull'immagine dello slot.

**Ritagli di qualità dubbia** (da sostituire per primi con gli originali)
- Tutte le tavole di p13 (Botanic Garden) e p16 (Urban II): testo dei disegni deformato e risoluzione bassa (`needsOriginals`).
- `children-centre-hero`, `urban-ii-hero`, `kyrenia-hero`: molto larghi e bassi (sono fasce nel PDF).
- `about-portrait`: alto e stretto (314×1030 nativi), il bordo del vestito è tagliato a sinistra per non prendere la scritta "All connected".
- Le foto di viaggio (p29) e moda (p26, p27) sono polaroid inclinate: il ritaglio include i bordi bianchi e un po' di sfondo.
- I quaderni degli schizzi (p23) includono bordi del quaderno e della carta.
- `botanic-garden-masterplan`: tagliata la punta in basso a destra per escludere la legenda sbagliata del PDF.
- Campioni piccoli (materiali, elettrodomestici, p8, p10, p11): 80–150 px nativi, vanno mostrati piccoli.

**Verifica**: foglio di controllo guardato pagina per pagina, corretti 20 ritagli (testo dei titoli dentro le copertine, etichette, bordi arrotondati); `astro check` 0 errori con i contenuti validati; `node tools/check_slots.mjs` OK.

## F2 — Home statica · fatta

**Fatto**
- Home (`sito/src/pages/index.astro` + `styles/home.css`) con le scene nell'ordine del PDF: 0 apertura (segnaposto nascosto), 1 copertina, 2 About (con cassetto Experience), 3 Philosophy, 4 Interior + pellicola dei 7 progetti, 5 Architecture + pellicola dei 5, 6 Real Estate (p19 completa, percorso in 6 passi), 7 Art (4 pareti: Digital Art ×2, Sketch Art, Paintings), 8 Fashion (Black & White, Old Money), 9 Travel (p29), 10 Thank You con contatti e libri ripetuti come indice.
- Nessuna animazione. Unico JavaScript: apertura/chiusura del menu a libri su mobile.
- Menu a pila di libri in CSS (`components/BookNav.astro`), fisso in basso a destra su desktop, pulsante "Index" con pannello su mobile, ancore a `#interior`, `#architecture`, `#real-estate`, `#art`, `#fashion`, `#travel`.
- Pellicole dei progetti come striscia orizzontale scorrevole (`components/FilmStrip.astro`), nell'ordine del PDF, con segno "3D" su Creo Sharjah e Kyrenia.
- Template pagina progetto (`components/ProjectPage.astro`) con tutti i blocchi statici: intestazione, immagine principale (con contenitore hotspot), testi, palette, gruppi di schede (materiali, finiture, elettrodomestici…), caratteristiche, confronto alzato/immagine (p8, p9, p10, p11), numeri chiave, disegni, legende in HTML, galleria, precedente/successivo e ritorno alla pellicola. 12 pagine generate: `/interior/<slug>/` e `/architecture/<slug>/`.
- Timeline del CV in `components/Timeline.astro`, dentro un `<details>` "Experience" in About (funziona senza JS).
- Componenti nuovi: `TwoTone`, `SceneLabel`, `SectionCover`, `FilmStrip`, `ScrollSequence` (segnaposto), `Timeline`, `ProjectPage`, `Icon` (icone a tratto ridisegnate semplici), `lib/projects.ts`, `lib/text.ts`.

**Punti di aggancio per Fable / F6** (tutti attributi `data-`, nessun JS ancora)

| Cosa | Dove | Selettore e dati |
|---|---|---|
| Apertura a sipario con ciak | `index.astro`, in cima al `<body>` | `[data-opening]` (ha `hidden`: toglierlo per attivarla), `[data-curtain="left"]`, `[data-curtain="right"]`, `[data-ciak]` con `[data-ciak-img]` (= `src/assets/ciak.png`) e `[data-ciak-text]` (testi del ciak, nascosti), pulsante `[data-opening-begin]` "Click to begin". Ricordo in `sessionStorage` da fare. |
| ScrollSequence copertina | `#cover` | `[data-scroll-sequence="clip-1"]` con `data-frames-desktop="120"`, `data-frames-mobile="60"`, `data-fallback-slot="cover-film"`; dentro `[data-sequence-canvas]` (vuoto) e `[data-sequence-fallback]` (immagine). Componente: `components/ScrollSequence.astro`. |
| ScrollSequence Philosophy | `#philosophy` | `[data-scroll-sequence="clip-2"]`, riserva `philosophy-arch`. |
| Porta DiveIn della copertina | `#cover .hero` | `[data-divein]` con `data-divein-slot="cover-film"`, `data-divein-rect="22.7,12.3,27.6,41.7"` (fotogramma del soggiorno, approssimato), `data-divein-next="#about"`; `[data-divein-door]` è il rettangolo posizionato. |
| Porta DiveIn Philosophy | `#philosophy .philo__media` | `data-divein-slot="philosophy-arch"`, `data-divein-rect="25.9,17.6,39.7,82.4"` (apertura dell'arco), `data-divein-next="#interior"`. |
| Porte DiveIn delle 6 copertine | `components/SectionCover.astro`, `<header id="<sezione>-cover">` | `[data-divein]` con `data-divein-slot`, `data-divein-rect` ("x,y,w,h" in % sull'immagine dello slot), `data-divein-next` (`#interior-film`, `#architecture-film`, `#real-estate-body`, `#art-walls`, `#fashion-tables`, `#travel-journey`). L'elemento porta ha `[data-divein-door]` e `data-divein-label` ("Enter the sketch"…). Interior e Architecture: la porta è lo schizzo (`.cover__sketch`); Real Estate, Art, Travel: rettangolo sopra la natura morta (`.cover__door`); Fashion: il foglio col figurino è uno slot a parte (`.cover__doorcard`, slot `fashion-sheet`). I dati stanno in `content/sections/<sezione>.json` → `door`. |
| Copertine: zoom, foglie, tratto | `SectionCover.astro` | `[data-cover-zoom]`, `[data-leaf-shadow]` (vuoto), `[data-swoosh]` (SVG del tratto bordeaux). |
| Titoli in due colori | ovunque | `[data-two-tone]`, parte bordeaux `[data-accent]`. |
| Scritte che si scrivono da sole | home | `[data-handwrite]` (motto, firma, citazioni, "The Inspiration"…). |
| Righe di testo che compaiono | About, Philosophy | `[data-reveal-lines]`. |
| Contatori | About, pagine progetto | `[data-counter]` (in About ha il valore numerico). |
| Numero di scena | ogni scena | `[data-scene-label="N"]`; le scene sono `section[data-scene="<id>"]`. |
| Pellicola progetti | `#interior-film`, `#architecture-film` | `[data-filmstrip]`, `[data-film-frame]` con `data-project` (slug) e `data-hero-slot`. La pagina progetto ha `[data-project-hero]` con `view-transition-name: hero-<slug>`: per la transizione "l'immagine cresce" basta dare lo stesso nome all'immagine del fotogramma al clic. |
| Percorso Real Estate | `#real-estate-body` | `[data-journey]`, passi `[data-journey-step="1..6"]`, linea SVG `[data-journey-line]`. |
| Art | `#art-walls` | pareti `[data-art-wall]`, opere `[data-artwork="<slot>"]`, lampada `[data-lamp]`, cornice `[data-lightbox="<slot>"]` (anche `[data-divein-door]`, "Enter the frame"). |
| Fashion / Travel | `#fashion-tables`, `#travel-journey` | polaroid `[data-polaroid="<slot>"]` (con `--r` = rotazione); tavoli `[data-fashion-table]`. |
| Mappa del mondo | `#travel-journey` | `[data-world-map]` vuoto, con `data-countries="Italy|France|…"` (16 paesi). |
| Finale a sipario | `#thank-you` | `[data-curtain-close]`. |
| Cassetto Experience | About | `details[data-drawer="experience"]`. |
| Visualizzatore 3D | `components/ProjectPage.astro`, solo `creo-sharjah` e `kyrenia-waterfront-art-centre` | `[data-model-viewer]` con `data-model-file` (`/models/creo-kitchen.glb`, `/models/kyrenia-pavilion.glb`), `data-model-kind` (`configurator` / `exploded`), `data-fallback-slot`; dentro `[data-model-canvas]` (vuoto) e `[data-model-fallback]` (immagine). Etichetta "3D study based on the project board" già presente. Dati in `content/projects/…/<slug>.json` → `model`. |
| Pagina progetto, altri blocchi | `ProjectPage.astro` | `[data-hotspots]` (JSON dei punti, ora vuoti), `[data-palette]` / `[data-swatch][data-hex]`, `[data-compare]` / `[data-compare-drawing]` / `[data-compare-photo]`, `[data-diagram="<slot>"]`. |

**Scelte**
- Tolto `scroll-behavior: smooth` dal CSS: lo scroll fluido arriverà con Lenis (F6) e quello del CSS falsava i controlli.
- Le immagini sono servite solo in WebP (niente AVIF): la codifica AVIF di 220 slot in più larghezze su questo PC allunga troppo la build. La build completa dura circa 1 minuto.
- In Art le opere sono `<figure>` senza link: il lightbox arriva in F6.
- `cover-reel` (la bobina) compare in basso a destra nella copertina, sotto il menu a libri.

**Correzioni applicate prima dello stop** (da `piano/CORREZIONI.md`, poi è arrivato l'ordine di non farle): il LinkedIn ora è testo senza link (`site.json` → `linkedinUrl: null`; il template mostra il link solo se l'indirizzo c'è) e i ritagli `fashion-bw-01…06`, `fashion-om-01…04`, `travel-01…06` sono stretti dentro la foto, senza bordi della polaroid né nastro. Lasciate così. `CORREZIONI.md` non è stato toccato; #3 e #4 non sono state fatte.

**Verifica**
- `npm run build` verde (14 pagine), `astro check` 0 errori, `node tools/check_slots.mjs` OK, controllo dei link interni sulla build: 0 link rotti (ancore comprese).
- Controllo a vista: screenshot con Edge già installato sul PC (headless, nessuna installazione) della home a 1440 e 390 px, dell'inizio della home a 768 px e della pagina `creo-sharjah` a 1440 px. Corretti: titolo PORTFOLIO che si sovrapponeva alla pellicola, ritaglio del ritratto che prendeva lettere della colonna di sinistra, filetto nella copertina Interior, arco del ritratto che usciva a destra su mobile.
- Limiti del controllo: negli screenshot molte immagini grandi non fanno in tempo a caricarsi (server di prova lento), quindi ho controllato la disposizione dai riquadri vuoti, non le immagini. A 768 px ho guardato solo la parte alta della home.

**Resta / problemi aperti**
- Gli slot sono 220 (18 MB in git) contro i 90–110 previsti.
- Le icone sono ridisegnate semplici: da rivedere a vista.
- Nella pellicola su desktop non c'è ancora il pin orizzontale (F6): si scorre di lato con trackpad, Maiusc+rotella o tastiera (la striscia è focalizzabile).
- `ciak.png` da rifinire (CORREZIONI #5, di Fable).

## F6 — Movimento (prima stesura, 12 novembre sera)

Scritta da Fable (base, porte, sipario) e da un agente Opus (sequenze, testi, 3D). **Mai costruita:** `npm run build` fallisce con `EIO: i/o error, read` perché il disco F: ha blocchi danneggiati e alcuni file di `node_modules` non si leggono. Verificato solo `node --check` su ogni `.js`. Nessun controllo a vista.

**File nuovi**
- `sito/src/scripts/motion/core.js` — `motion()` (Lenis + ScrollTrigger, una volta), `reduced`, `isMobile()`, `fullMotion()`, `EASE`, curva `enter`, `lockScroll()` / `unlockScroll()`. Mette `motion-on` o `motion-reduced` su `<html>`.
- `sito/src/scripts/motion/home.js` — ingresso della home: `opening`, `sequence`, `divein`, `reveal`, poi `ScrollTrigger.sort()` e `refresh()`.
- `sito/src/scripts/motion/divein.js` — porte delle copertine di sezione: pin di uno schermo, `[data-divein-stage]` si ingrandisce finché la porta riempie lo schermo, velo del colore della scena di arrivo. Salta le porte che contengono `[data-scroll-sequence]` (copertina e arco).
- `sito/src/scripts/motion/opening.js` — sipario: clip 3 al contrario tramite `createPlayer`, poi ingrandimento ×3,2; riserva in CSS. Lancia `opening:done`.
- `sito/src/scripts/motion/sequence.js` — `createPlayer(clip, host, { fit })` → player con `count`, `canvas`, `keyed`, `variant`, `width`, `height`, `draw(pos, force)`, `first`, `ready`, `preload({ from })`, `resize()`, `destroy()`; `init()` lega copertina (pin breve, colonna destra) e arco (pin di circa 2,5 schermi, riquadro che si allarga a tutto schermo, velo crema finale).
- `sito/src/scripts/motion/reveal.js` — `[data-reveal-lines]`, `[data-counter]`, `[data-two-tone]`, `[data-swoosh]`, `[data-cover-zoom]` (proprietà CSS `scale` via `--cz`), `[data-handwrite]`.
- `sito/src/scripts/motion/project.js` — ingresso delle pagine progetto.
- `sito/src/scripts/three/viewer-core.js`, `kitchen.js`, `pavilion.js` (dal prototipo, opzioni e colori invariati), `models.js` (carica three.js con `import()` quando il riquadro si avvicina).
- `sito/src/styles/doors.css` (porte e sipario), `sito/src/styles/motion.css` (sequenze, testi, 3D).

**File modificati**
- `index.astro`: import di `motion.css` e `doors.css`; blocco `[data-opening]` (ruolo dialog, `[data-opening-stage]`, script in linea che decide se mostrarlo); `<script>` che carica `home.js`.
- `SectionCover.astro`: il contenuto sta in `.cover__stage[data-divein-stage]`; griglia e padding spostati dalla copertina allo stage.
- `ScrollSequence.astro`: legge il manifest alla build e mette `data-sequence-available`.
- `ProjectPage.astro`: blocco `[data-model-viewer]`, suoi stili, `<script>`, import di `motion.css`.

**Resta**
- Prima build e correzione degli errori; `npm run check`; peso del JavaScript della home.
- Controllo a vista di tutto (Daniele).
- Sipario del finale, porta della copertina verso About (Fable).

## F6 — Movimento, seconda parte (12 novembre, sera tardi) — Fable

Il progetto è stato copiato in `C:/progetti/alaa-attal` (720 file verificati, git integro, PDF del portfolio mancante). `npm ci` e `npm run build` riusciti al primo tentativo: 14 pagine. JavaScript della home circa 59 KB compressi (limite 150); three.js a parte, 204 KB compressi, caricato solo nelle due pagine con il 3D.

**Aggiunto**
- `scripts/motion/finale.js`: sipario che si richiude a Thank You (clip 3 in avanti, dietro l'ovale). Stili in `doors.css`.
- `addCoverDoor` in `divein.js`, usata da `sequence.js`: dopo la clip della copertina si entra in un fotogramma e si arriva ad About.
- Interruttori di diagnostica `/?off=...` (`OFF` in `core.js`) e `tools/misura_scroll.mjs`.

**Cambiato su richiesta di Daniele**
- Tolto il ciak dall'apertura (rimosso il blocco `[data-ciak]` da `index.astro`).
- Clip 1 intera: `tools/clips.json` (0–119, qualità 62), fotogrammi rigenerati; la copertina resta fissata per 1,6 schermi di clip più 1 di porta.

**Tentativi sullo scroll, fatti senza misurare (da rivedere con la misura)**
- grana della carta senza `mix-blend-mode`;
- `scrub: true` al posto di 0,5–0,6 in `sequence.js`, `divein.js`, `finale.js`;
- cache di `ImageBitmap` intorno al fotogramma corrente e densità del canvas a 1 in `sequence.js`;
- `will-change: transform` fisso sugli stage delle porte;
- Lenis: `lerp` 0,06 (inerzia), rotella 1.

Dopo i primi quattro Daniele ha trovato lo scroll peggiorato. Nessuno è stato verificato singolarmente.

**Non verificato:** tutto ciò che riguarda l'aspetto. Nessun controllo a vista da parte di chi ha scritto il codice.

## Versione leggera con porte a clic (12 novembre, ore 20:30) — Fable

Scelta di Daniele dopo aver provato il sito senza movimento: quella è la base.
- **Spenti di serie:** scroll morbido (Lenis), testi animati (`reveal.js`), video legati allo scroll (`sequence.js`). Il codice resta; si riaccendono per prova con `/?on=lenis,reveal,sequence` (`ON` in `core.js`). Gli interruttori `?off=` non esistono più: `tools/misura_scroll.mjs` va adattato se serve ancora.
- **Sipario d'apertura:** solo i due pannelli disegnati in CSS (`USE_FILM = false` in `opening.js`); il video delle tende (clip 3) non si usa più.
- **Sipario finale:** due pannelli CSS che si chiudono una volta, a tempo, dietro l'ovale (`finale.js`).
- **Porte:** `divein.js` riscritto. Ogni copertina di sezione è un cancello: ciò che viene dopo è nascosto (`[data-gate-hidden]`) finché non si clicca la porta o il pulsante "Enter ... ↓". Al clic: ingrandimento verso la porta, velo, arrivo al contenuto. Scorrere non basta per passare. Una volta aperta, la parte resta aperta. Il menu a libri apre i cancelli necessari senza animazione. Copertina e Philosophy non sono cancelli.
- Costruito senza errori; **non guardato**.

## Versione leggera definitiva (13 novembre) — Opus

- Video veri in `sito/public/video/` (ffmpeg da `da-fornire/clip`): `clip-1.mp4` 842 KB (+ mobile 314 KB), `clip-2.mp4` 3,3 MB tutti fotogrammi chiave (+ mobile 1,4 MB).
- `sequence.js`: `createVideoPlayer` (stessa interfaccia del lettore a fotogrammi, salta con `currentTime`); copertina in loop da sola; arco legato allo scroll con `setupArch` (`ARCH_SCROLL = true`).
- `divein.js`: porte a clic (cancelli); `enterArch` per l'arco a clic, spento (`ARCH_CLICK = false`).
- `reveal.js`: zoom copertine con `animation-timeline: view()` (classe `.cz-css` in `motion.css`).
- `scripts/three/assemble.js` (nuovo): composizione pezzo per pezzo e pulsanti mostra/nascondi; `kitchen.js` e `pavilion.js` espongono `parts`, `toggle`, `build`; `models.js` senza pin, barra per il padiglione.
- `lib/projects.ts`: progetti con `model` per primi.
- `BookNav.astro`: menu più piccolo e più alto; nascosto con `html.at-finale` (impostata da `finale.js`).
- Tolta la bobina `cover-reel` dalla copertina e i libri sotto Thank You.
- Il "non funziona" dell'arco legato allo scroll era il server di Python (niente richieste parziali): l'anteprima ora usa `astro preview`.
