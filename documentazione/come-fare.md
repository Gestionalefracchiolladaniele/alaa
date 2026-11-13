# Come fare

Istruzioni pratiche. I comandi vanno lanciati dalla cartella del progetto, `C:\progetti\alaa-attal` (dal 12 novembre sera: il disco F: è danneggiato), in un terminale Git Bash. In alternativa basta chiedere a Claude di farlo.

## Vedere il sito sul PC

Mostra l'ultima versione costruita (non le modifiche in corso):

```
cd sito
npx astro preview --host 127.0.0.1 --port 8124
```

Non usare piu' il server di Python per il sito: non permette al browser di saltare dentro i video, e l'arco legato allo scroll sembra rotto.

Poi apri http://127.0.0.1:8124/ — la pagina dello stile è http://127.0.0.1:8124/styleguide/

Per chiudere: Ctrl+C nel terminale.

Per ricostruire il sito dopo una modifica:

```
cd sito
npm run build
```

## Vedere la prova 3D

```
uv run --no-project python -m http.server 8123 --bind 127.0.0.1 --directory .
```

Poi apri http://127.0.0.1:8123/tools/prototipi/3d/

- Cucina: trascina per girare, rotella per avvicinarti, pulsanti per cambiare i materiali.
- Padiglione: il cursore sotto lo apre a strati.

## Sostituire un'immagine con l'originale di Alaa

Ogni immagine del sito ha un nome, per esempio `creo-sharjah-hero`. L'elenco completo è in `sito/src/data/slots.json`.

1. Metti il file originale in `originali/` e chiamalo come lo slot: `creo-sharjah-hero.jpg` (va bene anche `.png`).
2. Rigenera i ritagli:
   ```
   uv run --with pillow python -I tools/build_slots.py
   ```
   Per rigenerarne uno solo, aggiungi il nome in fondo: `… tools/build_slots.py creo-sharjah-hero`
3. Ricostruisci il sito (`npm run build` dentro `sito/`).

Lo script usa l'originale se c'è, altrimenti il ritaglio dal PDF ingrandito due volte. Non serve toccare il codice. Formati accettati: jpg, jpeg, png, webp, tif.

## Correggere un testo

I testi stanno in `sito/src/content/`:
- `site.json` — nome, motto, contatti, menu;
- `cv.json` — esperienze, studi, premi;
- `sections/` — About, Philosophy, Real Estate, Art, Fashion, Travel;
- `projects/interior/` e `projects/architecture/` — un file per progetto.

Si modifica il testo tra virgolette e si ricostruisce il sito.

## Aggiungere una clip video

1. Genera la clip seguendo `piano/04-da-procurare.md`, partendo dall'immagine in `da-fornire/riferimenti/`.
2. Mettila in `da-fornire/clip/` con il nome indicato (`clip-1.mp4`, `clip-2.mp4`, `clip-3.mp4`).
3. Lo script che la trasforma in fotogrammi (`tools/build_frames.py`) **non esiste ancora**: verrà scritto insieme al motore dei video.

## Rifare un modello 3D

Dopo aver cambiato una misura in cima allo script:

```
"F:/cartella prova/blender/tools/blender-5.2.1-windows-x64/blender.exe" -b -P tools/blender/creo_kitchen.py
"F:/cartella prova/blender/tools/blender-5.2.1-windows-x64/blender.exe" -b -P tools/blender/kyrenia_pavilion.py
```

Ogni script impiega 2–3 minuti su questo PC e scrive in `tools/blender/out/`:
- le anteprime `.png`, per controllare la forma;
- il file `.glb`, cioè il modello per il browser.

Poi va copiato nel sito:

```
cp tools/blender/out/*.glb sito/public/models/
```

Le misure che si possono cambiare sono descritte in `modelli-3d.md`.

## Salvare il lavoro in git

Opus salva da solo alla fine di ogni fase. I file di Fable (modelli 3D, prova 3D, piano, questa documentazione) **non sono ancora stati salvati in git**: vanno salvati quando Daniele lo chiede.

## Misurare se lo scroll è pesante

Con l'anteprima accesa (vedi sopra):

```
PROF_DIR=/c/progetti/_edge-misura node tools/misura_scroll.mjs tutto lenis reveal sequence divein grain
```

Stampa i fotogrammi al secondo dello scroll, in totale e scena per scena, con tutto acceso e poi spegnendo una parte alla volta. Dura circa un minuto per ogni parola. Per sentire la differenza a mano si può aprire nel browser, per esempio, `http://127.0.0.1:8124/?off=lenis` (senza scroll morbido) oppure `?off=reveal,sequence`.

## Mandare una bozza a qualcuno (Netlify Drop)

1. Ricostruisci il sito (`npm run build` dentro `sito`).
2. Apri https://app.netlify.com/drop e trascina dentro la cartella `sito/dist`.
3. Invia l'indirizzo che compare. Senza un account gratuito il sito viene cancellato dopo poco: controlla cosa dice la pagina.

L'indirizzo è pubblico per chiunque lo abbia.
