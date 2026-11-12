# Sito portfolio di Alaa Attal — piano della fase 1

Questo è il piano che l'esecutore (Opus) segue passo per passo. Leggi i file in ordine.

| File | Contenuto |
|---|---|
| `00-LEGGIMI.md` | Decisioni fisse, regole di lavoro, decisioni ancora aperte |
| `01-architettura.md` | Stack, cartelle, sistema degli slot, pipeline 3D e video, limiti di peso |
| `02-esperienza.md` | Cosa vede e fa il visitatore, scena per scena |
| `03-fasi.md` | Le fasi di lavoro, con verifica alla fine di ognuna |
| `04-da-procurare.md` | Cosa deve procurare Daniele (clip video e conferme) e quando |
| `05-correzioni-testi.md` | Errori noti del PDF e come trattarli |
| `06-tocco-unico.md` | Il gesto "entrare", il ciak, i video per moda e viaggi, chi fa cosa tra Fable e Opus. **Prevale sugli altri file** |

## Obiettivo della fase 1

Un sito completo e navigabile, fatto con il solo materiale del PDF e del CV, che mostri già "come sarebbe". Gli originali di Alaa arriveranno dopo e sostituiranno le immagini senza toccare il codice.

## Decisioni fisse

1. **Estetica, contenuti e lingua sono quelli del PDF.** Inglese. Crema, bordeaux, oro, verde oliva; titoli serif, frasi in corsivo, etichette in maiuscoletto spaziato. Il concept è quello della copertina: "Designing Beyond Boundaries — A Multidisciplinary Creative Journey", con pellicola e ciak.
2. **Tutti i testi diventano testo HTML**, riscritti e corretti. Nessun testo resta dentro un'immagine, tranne dove fa parte di un disegno.
3. **Ogni immagine è uno slot sostituibile** (vedi `01-architettura.md`).
4. **3D solo come prova, su due lavori:** cucina Creo di Sharjah (p9) come configuratore, padiglione di Kyrenia (p14) esploso con lo scroll. Modelli costruiti con script Blender, mostrati nel browser con three.js.
5. **Nessun render pesante in locale.** Il PC ha 2 core e grafica integrata: Blender serve solo a modellare ed esportare. Sono ammesse solo anteprime Workbench a bassa risoluzione per controllare la geometria.
6. **Video AI: 2 obbligatori, al massimo 4.** Li fornisce Daniele. Il sito deve funzionare anche senza: ogni sequenza ha una versione di riserva animata in codice.
7. **Dati personali del CV fuori dal sito:** niente data di nascita, stato civile, nazionalità, visto, telefono.

## Regole per l'esecutore

- **Una fase alla volta.** A fine fase: build senza errori, verifica descritta in `03-fasi.md`, commit git, poi fermati e mostra il risultato a Daniele.
- **Non inventare contenuti.** I testi si trascrivono dalle pagine del PDF. Dove una parola è illeggibile o un dato non torna, scegli la correzione ovvia se esiste, altrimenti lascia il testo più prudente e aggiungi una riga a `piano/DA-CONFERMARE.md` (lo crei tu in F1).
- **I modelli 3D sono ricostruzioni dalle immagini.** Sul sito portano l'etichetta "3D study based on the project board" finché Alaa non li approva.
- **Rispetta i limiti di peso** di `01-architettura.md`. Se un effetto non ci sta, semplifica l'effetto.
- **Se una scelta del piano si rivela sbagliata** mentre lavori, dillo a Daniele con l'alternativa: non aggirarla in silenzio.
- Parla con Daniele in italiano semplice: non è uno sviluppatore.

## Decisioni aperte (con la scelta di default)

| Decisione | Default finché nessuno dice altro |
|---|---|
| Contatti pubblici | Email e LinkedIn dal CV. Instagram `@_alaaattal_` solo dopo conferma di Alaa |
| CV scaricabile | No: il PDF contiene dati personali. Il CV diventa una timeline nel sito |
| Suono del ciak | Nessun suono |
| Hosting e dominio | Vercel (Daniele lo sa già usare). Dominio da decidere in F8 |
| Foto di viaggio senza luogo certo | Senza didascalia di luogo |
