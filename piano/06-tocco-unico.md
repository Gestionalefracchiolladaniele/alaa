# Il tocco unico: "entrare"

Aggiunta al piano dopo lo storyboard. Dove questo file e gli altri dicono cose diverse, vale questo.

## L'idea

Il sito ha **un solo gesto ricorrente**: la camera entra in qualcosa che nel PDF c'è già. L'arco di p3 è il modello. Ogni scena ha la sua "porta", e si passa alla scena dopo attraversandola.

Questo sostituisce le copertine di sezione "ferme": la copertina ora ha un compito, è la soglia.

## La porta di ogni scena

L'ordine è **quello delle pagine del PDF, da 1 a 30**, senza eccezioni, anche dentro le sezioni.

| Scena (pagine PDF) | Si entra in… | E si arriva a… | Come |
|---|---|---|---|
| Copertina (p1) | un fotogramma della pellicola | About Me | clip 1, poi zoom in codice |
| Philosophy (p3) | l'arco sul mare | copertina Interior | clip 2 |
| Interior (p4) | lo schizzo a matita della stanza | pellicola dei 7 progetti | codice: lo schizzo riempie lo schermo e prende colore |
| Architecture (p12) | il portico disegnato | pellicola dei 5 progetti | codice |
| Real Estate (p18) | la polaroid della villa | pagina Real Estate (p19) | codice |
| Art (p20) | il quadro sul cavalletto | le pareti con le opere | codice |
| ogni opera (p21–24) | la cornice dorata | l'opera a tutto schermo | codice |
| Fashion (p25) | il foglio con il figurino | i due tavoli | codice |
| Travel (p28) | il mappamondo | la mappa dei 16 paesi | codice: il globo cresce e si "srotola" in mappa |
| un fotogramma della pellicola progetti | il fotogramma stesso | la pagina del progetto | transizione tra pagine: l'immagine cresce fino a diventare quella principale |
| Thank You (p30) | — | — | si esce: il sipario si chiude |

## Perché quasi tutto si fa in codice

Entrare in un'immagine **piatta** (un quadro, una polaroid, uno schizzo) è uno zoom verso un rettangolo: i bordi escono dallo schermo e l'immagine dentro viene sostituita, in dissolvenza, dallo slot ad alta qualità. Non serve un video.

Solo l'arco ha vera profondità, e per questo usa la clip.

Componente unico: `DiveIn`. Riceve l'immagine, il rettangolo di arrivo (in percentuale) e la scena successiva. Tutte le porte lo usano: stessa durata, stessa curva di accelerazione.

## Regole

- **Una sola porta per scena.** Niente zoom dentro altri zoom.
- **Breve:** l'ingresso dura circa uno schermo di scroll, non di più.
- **Reversibile:** scorrendo all'indietro si esce dalla stessa porta.
- **Su mobile e con "riduci animazioni":** dissolvenza semplice.
- Il cursore, sopra una porta, diventa un piccolo anello dorato con la scritta "Enter".

## Effetti sulle opere d'arte

Solo effetti che **non cambiano l'opera**:
- ingresso nella cornice (sopra);
- lampada che si accende;
- riflesso di luce sulla tela che segue il mouse, come una vernice lucida;
- lente d'ingrandimento sui dettagli, quando arriveranno i file in alta risoluzione.

Animare le opere con l'AI (candele che tremolano, figure che si muovono) modifica il lavoro di Alaa: si fa solo se lo chiede lei.

## Video veri per Fashion e Travel

Uno slot può contenere **un video al posto dell'immagine**. Se in `originali/` c'è `<slot-id>.mp4`, la polaroid si anima al passaggio del mouse (o quando entra nello schermo, su mobile) e torna foto quando esci.

Specifiche in `04-da-procurare.md`. Sono facoltativi: senza video restano le foto.

Meglio video veri di Alaa che foto animate con l'AI: sui volti e sugli abiti l'AI deforma, e si tratta della sua immagine.

## Il ciak iniziale

**Apertura a sipario** (decisione di Daniele, sostituisce la versione precedente).

Come funziona:
1. Il sito si apre su un **sipario di velluto bordeaux chiuso**, a tutto schermo, con pieghe e luce calda dall'alto. Davanti, il ciak (ritaglio dalla copertina del PDF, a grandezza contenuta) e la scritta "Click to begin".
2. Al clic l'asta del ciak si chiude e il ciak esce di scena.
3. **Le tende si aprono ai lati.** Dietro, in profondità, c'è la copertina (p1): parte più piccola e appena sfocata e viene avanti mentre le tende escono più veloci. L'effetto è di entrare in scena.
4. Continuando a scorrere parte la scena 1.

Il velluto è lo stesso drappo presente in ogni pagina del PDF: il colore si campiona da lì.

Il finale (Thank You) usa lo stesso sipario che si chiude: il film finisce come è cominciato.

Prima versione in codice (due pannelli con pieghe e prospettiva). Se arriva la **clip 3** (sipario), la stessa clip si usa al contrario in apertura e in avanti nel finale.

Niente primo piano sul ciak: nel PDF è largo circa 330 px e ingrandito a tutto schermo sarebbe sgranato.

**Alternativa con AI (clip 0, facoltativa):** un primo piano di 2–3 secondi del ciak che si chiude, generato partendo dal ritaglio di p1. Rischio: l'AI deforma le scritte a mano e cambia leggermente l'oggetto, quindi può risultare diverso da quello della copertina. Si prova solo se Daniele vuole; si tiene la versione che convince di più.

## Altri tocchi

1. **Scritte in corsivo che si scrivono da sole** ("Designing Beyond Boundaries", la firma, "The Inspiration"): comparsa lungo il tratto, come una penna.
2. **Titoli in due colori** come nel PDF (PORT·FOLIO, ARCH·ITECTURE): il bordeaux arriva dopo, come una pennellata.
3. **Luce che cambia lungo il viaggio:** mattino all'inizio, ora dorata a metà, sera al Thank You. È una tinta che varia con lo scroll.
4. **Contatore da pellicola** al posto della barra di avanzamento: "SCENE 04 / 09".
5. **Timeline del CV chiusa in un cassetto** dentro About ("Experience"), così la sequenza resta identica al PDF.
6. **Vista "Index"** separata, con tutti i lavori in una schermata: non altera la sequenza del film.

## Chi fa cosa

| Parte | Modello | Perché |
|---|---|---|
| F0: styleguide, font, colori | Fable | Decide l'aria di tutto il sito |
| Componente `DiveIn` e la prima porta (p4) | Fable | È la firma del sito: ritmo e curva vanno trovati una volta, bene |
| Ciak iniziale e copertina | Fable | Primo impatto |
| Corsivo che si scrive, luce del viaggio | Fable | Dettagli che fanno la differenza |
| Script Blender (cucina Creo, padiglione Kyrenia) | Fable | Ricostruire forme da un'immagine piatta |
| Revisione ai punti di controllo F3, F6, F8 | Fable | Sguardo critico prima di proseguire |
| Tutto il resto (testi, slot, pagine progetto, le altre porte con `DiveIn` già pronto, clip, controlli) | Opus | Esecuzione su binari già tracciati |

Ordine pratico: Fable costruisce il primo esemplare di ogni cosa, Opus lo replica.
