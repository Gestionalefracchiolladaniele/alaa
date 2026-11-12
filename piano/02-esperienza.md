# L'esperienza, scena per scena

Il sito ha due livelli:
- **la home è "il film"**: uno scroll unico in 7 scene, nell'ordine del PDF;
- **ogni progetto di interior e di architettura ha la sua pagina**, la "tavola interattiva" (12 pagine: 7 + 5).

Arte, moda, viaggi e real estate vivono interamente nella home.

## Elementi ricorrenti

- **Menu a pila di libri.** Fisso in basso a destra su desktop, in un pannello su mobile. I libri sono ricostruiti in CSS (dorso in pelle marrone, scritta oro), uno per sezione: Interior Design, Architecture, Real Estate, Art, Fashion, Travel. Al passaggio del mouse il libro esce dalla pila; quello della sezione corrente resta sporgente.
- **Copertine di sezione.** Le sei nature morte del PDF (p4, 12, 18, 20, 25, 28) aprono ogni scena a tutto schermo. Il titolo è testo HTML sopra l'immagine. Animazione in codice: zoom lento, titolo che entra lettera per lettera, tratto bordeaux che si disegna, ombra di foglie che si muove sopra l'immagine.
- **Grana della carta** su tutto il sito, cursore personalizzato discreto su desktop.
- **Numero di scena** in stile ciak ("SCENE 03 — ARCHITECTURE") nell'angolo, coerente con la copertina.

## Home

> Le transizioni tra scene, i colori del ciak e l'ordine dei progetti sono definiti in `06-tocco-unico.md`, che prevale su questo file.

**0. Ciak.** Fondo carta crema come la copertina, ciak costruito in SVG con i testi di p1 (Production: My Creative Journey · Director: Me · Scene: Portfolio · Take 07 · 2026). Un clic o il primo scroll chiude il ciak e apre il film. Chi torna sul sito non lo rivede (ricordo in `sessionStorage`).

**1. Copertina.** *Sequenza 1 (clip 1)*: la camera scorre lungo la pellicola. Sopra, in HTML: "PORTFOLIO", "A multidisciplinary creative journey", il motto in corsivo, la firma, le sei discipline. Riserva senza clip: immagine di p1 con zoom lento.

**2. About Me.** Foto di Alaa (p2), i tre paragrafi che compaiono riga per riga, la citazione in corsivo. Contatori animati: 16 countries, 3 languages, 8 Chairman's Appreciation Awards. Sotto, la **timeline del CV** (esperienze, studi, premi): è contenuto nuovo rispetto al PDF ma viene dal CV, e dà sostanza professionale.

**3. A Creative Philosophy.** Testo di p3, poi *sequenza 2 (clip 2)*: la camera attraversa l'arco verso il mare, e la luce finale sfuma nel crema della scena successiva. Riserva: zoom sull'arco di p3.

**4. Interior Design.** Copertina p4, poi **la pellicola dei progetti**: una striscia orizzontale pinnata con 7 fotogrammi, uno per progetto (immagine, titolo, luogo). Il clic apre la pagina del progetto. Il fotogramma della cucina Creo di Sharjah porta il segno "3D".

**5. Architecture.** Copertina p12, pellicola con 5 progetti. Kyrenia porta il segno "3D".

**6. Real Estate.** Copertina p18. Foto con il certificato (p19), "My Approach", "What I Deliver", i 4 servizi, Sharjah e Dubai. Il **percorso in 6 passi** è una linea dorata SVG che avanza con lo scroll e accende un passo alla volta. Chiusura: "The Right Investment, From A to Z".

**7. Art.** Copertina p20. Tre pareti: Digital Art (5 opere), Sketch Art (4), Paintings (7). Cornici dorate su parete crema; la **lampada sopra il quadro si accende** al passaggio del mouse (alone caldo in CSS). Clic: l'opera si apre a tutto schermo con titolo del gruppo e testo "The Inspiration".

**8. Fashion.** Copertina p25. Due tavoli: Black & White Collection e Old Money Style. Le foto sono **polaroid sparse e trascinabili**, con il nastro adesivo come nel PDF. Di fianco palette e note di stile.

