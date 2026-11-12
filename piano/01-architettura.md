# Architettura

## Stack

| Scelta | Perché |
|---|---|
| **Astro** (ultima versione stabile), output statico | Le pagine nascono dai file di contenuto, l'HTML è già pronto (buono per Google e per i PC lenti), il JavaScript si carica solo dove serve, e ottimizza le immagini da solo |
| **GSAP + ScrollTrigger** | Animazioni legate allo scroll, sezioni "pinnate", linee SVG che si disegnano. Gratuito, plugin compresi |
| **Lenis** | Scroll fluido |
| **three.js** | I due modelli 3D. Caricato solo quando la sezione 3D entra nello schermo |
| **Font con Fontsource** (auto-ospitati) | Nessuna richiesta a server esterni |
| **Python con `uv`** per gli script | Già usato: `uv run --with pymupdf …`. Niente installazioni di sistema |
| **Blender 5.2.1** senza interfaccia | `F:\cartella prova\blender\tools\blender-5.2.1-windows-x64\blender.exe -b -P script.py` |
| **ffmpeg** | Già installato. Estrae i fotogrammi dalle clip |

Navigazione: sito a più pagine, con `@view-transition { navigation: auto; }` in CSS per il passaggio morbido tra home e pagine progetto. Nessun router lato client: così GSAP e Lenis si inizializzano una volta per pagina, senza trucchi.

Font: scegli confrontando a vista con p1 e p4. Candidati: titoli *Cormorant Garamond* o *Bodoni Moda*; etichette *Jost* o *Montserrat*; corsivo *Pinyon Script*, *Allura* o *Mrs Saint Delafield*. I colori si campionano dalle pagine con uno script, non a occhio.

## Cartelle

```
alaa attal/
├─ piano/                  questo piano + DA-CONFERMARE.md
├─ sorgenti/               i due PDF (spostati qui in F0, mai modificati)
├─ originali/              file originali di Alaa, nominati <slot-id>.<est> (ora vuota)
├─ da-fornire/
│   ├─ riferimenti/        fotogrammi di partenza per le clip (li prepara l'esecutore in F0)
│   └─ clip/               qui Daniele mette clip-1.mp4 … clip-4.mp4
├─ tools/
│   ├─ extract_pages.py    estrae le 30 immagini native dal PDF (senza ricompressione)
│   ├─ sample_palette.py   campiona i colori dalle pagine
│   ├─ build_slots.py      crea le immagini degli slot (originale se c'è, altrimenti ritaglio)
│   ├─ contact_sheet.py    foglio di controllo con tutti gli slot
│   ├─ build_frames.py     clip → fotogrammi WebP per desktop e mobile
│   └─ blender/
│       ├─ common.py       funzioni condivise (materiali, export GLB, anteprima)
│       ├─ creo_kitchen.py
│       └─ kyrenia_pavilion.py
└─ sito/                   progetto Astro
    ├─ public/
    │   ├─ models/         creo-kitchen.glb, kyrenia-pavilion.glb
    │   └─ sequences/<clip>/{desktop,mobile}/0001.webp …
    └─ src/
        ├─ content/
        │   ├─ site.json           nome, motto, contatti, voci del menu
        │   ├─ cv.json             esperienze, studi, premi, lingue
        │   ├─ sections/           about, philosophy, real-estate, art, fashion, travel
        │   └─ projects/
        │       ├─ interior/       7 file, uno per progetto
        │       └─ architecture/   5 file
        ├─ data/slots.json         il manifesto degli slot
        ├─ assets/slots/           immagini generate da build_slots.py (non a mano)
        ├─ components/             Slot, BookNav, Clapper, ScrollSequence, Hotspots,
        │                          Palette, CompareSlider, Lightbox, WorldMap, Timeline …
        ├─ layouts/
        ├─ pages/                  index, interior/[slug], architecture/[slug], styleguide
        ├─ scripts/                motion/ (GSAP, Lenis)   three/ (viewer, configurator, exploded)
        └─ styles/                 tokens.css, base.css
```

## Sistema degli slot

Uno slot è un posto per un'immagine, con un nome stabile (`creo-sharjah-hero`, `art-painting-03`).

`src/data/slots.json`, una voce per slot:

