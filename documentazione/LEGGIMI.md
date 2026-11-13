# Documentazione del progetto

Sito portfolio interattivo dell'architetta Alaa Attal, costruito a partire dal suo portfolio PDF e dal CV.

Questa cartella dice **cosa esiste oggi e come si usa**. Cosa si vuole costruire sta invece nella cartella `piano/`.

Ultimo aggiornamento: 13 novembre 2026, sera.

**Il progetto ora sta in `C:\progetti\alaa-attal`** (il disco F: è danneggiato). Leggi prima `RIPARTENZA.md`.

## I documenti

| File | A cosa serve |
|---|---|
| `RIPARTENZA.md` | Da dove riprendere il lavoro in una chat nuova |
| `LEGGIMI.md` | Questo file: stato del progetto e mappa delle cartelle |
| `come-fare.md` | Istruzioni pratiche: vedere il sito, sostituire un'immagine, rifare i modelli 3D, aggiungere le clip |
| `modelli-3d.md` | I due modelli 3D: come sono fatti, misure, limiti, cosa si può cambiare |
| `decisioni.md` | Le decisioni prese finora e il loro perché, in ordine di tempo |

Altri documenti, nella cartella `piano/`:

| File | A cosa serve |
|---|---|
| `piano/00`–`06` | Il piano: obiettivi, struttura, esperienza scena per scena, fasi |
| `piano/TODO.md` | La lista delle cose da fare, con le spunte |
| `piano/AVANZAMENTO.md` | Il diario tecnico di Opus, fase per fase |
| `piano/CORREZIONI.md` | Le cose da sistemare trovate durante i controlli |
| `piano/DA-CONFERMARE.md` | Le domande per Alaa sui contenuti (37 voci) |

## A che punto siamo

| Parte | Stato |
|---|---|
| Piano del sito | Fatto |
| Storyboard (pagina illustrata dello scroll) | Fatto: https://claude.ai/artifact/86w5zBgRs8YqSutxWbTnCw |
| F0 — progetto, colori, font, styleguide, immagini di partenza per le clip | Fatto |
| F1 — testi trascritti e corretti, 220 ritagli di immagini, domande per Alaa | Fatto (segnato da Opus; salvataggio in git da verificare) |
| F2 — home statica e 12 pagine progetto | Fatto |
| Modello 3D della cucina Creo | Fatto |
| Modello 3D del padiglione di Kyrenia | Fatto; forma dell'apertura piccola in sospeso |
| 3D nel sito: si compone pezzo per pezzo, colori, pezzi da togliere, zoom, barra del padiglione | Fatto |
| Movimento (versione leggera): sipari in codice, video veri, porte a clic, arco legato allo scroll, testi che compaiono | Fatto; approvato da Daniele ("tutto ok") |
| Telefono | Arco e porte sistemati; controllo completo scena per scena da fare |
| Sezioni interattive (arte, moda, viaggi, real estate), controlli finali | Da fare (Blocco C) |
| Codice su GitHub, pubblicazione su Vercel | GitHub fatto; Vercel collegato da Daniele |
| Clip video AI (1 pellicola, 2 arco, 3 sipario) | Arrivate e trasformate in fotogrammi; della 1 si usa tutto |
| File originali di Alaa | Non ancora disponibili |

## Le cartelle

```
alaa attal/
├─ documentazione/     questa cartella
├─ piano/              il piano e i registri (TODO, correzioni, domande per Alaa)
├─ sorgenti/           i due PDF originali (non vanno in git: pesano e il CV ha dati personali)
├─ originali/          qui andranno i file veri di Alaa, uno per immagine (ora vuota)
├─ da-fornire/
│   ├─ riferimenti/    immagini di partenza per generare le clip, con il loro LEGGIMI
│   └─ clip/           qui vanno messe le clip generate
├─ tools/
│   ├─ *.py            script che estraggono pagine, colori e ritagli dal PDF
│   ├─ _cache/         file di lavoro: le 30 pagine intere, fogli di controllo
│   ├─ blender/        script dei due modelli 3D e le loro anteprime (out/)
│   └─ prototipi/3d/   la pagina di prova dei modelli 3D
└─ sito/               il sito vero e proprio
    ├─ src/content/    tutti i testi, in file separati per sezione e per progetto
    ├─ src/data/       l'elenco dei ritagli (slots.json)
    ├─ src/assets/     le immagini ritagliate usate dal sito
    ├─ public/models/  i due modelli 3D pronti per il browser
    └─ dist/           l'ultima versione costruita del sito
```

## Chi fa cosa

- **Fable** (pianificazione e parti difficili): modelli 3D, visualizzatore, apertura, "entrare", revisioni.
- **Opus** (esecuzione): fondamenta, testi, immagini, pagine, sezioni, controlli.
- **Daniele**: clip video, conferme con Alaa, file originali, pubblicazione su Vercel.

Il dettaglio è in `piano/06-tocco-unico.md` e in `piano/TODO.md`.

## Cose da sapere prima di pubblicare

- Il link LinkedIn nel sito è indovinato, non confermato (correzione 1 in `piano/CORREZIONI.md`).
- I due modelli 3D sono ricostruzioni dalle immagini: sul sito portano la dicitura "3D study based on the project board" finché Alaa non li approva.
- Dati personali del CV esclusi dal sito: data di nascita, stato civile, nazionalità, visto, telefono.