**9. Travel.** Copertina p28. **Mappa del mondo in SVG** con i 16 paesi accesi in bordeaux, raggruppati come a p29 (Europe, Asia, Gulf Countries). Clic su un paese: compare la foto, se c'è. Sotto, le 7 icone (Food, Architecture, History …).

**10. Thank You.** Ovale crema su velluto (p30), contatti, e i libri del menu ripetuti come indice finale. *Clip 3 opzionale*: il sipario di velluto che si chiude. Riserva: due pannelli bordeaux che si chiudono in CSS.

## Pagina progetto (tavola interattiva)

Stessa struttura per tutti, nell'ordine in cui la tavola del PDF racconta il progetto:

1. Titolo, sottotitolo, luogo, marchio.
2. **Immagine principale con punti cliccabili**: ogni punto apre una scheda con il materiale o l'elemento corrispondente della tavola.
3. Testi (Design Concept, Design Story …).
4. **Palette** che si apre a ventaglio; clic su un colore per vederne nome e significato.
5. Materiali e finiture, maniglie, top, elettrodomestici: schede con immagine.
6. **Slider alzato ↔ immagine**, dove la tavola ha l'alzato (p8, p9, p10, p11).
7. Numeri chiave con contatore (architettura).
8. Diagrammi semplici **ridisegnati in SVG** che si tracciano con lo scroll (circolazione, zonizzazione, sezioni stradali di p13 e p16).
9. Precedente / successivo, e ritorno alla pellicola.

Le tavole con `needsOriginals` (p13 e p16) mostrano la pianta a grandezza contenuta, senza zoom, con la legenda riscritta in HTML accanto.

## Prova 3D n. 1 — cucina Creo, Sharjah (p9)

Parete lineare, da sinistra: due vetrine alte a telaio nero con ripiani illuminati; blocco centrale con cinque nicchie illuminate in alto, pensili grigi, nicchia di lavoro con schienale in quarzo e barra portaoggetti, piano, forno incassato tra frontali in noce; a destra colonne alte grigie con gola. Pavimento a lastre grigie.

Interazione:
- rotazione limitata (circa ±35°) e zoom, così la cucina resta sempre leggibile;
- **configuratore** con tre scelte e un interruttore:

| Parte | Originale | Varianti (prese dalle altre tavole di Alaa) |
|---|---|---|
| Ante | Matt Grey Lacquer | Soft Grey (p11), Ivory Lacquered (p10) |
| Frontali cassetti | Walnut Veneer | Natural Oak Veneer (p11) |
| Top e schienale | Dark Quartz | Calacatta Look Quartz (p11), Black Polished Granite (p10) |
| LED | accesi | spenti |

- pulsante **"Alaa's design"** che riporta alla combinazione originale, sempre indicata come tale;
- etichetta "3D study based on the project board".

## Prova 3D n. 2 — padiglione di Kyrenia (p14)

Solo il padiglione, in stile **plastico**: legno chiaro, bianco caldo, base in pietra. Niente fotorealismo: è coerente con gli schizzi del PDF e leggero da disegnare.

Cinque strati, con i nomi dell'assonometria di p14: Timber Slat Skin, Waterproof Membrane, Curved Ribs, Air Cavity, Base / Plinth.

Interazione: sezione pinnata. Con lo scroll il padiglione ruota lentamente e gli strati si separano in verticale. Ogni strato ha un'etichetta HTML con linea di richiamo, agganciata al punto 3D. Fuori dal pin si può ruotare liberamente.

## Idee aggiunte rispetto alla conversazione

1. **Pellicola dei progetti** come indice di interior e architettura: riusa il simbolo della copertina e tiene corta la home.
2. **Timeline del CV** dentro About: il CV smette di essere un allegato.
3. **Modalità di riserva per ogni clip**: il sito non dipende dai video.
4. **Pagina `/styleguide`** interna con colori, font e componenti affiancati a una pagina del PDF: serve a controllare la fedeltà estetica una volta sola, all'inizio.
5. **Parallasse di profondità sulle copertine** (facoltativa, F7): una mappa di profondità per ciascuna delle sei nature morte e un piccolo shader che le fa "respirare" con il mouse. Effetto forte, ma va provato: se ai bordi degli oggetti compaiono difetti, si resta sullo zoom lento.
