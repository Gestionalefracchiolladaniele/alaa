# I due modelli 3D

Sono **ricostruzioni dalle immagini del portfolio**, non i progetti esecutivi di Alaa. Le misure sono stimate dalle proporzioni. Finché Alaa non li approva, sul sito portano la dicitura "3D study based on the project board".

Sono costruiti da script Blender, senza disegno a mano: per cambiare una forma si cambia un numero e si rilancia lo script (vedi `come-fare.md`).

| | Cucina Creo | Padiglione di Kyrenia |
|---|---|---|
| Pagina del portfolio | p9 | p14 |
| Script | `tools/blender/creo_kitchen.py` | `tools/blender/kyrenia_pavilion.py` |
| File per il sito | `sito/public/models/creo-kitchen.glb` | `sito/public/models/kyrenia-pavilion.glb` |
| Peso | 308 KB (limite 1,5 MB) | 986 KB (limite 1 MB) |
| Triangoli | circa 4.900 | circa 17.100 |
| Anteprime | `tools/blender/out/creo-kitchen-front.png`, `-angle.png` | `tools/blender/out/kyrenia-pavilion.png`, `-end.png`, `-exploded.png` |

Le anteprime sono veloci, senza luci né materiali veri: servono solo a controllare la forma.

## Cucina Creo (Sharjah)

Parete lineare, larga 4,60 m e alta 2,40 m (altezza ipotizzata). Da sinistra:

1. **Vetrine alte** (1,04 m): due ante a telaio nero, cinque ripiani in vetro con luce sotto, piatti e bicchieri.
2. **Blocco centrale** (2,52 m):
   - in alto cinque nicchie illuminate, con vasi e bottiglie;
   - tre pensili grigi;
   - nicchia di lavoro con schienale in quarzo, barra portaoggetti, piano cottura, macchina del caffè;
   - basi: due cassetti in noce, forno con cassetto sotto, un'anta in noce.
3. **Colonne alte** (1,04 m): due ante grigie, divise da una gola orizzontale.

### Materiali che il sito può cambiare

Ogni materiale è un pezzo unico con un nome fisso, così il configuratore sa cosa colorare.

| Nome nel modello | Cos'è | Originale | Varianti (dalle altre cucine di Alaa) |
|---|---|---|---|
| `cabinet` | ante laccate | Matt Grey Lacquer | Soft Grey (p11), Ivory Lacquered (p10) |
| `wood` | frontali in legno | Walnut Veneer | Natural Oak Veneer (p11) |
| `worktop` | piano e schienale | Dark Quartz | Calacatta Look Quartz (p11), Black Polished Granite (p10) |
| `led` | strisce luminose | accese | spente |

Venature del legno e del quarzo sono disegnate dal codice del sito: nessuna texture da scaricare.

### Limiti

- Forme semplici: niente maniglie sagomate, niente dettagli fini.
- Il grigio delle ante ha due valori diversi tra palette del sito e configuratore (correzione 6).

## Padiglione di Kyrenia

Stile **plastico**: legno chiaro, bianco caldo, base in pietra. Non è fotorealistico, per scelta: è coerente con gli schizzi del portfolio e leggero da mostrare.

Forma attuale:
- guscio allungato, lungo 24 m (stimato), alto 6,5 m al colmo, largo 10 m;
- tocca terra alle due estremità; il colmo è al centro;
- la **testa** (lato sinistro) sale piano, bassa e schiacciata verso terra;
- **grande apertura sul fianco lungo**, ad arco, verso destra, con vetrata arretrata e trave curva di bordo;
- **piccola apertura in testa**, sul lato corto: un arco basso, circa 1,4 m di altezza per 3,8 m di larghezza;
- pianta leggermente curva, a fagiolo.

### Gli strati

Sono pezzi separati, con i nomi dell'assonometria di p14. Il sito li solleva uno alla volta.

| Nome nel modello | Strato |
|---|---|
| `layer-skin` | Timber Slat Skin (doghe di legno) |
| `layer-membrane` | Waterproof Membrane |
| — | Air Cavity: è lo spazio tra doghe e membrana, non ha geometria; ha solo l'etichetta |
| `layer-ribs` | Curved Ribs (nervature, arcarecci, trave di bordo) |
| `layer-glazing`, `layer-glazing-frame` | vetrata e montanti |
| `layer-base` | Base / Plinth |

### Misure che si possono cambiare (in cima allo script)

| Nome | Valore | Cosa controlla |
|---|---|---|
| `L` | 24.0 | lunghezza |
| `H_MAX` | 6.5 | altezza al colmo |
| `W_MAX` | 5.0 | metà della larghezza massima |
| `PEAK` | 0.50 | posizione del colmo (0 = testa, 1 = coda) |
| `BEND` | 1.5 | curvatura in pianta |
| `OPEN_T` | 0.54 – 0.94 | tratto di fianco occupato dalla grande apertura |
| `OPEN_ANGLE` | 50° | quanto sale la grande apertura |
| `T0` | 0.08 | dove comincia il guscio: più è alto, più grande è l'apertura in testa |
| `GLASS_SETBACK` | 0.9 | arretramento della vetrata |

Il profilo della testa (quanto è schiacciata) si regola nella funzione `section`.

### Storia delle correzioni

1. Prima versione: a cupola, con l'apertura in testa a tutta sezione. Sbagliata.
2. Rifatto come guscio allungato con la grande apertura sul fianco, come nella vista principale di p14.
3. Aggiunta una piccola apertura: prima sul fianco (sbagliato), poi in testa sul lato corto.
4. Apertura in testa rimpicciolita due volte; testa resa più bassa; colmo spostato al centro.
5. Provato un profilo della testa quasi rettilineo: annullato, si è tornati al punto 4.

### In sospeso

**La forma della piccola apertura in testa.** Daniele la vuole "meno ad arco, più vicina a una linea dritta, più stretta verso il basso dalla parte del centro". Non è ancora chiaro come tradurlo: prima di rifarla conviene farsi indicare la forma su un'immagine. Lasciata com'è per sua decisione.

### Avvertenza sulla tavola

I disegni di p14 non concordano tra loro: il prospetto ovest mostra un'apertura in testa a tutta altezza, la vista principale la mostra sul fianco. Si è seguita la vista principale.

## La prova nel browser

In `tools/prototipi/3d/`:

| File | Cosa fa |
|---|---|
| `index.html` | la pagina di prova |
| `viewer-core.js` | base comune: luci, camera, disegno solo quando qualcosa cambia |
| `kitchen.js` | configuratore della cucina |
| `pavilion.js` | padiglione che si apre, con le etichette agganciate agli strati |

Daniele l'ha vista e per ora va bene. Resta da fare: portarla dentro il sito, collegare il padiglione allo scroll (ora c'è un cursore), aggiungere l'immagine di riserva per i dispositivi che non reggono il 3D.
