# Fasi di lavoro

Ordine pensato per **vedere presto come sarà**: dopo F3 esiste già un pezzo finito dall'inizio alla fine (home essenziale + pagina Creo con 3D). Se lì qualcosa non convince, si corregge prima di moltiplicarlo per 12 progetti.

Ogni fase finisce con: build senza errori → verifica → commit → stop e resoconto a Daniele.

---

## F0 — Fondamenta

- `git init`, `.gitignore`; sposta i due PDF in `sorgenti/`; crea le cartelle di `01-architettura.md`.
- Progetto Astro in `sito/` con GSAP, Lenis, three, Fontsource.
- `tools/extract_pages.py`: le 30 immagini native del PDF in `tools/_cache/pages/`.
- `tools/sample_palette.py` → `styles/tokens.css` (colori, spaziature, raggi, ombre).
- Scelta dei tre font per confronto con p1 e p4.
- Pagina `/styleguide`: titoli, corsivo, etichette, pulsanti, libro del menu, cornice dorata, campione palette, affiancati all'immagine di p4.
- Prepara in `da-fornire/riferimenti/` i fotogrammi di partenza delle clip (vedi `04-da-procurare.md`).

**Verifica:** `/styleguide` aperto accanto a p4: stessa aria. **Daniele:** guarda lo styleguide e riceve i riferimenti per generare le clip.

## F1 — Contenuti e slot

- Trascrivi tutti i testi delle 30 pagine nei file di `src/content/`, applicando `05-correzioni-testi.md`. Crea `piano/DA-CONFERMARE.md`.
- `cv.json` dal CV, senza i dati personali esclusi.
- `slots.json`: un riquadro di ritaglio per ogni immagine utile (circa 90–110 slot). `build_slots.py` e `contact_sheet.py`.
- Prova di ingrandimento su un ritaglio; decisione Real-ESRGAN o Lanczos.

**Verifica:** foglio di controllo con tutti gli slot ritagliati bene (niente testo tagliato dentro, niente bordi di pagina); `astro check` valida i contenuti. **Daniele:** legge `DA-CONFERMARE.md`.

## F2 — Home statica

- Le 10 scene della home con testi e immagini veri, layout responsive, **senza animazioni**.
- Menu a libri funzionante (ancore), pellicole dei progetti come semplice griglia scorrevole.
- Pagina progetto: template con tutti i blocchi, statici.

**Verifica:** scroll completo a 1440, 768 e 390 px di larghezza; nessun testo sovrapposto; ogni link funziona.

## F3 — Primo pezzo finito: cucina Creo (p9)

- Pagina `/interior/creo-sharjah/` completa: hotspot, palette a ventaglio, schede materiali, slider alzato ↔ immagine.
- `tools/blender/common.py` e `creo_kitchen.py` → anteprima Workbench → `creo-kitchen.glb`.
- Viewer three.js, configuratore, pulsante "Alaa's design", immagine di riserva.

**Verifica:** anteprima del modello confrontata con l'alzato di p9 (proporzioni e numero dei moduli); nel browser ogni variante cambia la parte giusta; il viewer resta fermo quando non si interagisce; peso del `.glb` entro il limite. **Daniele: punto di controllo principale.** Se l'impostazione convince, si prosegue.

## F4 — Padiglione di Kyrenia (p14)

- Pagina `/architecture/kyrenia-waterfront-art-centre/` completa.
- `kyrenia_pavilion.py` → `kyrenia-pavilion.glb` con i cinque strati come nodi separati.
- Sezione pinnata con esplosione a scroll ed etichette agganciate.

**Verifica:** forma confrontata con prospetti e assonometria di p14; lo scroll avanti e indietro è reversibile senza scatti; su mobile lo scroll della pagina non resta bloccato.

## F5 — Le altre 10 pagine progetto

- Interior: Sharjah Residence, Cozy Studio (Munich), Classic Luxury Living Room, Thai Bathroom, Lube Royal Classic, Creo Abu Dhabi.
- Architecture: Botanic Garden, Children Entertainment Centre, Urban II, Three-Villa Compound.
- Diagrammi SVG ridisegnati per p13 e p16; legende in HTML; `needsOriginals` attivo su p13 e p16.

**Verifica:** ogni pagina confrontata con la sua tavola: nessun contenuto perso, nessun errore del PDF rimasto.

## F6 — Movimento

- Lenis e ScrollTrigger; comparsa dei testi; copertine di sezione animate.
- Ciak iniziale; `ScrollSequence` con modalità di riserva; pellicole dei progetti pinnate in orizzontale.
- Real estate: linea dei 6 passi. Art: lampade e lightbox. Fashion: polaroid trascinabili. Travel: mappa. Finale: sipario in CSS.
- `prefers-reduced-motion` e versione mobile di ogni effetto.

**Verifica:** scroll fluido su questo PC (che è un buon banco di prova: se regge qui, regge ovunque); nessun salto di layout quando partono i pin; con "riduci animazioni" il sito resta completo.

## F7 — Clip e rifiniture

- `build_frames.py` sulle clip arrivate; le sequenze sostituiscono la modalità di riserva.
- Facoltativo, con tempo limitato: parallasse di profondità sulle copertine. Se non convince alla prima prova, si scarta.
- Cursore, grana, transizioni tra pagine.

**Verifica:** peso delle sequenze entro i limiti; primo fotogramma visibile subito.

## F8 — Controllo finale e anteprima online

- Lighthouse su home e una pagina progetto (obiettivo: prestazioni ≥ 85 su mobile, accessibilità ≥ 95).
- Prova su Chrome, Firefox, Safari (o WebKit) e su un telefono vero.
- Titoli, descrizioni e immagine di anteprima per la condivisione; favicon.
- Scelta dell'hosting con Daniele e pubblicazione di un'anteprima privata da mostrare ad Alaa.

**Verifica:** elenco finale di cosa resta da sostituire con gli originali, generato dal manifesto degli slot.

---

## Dopo la fase 1

- Sostituzione degli slot con gli originali; zoom sulle piante di p13 e p16.
- Revisione di Alaa su testi, dati e sui due modelli 3D.
- Eventuali altri modelli 3D (Three-Villa Compound, bagno thai).
