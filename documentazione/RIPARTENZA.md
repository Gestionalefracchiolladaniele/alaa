# Da dove ripartire

Aggiornato alla fine della sessione del 12 novembre 2026 (sera tardi), per chi riprende il lavoro in una chat nuova, senza memoria di questa.

**Prima cosa da leggere, in ordine:** questo file → `LEGGIMI.md` → `decisioni.md` → `piano/06-tocco-unico.md` → `piano/TODO.md` → `piano/AVANZAMENTO.md` (tabella dei punti di aggancio e sezione "F6 — Movimento").

## ⚠ Prima di tutto: il disco F: è danneggiato

Il 12 novembre alle 19 circa il disco F: (HGST da 500 GB, meccanico) ha cominciato a dare errori di lettura: Windows registra "blocco danneggiato" e segna il volume come "riparazione completa necessaria". Almeno due file dentro `sito/node_modules` non si leggono più, e per questo **`npm run build` fallisce con `EIO: i/o error, read`**. Non dipende dal codice.

- **Il progetto ora vive in `C:/progetti/alaa-attal`** (disco C:, SSD sano), copiato la sera del 12 novembre. Si lavora solo qui. La cartella vecchia `F:/cartella prova/alaa attal` resta com'è, per sicurezza: non usarla e non cancellarla senza che Daniele lo dica.
- La copia è stata confrontata con l'originale (720 file, stessi nomi e dimensioni) e `git fsck` è pulito.
- **Manca il PDF del portfolio** (`sorgenti/Arch. Alaa Attal portfolio .pdf`, 23,7 MB): su F: non si legge più. Daniele lo riscarica e lo rimette in `sorgenti/` con lo stesso nome. Serve solo per rifare i ritagli o le pagine: il sito si costruisce anche senza. Il CV c'è.
- `sito/src/assets/slots/travel-05.jpg` non si leggeva su F:: è stato ripreso da git.
- Le librerie sono state reinstallate pulite in `C:/progetti/alaa-attal/sito` e **`npm run build` funziona** (14 pagine, circa 40 secondi).
- Blender è ancora su F: (`F:/cartella prova/blender/...`): se servirà rifare i modelli 3D, controllare che funzioni o spostarlo.
- Una copia interrotta e incompleta si trova in `C:/Users/danie/backup-alaa-attal-2026-11-12`: si può cancellare.
- Non lanciare `chkdsk` né scansioni dell'intero disco F: senza che Daniele lo chieda.
- Il lavoro del 12 novembre **non è in git** (vedi sotto): finché non viene salvato esiste solo come file.

## Stato in una riga

Il sito con il movimento **si costruisce e si apre**. Daniele l'ha guardato: **molte cose non gli piacciono** e lo scroll gli risulta **pesante**. Il lavoro adesso non è aggiungere: è **alleggerire e rifinire** quello che c'è. Il Blocco C è fermo finché la base non lo convince.

## Aggiornamenti successivi del 13 novembre (sera tardi)

- **Repository GitHub:** https://github.com/Gestionalefracchiolladaniele/alaa, ramo `main`. In locale il ramo si chiama `master`: per caricare usare **`git push origin master:main`** (un `git push` semplice non va a buon fine). Ogni caricamento ripubblica il sito su Vercel.
- **Vercel:** Root Directory `sito`, preset Astro, build `npm run build`, output `dist`; se serve, Node 24.x.
- **Experience (About):** pulsante al centro con bordo dorato e "+" in un cerchio bordeaux. Corretto il bug per cui, aprendolo, lo scroll saltava sul video dell'arco: `home.js` ricalcola le sezioni fissate a ogni apertura/chiusura e quando cambiano le altezze.
- **Telefono:** l'arco è un'immagine ferma, senza scroll né video (scelta di Daniele: la versione animata dava problemi). Il codice per farlo animare anche sul telefono resta (`g.shift` in `setupArch`), spento da un `return` in `setup`. Le porte a clic si ingrandiscono anche sul telefono.
- **3D:** pulsanti + e − tondi sopra il modello, in basso a sinistra, per cucina e padiglione (`zoomUI` in `models.js`); pannello della cucina più stretto (12,2 rem) e compatto, sempre a destra.
- **Menu a libri:** pulsante "Index" con freccia anche sul computer per chiuderlo e riaprirlo; la scelta resta ricordata (`localStorage`, chiave `aa-booknav-closed`). Posizione: in basso a destra, un po' più in alto del bordo.
- **Foto dello schermo:** Daniele ora le accetta per controllare il lavoro. Script in uso: Edge senza finestra via protocollo di debug (porta 9334), viewport 390×844 per il telefono e 1440×900 per il computer.

