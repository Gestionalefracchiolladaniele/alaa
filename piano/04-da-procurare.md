# Cosa devi procurare tu, e quando

Niente di questo blocca il lavoro: il sito ha sempre una versione di riserva. Ma più presto arriva, meno si rifà.

## 1. Clip video AI

**Quando:** puoi iniziare appena finisce F0, perché lì ti preparo i fotogrammi di partenza in `da-fornire/riferimenti/`. Servono entro l'inizio di F7.
**Dove metterle:** `da-fornire/clip/`, con i nomi indicati.

### Regole valide per tutte

| Voce | Valore |
|---|---|
| Tipo | da immagine a video (image-to-video), partendo dal fotogramma che ti do io |
| Formato | MP4 (H.264), 16:9, almeno 1920×1080, 24 o 30 fps |
| Durata | 5–8 secondi |
| Movimento | **un solo movimento di camera, lento e a velocità costante**, senza tagli, senza cambi di scena, senza accelerazioni |
| Contenuto | nessuna scritta, nessuna persona, nessun oggetto che compare o si trasforma |
| Qualità | la massima che lo strumento permette; niente filigrana |

Perché queste regole: nel sito il video non scorre da solo, è lo scroll a farlo avanzare e tornare indietro. Un movimento irregolare o un oggetto che cambia forma si notano subito.

Se uno strumento permette di fissare anche l'**ultimo fotogramma**, usalo: il risultato è più controllato.

### Clip 1 — obbligatoria — `clip-1.mp4` — la pellicola

- **Parti da:** `riferimenti/clip-1-start.png` (ritaglio di p1: pellicola, bobina, ramo d'ulivo, velluto; senza titoli né ciak).
- **Movimento:** la camera scivola lentamente da sinistra a destra lungo la pellicola, avvicinandosi appena.
- **Prompt di base:** *Slow smooth camera glide from left to right along a curling vintage film strip, warm cream background, soft studio light, olive branch gently still, burgundy velvet in the foreground, cinematic, shallow depth of field, no text, no people, constant speed.*

### Clip 2 — obbligatoria — `clip-2.mp4` — l'arco

- **Parti da:** `riferimenti/clip-2-start.png` (ritaglio di p3: arco in pietra con vista sulla costa).
- **Movimento:** la camera avanza dritta attraverso l'arco fino ad avere solo mare e cielo.
- **Finale ideale:** cielo chiaro e luminoso, perché sfuma nel color crema della scena successiva.
- **Prompt di base:** *Slow steady dolly forward through a sunlit stone arch toward a Mediterranean coastal town at golden hour, warm light, the arch edges pass out of frame, ending on open sea and bright sky, cinematic, no text, no people, constant speed.*

### Clip 3 — consigliata — `clip-3.mp4` — il sipario

Serve due volte: al contrario in apertura (le tende si aprono), in avanti nel finale (si chiudono).

- **Parti da:** `riferimenti/clip-3-start.png` (velluto bordeaux di p30).
- **Movimento:** camera ferma; due tende da teatro di velluto bordeaux, aperte ai lati, si chiudono fino a toccarsi al centro. Nello spazio tra le tende, fondo color crema uniforme (viene sostituito dal sito).
- **Prompt di base:** *Static camera, heavy burgundy velvet curtains slowly closing from both sides until they meet, soft warm light, rich fabric folds, no text.*

### Clip 4 — facoltativa — `clip-4.mp4` — le ombre

- **Parti da:** `riferimenti/clip-4-start.png` (parete crema con base di pietra, da p12).
- **Movimento:** camera ferma; solo le ombre delle foglie che oscillano piano sulla parete. Deve poter andare in loop.
- **Prompt di base:** *Static camera, soft shadows of olive leaves swaying gently on a warm cream plaster wall, sunlight, calm, seamless loop, no text.*

**Se riesci a farne solo due:** fai la 1 e la 2. La terza per importanza è la 3 (sipario). La 4 viene bene anche in codice.

## 1b. Video veri di moda e viaggi (facoltativi)

Se Alaa ha brevi video dei suoi viaggi o dei suoi look, le polaroid di Fashion e Travel possono animarsi.

| Voce | Valore |
|---|---|
| Durata | 3–6 secondi, un solo momento, senza tagli |
| Formato | MP4, verticale o 4:5, basta 720 px di larghezza |
| Audio | nessuno (viene comunque tolto) |
| Ripresa | più ferma possibile |
| Quanti | da 4 a 8 in tutto bastano |
| Dove | `originali/`, con il nome dello slot che ti indico dopo F1 |

**Quando:** in qualsiasi momento dopo F1. Senza video restano le foto.

## 2. Conferme da Alaa

**Quando:** dopo F1, quando esiste `piano/DA-CONFERMARE.md` con l'elenco completo. Non bloccano nulla.

Già note:
- quali contatti pubblicare (email, LinkedIn, Instagram `@_alaaattal_`);
- i dati di p13 e p16 che non tornano (vedi `05-correzioni-testi.md`);
- il marchio riportato sulla tavola del bagno (p8);
- il luogo di una foto di viaggio che non riconosco con certezza;
- se vuole un CV scaricabile, e in quale versione.

## 3. File originali

**Quando:** quando li avrai. Si mettono in `originali/` con il nome dello slot. Alla fine di F8 ti do l'elenco preciso dei nomi, in ordine di importanza.

Priorità:
1. disegni di **Botanic Garden (p13)** e **Urban II (p16)**;
2. immagini principali dei progetti di interior e delle ville;
3. opere d'arte (foto o file digitali) in alta risoluzione;
4. foto di moda e di viaggio.

## 4. I tuoi punti di controllo

| Dopo | Cosa guardi |
|---|---|
| F0 | Lo styleguide: colori e font ti sembrano quelli del PDF? |
| F1 | `DA-CONFERMARE.md` |
| **F3** | **La pagina della cucina Creo con il 3D: è la direzione giusta?** |
| F4 | Il padiglione che si apre |
| F6 | Il sito in movimento |
| F8 | L'anteprima online da mostrare ad Alaa |