```json
{
  "id": "creo-sharjah-hero",
  "page": 9,
  "crop": [40, 185, 715, 630],
  "alt": "Linear pantry with warm-lit glass cabinets",
  "note": "ritaglio dal PDF, da sostituire con l'originale"
}
```

`tools/build_slots.py` per ogni slot:
1. se esiste `originali/<id>.*`, usa quello;
2. altrimenti ritaglia la pagina `page` dal PDF nel riquadro `crop` (pixel sull'immagine nativa);
3. scrive il risultato in `sito/src/assets/slots/<id>.<est>`.

Le pagine usano solo il componente `<Slot id="…" />`, che legge il manifesto e lascia ad Astro la creazione di WebP/AVIF nelle varie larghezze, con `width` e `height` già impostati.

**Per sostituire un'immagine:** si mette il file in `originali/` con il nome dello slot, si rilancia `build_slots.py` e la build. Nient'altro.

Ingrandimento: i ritagli sono piccoli (un'immagine principale è larga circa 650 px). In F1 prova Real-ESRGAN (versione ncnn-vulkan) su **un solo** ritaglio e misura il tempo. Se supera 2 minuti a immagine o produce difetti su volti e linee, usa un ingrandimento Lanczos 2× con leggera nitidezza. In ogni caso il layout non mostra mai un ritaglio più largo di circa 2× la sua dimensione nativa.

## Contenuti

Collezioni Astro con schema di validazione. Campi di un progetto:

- `title`, `subtitle`, `location`, `brand`, `order`
- `hero` e `gallery` (id di slot)
- `texts`: blocchi `{ heading, body }` (Design Concept, Design Story …)
- `palette`: `{ name, hex, note }`
- `materials`: `{ name, note, slot }`
- `features`: `{ icon, title, text }`
- `hotspots`: `{ x, y, label, ref }` con x e y in percentuale sull'immagine
- `compare`: `{ drawing, photo }` per lo slider alzato/immagine
- `stats`: `{ label, value }`
- `model`: `{ file, kind: "configurator" | "exploded" }`
- `needsOriginals`: vero se la tavola va mostrata piccola finché non arrivano gli originali

## Pipeline 3D

1. Lo script Blender costruisce la scena da zero con misure scritte in cima al file, assegna **nomi stabili** a oggetti e materiali, salva un'anteprima Workbench 640 px ed esporta il `.glb`.
2. Nel browser: illuminazione con una mappa d'ambiente 1k (CC0, Poly Haven), luci emissive per i LED, ombra di contatto morbida. Niente lightmap precalcolate.
3. Il viewer **disegna solo quando qualcosa cambia** (rotazione, scroll, scelta di un materiale), con `devicePixelRatio` limitato a 1,5.
4. Se WebGL manca o l'utente ha chiesto meno animazioni, al posto del 3D compare l'immagine dello slot.

Texture: CC0 da Poly Haven o ambientCG, massimo 1024 px, oppure solo colore e rugosità dove basta.

## Pipeline delle sequenze video

`tools/build_frames.py clip-1.mp4` produce:
- desktop: 120 fotogrammi, 1280×720, WebP;
- mobile: 60 fotogrammi, 720 px di larghezza.

Il componente `ScrollSequence` disegna i fotogrammi su un canvas in base allo scroll. Carica subito il primo, poi gli altri a blocchi. **Se la cartella dei fotogrammi non esiste**, usa la modalità di riserva: l'immagine fissa dello slot con zoom lento e spostamento legati allo scroll. Così il sito è completo anche prima che arrivino le clip.

## Limiti di peso

| Cosa | Limite |
|---|---|
| Prima schermata della home (senza sequenza) | 1,5 MB |
| Una sequenza desktop / mobile | 6 MB / 2 MB |
| `creo-kitchen.glb` / `kyrenia-pavilion.glb` | 1,5 MB / 1 MB |
| JavaScript iniziale della home (senza three.js) | 150 KB compressi |

## Accessibilità e dispositivi

- `prefers-reduced-motion`: niente pin, niente sequenze, solo dissolvenze.
- Tutto raggiungibile da tastiera: menu, hotspot, lightbox, configuratore.
- Mobile: le sezioni pinnate diventano scorrimento normale; hotspot al tocco; 3D con rotazione a un dito e scroll della pagina non bloccato.
- Testo alternativo su ogni slot (campo `alt` del manifesto).