Da fare, se Daniele lo chiede: velo della porta di Interior crema invece di marrone; link LinkedIn ed email visibili prima di diffondere il link; pagina d'ingresso con password (Vercel la offre solo a pagamento); controllo completo del telefono scena per scena; Blocco C (`piano/TODO.md`).

## Stato al 13 novembre (sera) — leggere prima di tutto

Daniele ha detto "tutto ok" su questa versione. Il codice è salvato in git e caricato su GitHub (`Gestionalefracchiolladaniele/alaa`); si pubblicherà su **Vercel** (cartella del progetto: `sito`).

Cosa c'è ora nel sito:
- **scroll normale del browser** (lo scroll morbido Lenis è spento: si riaccende per prova con `/?on=lenis`);
- **copertina:** video vero (`/video/clip-1.mp4`) che gira da solo in loop, senza scroll; tolta la bobina sopra il video;
- **arco (Philosophy):** video vero legato allo scroll (`/video/clip-2.mp4`, ogni fotogramma completo per saltare senza scatti), sezione fissata, l'arco si allarga a tutto schermo, velo crema, Interior. La versione a clic esiste spenta (`ARCH_CLICK` in `divein.js`, `ARCH_SCROLL` in `sequence.js`);
- **sezioni:** si prosegue solo cliccando la porta o il pulsante "Enter" (`divein.js`);
- **testi:** compaiono una volta sola; zoom delle copertine in CSS;
- **sipario d'apertura e finale** disegnati in codice, senza video e senza ciak;
- **3D:** cucina e padiglione si compongono pezzo per pezzo quando entrano nello schermo; pulsanti per togliere e rimettere i pezzi; il padiglione si apre con una barra e si gira trascinandolo (niente più scroll fissato);
- **progetti con il 3D per primi** nelle pellicole;
- **menu a libri** molto più piccolo, un po' più in alto, nascosto nel finale (tolti anche i libri sotto Thank You).

Anteprima sul PC: `npx astro preview --host 127.0.0.1 --port 8124` dentro `sito`. **Non usare il server di Python**: non permette di saltare dentro i video e l'arco sembra rotto.

I fotogrammi in `sito/public/sequences/*/desktop|mobile` non sono più usati e sono esclusi da git; restano solo i `manifest.json`, che la build legge.

## Ultima decisione (ore 20:30): versione leggera con porte a clic

Daniele ha provato il sito con tutto il movimento spento e ha scelto quella come base. Stato attuale del sito costruito:
- scroll normale del browser, niente testi animati, niente video legati allo scroll (si riaccendono per prova con `/?on=lenis,reveal,sequence`);
- sipario d'apertura e sipario finale **disegnati in codice**, senza il video delle tende;
- nelle copertine di sezione **si prosegue solo cliccando** la porta o il pulsante "Enter": il resto della pagina è nascosto finché non si entra.
Dettagli in `piano/AVANZAMENTO.md`, ultima sezione. Costruito senza errori, non ancora guardato. Le sezioni qui sotto sulla misura valgono come storia: descrivono la versione pesante.

## Cosa ha detto Daniele dopo averlo visto

- "Ci sono molte cose che non mi piacciono": non ha ancora detto quali. **Va chiesto**, scena per scena.
- Lo scroll: lo vuole fluido, scorrevole, con una leggera inerzia ("che va da solo"). Dopo il primo giro di alleggerimenti gli è sembrato **peggiorato**. Conclusione sua: "per pesantezza dobbiamo ottimizzare tutto".
- Ciak: **tolto** dall'apertura per sua scelta (resta "Click to begin" al centro del sipario).
- Clip 1 della copertina: **si usa tutta** (120 fotogrammi), anche con il cambio di scena.
- Sipario finale: lo vuole, uguale a quello iniziale ma al contrario. Fatto.
- Per mandare una bozza a qualcuno vuole usare Netlify Drop (trascinare `sito/dist` su app.netlify.com/drop; lo fa lui).

## Misura della pesantezza

Lo scroll è stato regolato più volte **senza vedere e senza misurare**, ed è il motivo per cui è peggiorato. Non rifare lo stesso errore: prima misurare.

- Script: `tools/misura_scroll.mjs`. Apre Edge senza finestra, fa scorrere la home da cima a fondo e stampa i fotogrammi al secondo, totali e per scena, più il tempo speso in script, layout e stile. Niente foto dello schermo.
- Serve l'anteprima accesa su `http://127.0.0.1:8124/` (vedi `come-fare.md`). Si lancia dalla cartella del progetto:
  `PROF_DIR=/c/progetti/_edge-misura node tools/misura_scroll.mjs tutto lenis reveal sequence divein grain`
- Ogni parola è una passata (circa 50 secondi l'una): `tutto` = tutto acceso; le altre spengono quella parte tramite l'indirizzo `/?off=...` (interruttori in `core.js` e `home.js`: `lenis`, `reveal`, `sequence`, `divein`, `finale`, `opening`, `grain`). Gli stessi indirizzi li può aprire Daniele nel browser per sentire la differenza.
- Una prima misura era in corso quando è stato scritto questo file: **se qui sotto non c'è la sezione "Risultati della misura", non è stata letta**: rilanciarla e partire da lì.
- Senza finestra la scheda grafica lavora diversamente dal vero: i numeri servono a confrontare le parti tra loro, non come valore assoluto. L'ultima parola spetta a Daniele sul suo schermo.

Sospetti, da confermare con la misura:
- lo scroll morbido (Lenis) sposta la pagina dal filo principale: su 2 core ogni intoppo diventa uno scatto, mentre lo scroll normale del browser no. Se pesa, valutare inerzia solo leggera oppure scroll nativo;
- `reveal.js`: molti controlli legati allo scroll, e lo zoom delle copertine cambia una variabile CSS a ogni fotogramma (ridisegna l'immagine);
- la preparazione in anticipo dei fotogrammi (`createImageBitmap` in `sequence.js`) può impegnare il processore proprio durante lo scroll;
- `mix-blend-mode` sullo schizzo delle copertine, ombre e filtri;
- pagina unica molto lunga con oltre 200 immagini.

## Cosa è stato scritto in questa sessione

Tutti i file `.js` superano `node --check`. Nessuno è stato provato in un browser.

| Parte | File | Chi |
|---|---|---|
| Base del movimento: Lenis + ScrollTrigger una volta per pagina, "riduci animazioni", curva `enter` comune, blocco dello scroll | `sito/src/scripts/motion/core.js` | Fable |
| Punto d'ingresso della home (ordine: apertura, sequenze, porte, testi) | `sito/src/scripts/motion/home.js`, caricato in fondo a `index.astro` | Fable |
| Porte "entrare" delle 6 copertine di sezione + anello dorato "Enter" | `sito/src/scripts/motion/divein.js`, `sito/src/styles/doors.css`; `SectionCover.astro` ha ora il contenitore `[data-divein-stage]` | Fable |
| Apertura a sipario con ciak | `sito/src/scripts/motion/opening.js`, `doors.css`, blocco `[data-opening]` in `index.astro` con un piccolo script in linea | Fable |
| Motore delle sequenze (`createPlayer`, `init`), copertina (clip 1), arco (clip 2) | `sito/src/scripts/motion/sequence.js`, `ScrollSequence.astro`, `sito/src/styles/motion.css` | Opus |
| Testi riga per riga, contatori, titoli in due colori, tratto bordeaux, zoom delle copertine, corsivo che si scrive | `sito/src/scripts/motion/reveal.js`, `motion.css` | Opus |
| 3D nelle pagine progetto (cucina con configuratore, padiglione che si apre con lo scroll) | `sito/src/scripts/three/{viewer-core,kitchen,pavilion,models}.js`, `sito/src/scripts/motion/project.js`, blocco `[data-model-viewer]` in `ProjectPage.astro` | Opus |

Sistemato a inizio sessione: fotogrammi della clip 2 completi (120 desktop, 60 mobile, manifest); bordi trasparenti del sipario controllati su fondo verde (puliti; resta una fascia di circa 20 px in alto non del tutto trasparente, trascurabile; se serve, primo numero di `colorkey` in `tools/build_frames.py` da `0.20` a `0.25`).

## Come si regola il ritmo

- Porte: i numeri in `RHYTHM` in cima a `divein.js` (durata, quando arriva il velo, quanto si ingrandisce) e la curva `enter` in `core.js`. Valgono per tutte le porte.
- Sipario: i numeri in `T` in cima a `opening.js`.

## Risultati della misura (12 novembre, ore 20:15 circa)

Home a 1440×900, Edge senza finestra, scroll automatico da cima a fondo (30.000 px). **Numeri rumorosi:** durante la misura il PC stava facendo altro, e una sola passata per variante non basta. Vanno presi come indizi e la misura va ripetuta a PC fermo, due volte per variante.

| Variante | Fotogrammi al secondo | Fotogrammi lenti (oltre 34 ms) | Lavoro del filo principale | Ricalcoli di stile |
|---|---|---|---|---|
| Tutto acceso | 52 | 3% | 19,5 s su 45 s | 2261 |
| Senza scroll morbido (`off=lenis`) | 52 | 4% | 10,9 s su 36 s | 1420 |
| Senza testi animati (`off=reveal`) | 47 | 3% | 16,9 s su 51 s | 639 |
| Senza video (`off=sequence`) | 54 | 3% | 16,6 s su 37 s | 2019 |
| Senza porte (`off=divein`) | 36 | 10% | 25,6 s su 53 s | 2021 |
| Senza grana (`off=grain`) | 46 | 7% | 21,1 s su circa 50 s | 2845 |
| **Tutto il movimento spento** | **60** | **0%** | **1,3 s su 23 s** | **0** |

**Il dato più chiaro:** con tutto il movimento spento la pagina fa 60 fotogrammi al secondo fissi, nessuno lento, e il filo principale lavora 15 volte meno. Il sito fermo è leggerissimo: **tutta la pesantezza viene dal codice del movimento**, non dalle immagini né dalla lunghezza della pagina. La grana della carta non c'entra (il suo dato è nel rumore).

Con tutto acceso, per scena: Philosophy (l'arco) è la peggiore, 38 fotogrammi al secondo e 10% di fotogrammi lenti; poi la copertina, 46 e 5%. Tutte le altre stanno tra 53 e 59.

Cosa se ne ricava, con prudenza:
- **Senza finestra il sito non risulta drammaticamente lento** (52 al secondo), mentre Daniele sul suo schermo lo sente pesante. La differenza sta quasi certamente nel disegno a schermo (scheda grafica integrata, schermo più grande), che questa misura non vede. Serve un modo di misurare sul browser vero di Daniele, oppure farlo provare con gli indirizzi `?off=...`.
- **Il filo principale è occupato per oltre il 40% del tempo** durante lo scroll: su 2 core è tanto. Lo scroll morbido da solo ne vale circa un terzo.
- **`reveal.js` causa circa tre quarti dei ricalcoli di stile** (da 2261 a 639 spegnendolo): il primo sospetto è lo zoom delle copertine fatto con una variabile CSS.
- **L'arco e la copertina** sono i due punti pesanti: sono quelli con i video.
- Il dato "senza porte" (peggiore di "tutto acceso") non ha senso: è rumore. Conferma che la misura va ripetuta.

## Prossimi passi, nell'ordine

1. **Misurare** (sezione sopra), poi **alleggerire** la parte che pesa davvero, una modifica alla volta, rimisurando dopo ognuna. Far provare a Daniele dopo ogni giro.
2. **Farsi dire da Daniele cosa non gli piace**, scena per scena, e dividere in: cose rotte, ritmo e gusto, impaginazione di fondo, idee da togliere. Chiedergli se si possono fare foto dello schermo con Edge senza finestra: finora è stato tutto scritto senza guardare, ed è la causa principale della qualità grezza.
3. **Correggere** in quell'ordine: prima le cose rotte, poi il ritmo, poi l'impaginazione.
4. Solo quando la base lo convince: **Blocco C** con un agente Opus (pellicole in orizzontale e transizione verso la pagina progetto, interazioni delle pagine progetto, Real Estate, Art, Fashion, Travel, luce del viaggio, contatore di scena, vista Index, mobile). Elenco in `piano/TODO.md`.
5. **Bozza online** con Netlify Drop quando Daniele vuole farla vedere. Ricordargli: il link LinkedIn è indovinato, sul sito c'è l'email di Alaa, l'indirizzo è pubblico.
6. **Salvare in git** quando Daniele lo chiede: tutto il lavoro del 12 novembre è ancora fuori da git. `git status` dalla cartella del progetto mostra l'elenco.
7. Rimettere il PDF del portfolio in `sorgenti/` quando Daniele lo riscarica.

## Scelte fatte che conviene conoscere

- Il ciak è stato tolto dall'apertura (scelta di Daniele). `opening.js` contiene ancora il codice del ciak ma non trova più l'elemento e lo salta.
- Sipario finale (`finale.js`): clip 3 in avanti legata allo scroll; le tende si chiudono DIETRO l'ovale di Thank You, che resta leggibile.
- Porta della copertina verso About: `addCoverDoor` in `divein.js`, chiamata da `sequence.js` dentro la timeline della copertina (clip per 1,6 schermi di scroll, poi la porta per 1).
- Scroll: i due numeri sono in `SCROLL` in `core.js` (`inertia` 0,06, `wheel` 1). Le animazioni seguono lo scroll senza ritardo proprio (`scrub: true`).
- Grana della carta: tolto `mix-blend-mode` (pesava su tutta la finestra).
- Se i fotogrammi della clip 3 mancano o tardano più di 2,5 secondi, si aprono i due pannelli disegnati in CSS.
- Il sipario non compare a chi arriva su un'ancora (`/#art`) né a chi l'ha già visto nella visita (`sessionStorage`, chiave `aa-opened`). Con "riduci animazioni" è una dissolvenza.
- Le porte su telefono e con "riduci animazioni" non fissano la sezione: dissolvenza della scena di arrivo, oppure niente.
- `opening.js` lancia l'evento `opening:done`: `reveal.js` lo aspetta per far partire le scritte della copertina.
- `ScrollSequence.astro` legge il manifest al momento della build e mette `data-sequence-available`: se si rifanno i fotogrammi va rifatta la build.
- Lo zoom delle copertine usa la proprietà CSS `scale`, non `transform`, per non scontrarsi con le porte.

## Le tre clip

In `da-fornire/clip/`. Tutte 1280×720, 24 fotogrammi al secondo, 5 secondi.

| Clip | Giudizio | Cosa si usa |
|---|---|---|
| 1 — pellicola | Dal fotogramma 42 compare una seconda pellicola (cambio di scena): a Daniele va bene così | Tutti i 120 fotogrammi (desktop 6,9 MB, oltre il limite di 6; mobile 60, 2 MB) |
| 2 — arco | **Ottima** | Tutti i 120 fotogrammi |
| 3 — sipario | **Ottima**; chiuse dal fotogramma 100 circa | 0–100, uno ogni due (51 desktop, 34 mobile), fondo trasparente |

Quali fotogrammi usare si decide in `tools/clips.json`; si rigenerano con `uv run --no-project python -I tools/build_frames.py <clip>`.

## Come lavora Daniele (da rispettare)

- Non è uno sviluppatore: spiegare in italiano semplice, senza gergo.
- Fable fa le parti dove conta il gusto (ritmo delle porte, sipario), Opus le altre. È Daniele a cambiare modello; Fable può lanciare **un solo** agente Opus con istruzioni scritte, a impegno medio.
- Vuole vedere e decidere: interrompe i comandi lunghi. Dire cosa si sta per fare e quanto dura **prima** di lanciare lavori di qualche minuto, comprese le copie di file.
- **Niente foto dello schermo del sito** finché non lo chiede lui. Ha interrotto anche un controllo automatico senza finestra: prima di lanciarne uno, dire cosa fa e quanto dura.
- Interrompe spesso i comandi: se interrompe una costruzione del sito a metà, `sito/dist` resta incompleto e il sito non si apre. Controllare e ricostruire.
- Le correzioni di `piano/CORREZIONI.md`, le domande per Alaa, i file originali e la clip 1 da rigenerare sono **fuori dal lavoro** per ora.
- Il PC è debole (2 core): niente lavori pesanti in parallelo, niente scansioni di cartelle enormi, niente anteprime lasciate accese mentre un agente lavora.
- Python non è un comando diretto: si usa `uv run --no-project python`.
- Sul padiglione ha un'idea precisa della piccola apertura in testa che non è stata capita: chiedere di indicarla su un'immagine prima di riprovare.

## Indirizzi utili

- Storyboard: https://claude.ai/artifact/86w5zBgRs8YqSutxWbTnCw
- Anteprima sul PC: `http://127.0.0.1:8124/` (era accesa a fine sessione; se non risponde, riaccenderla come da `come-fare.md`, dalla cartella `C:/progetti/alaa-attal`).
