# Prompt per le clip video

Per ogni clip: carica l'immagine di riferimento come **primo fotogramma** (modalità "image to video"), incolla il prompt, usa le impostazioni indicate. I prompt sono in inglese perché gli strumenti video li capiscono meglio.

## Impostazioni uguali per tutte

| Voce | Valore |
|---|---|
| Formato | 16:9 |
| Risoluzione | 1080p (la più alta disponibile) |
| Durata | 5 secondi (se lo strumento offre solo 5 o 10, scegli 5) |
| Audio | nessuno |
| Filigrana | nessuna |
| File | MP4 |

Prompt negativo, uguale per tutte (se lo strumento ha il campo apposito):

```
text, letters, captions, watermark, logo, people, hands, new objects appearing, objects morphing or changing shape, flicker, cuts, scene change, speed changes, camera shake, zoom bursts, blur
```

## Come scegliere la versione buona

Genera 3 o 4 versioni e tieni quella in cui:
1. il primo fotogramma è identico all'immagine di riferimento;
2. la camera si muove a velocità costante, senza scatti né accelerazioni;
3. nessun oggetto cambia forma, compare o sparisce;
4. non c'è nessun taglio.

Nel sito il video non scorre da solo: lo fa avanzare e tornare indietro lo scroll. Per questo i difetti di movimento si notano più del solito.

---

## Clip 1 — la pellicola (obbligatoria)

- **Immagine di riferimento:** `riferimenti/clip-1-start.png`
- **Salva come:** `clip/clip-1.mp4`
- **Movimento di camera** (se lo strumento ha i controlli): spostamento laterale verso destra ("truck right" / "pan right"), intensità bassa.

```
The camera glides slowly and smoothly from left to right along a curling vintage 35mm film strip, with a very slight push-in. Only the camera moves: the film strip, the pictures inside its frames and the olive branches stay perfectly still and unchanged. Warm cream studio background, soft diffused light, shallow depth of field, photorealistic, cinematic. One continuous shot at constant speed.
```

## Clip 2 — l'arco (obbligatoria)

- **Immagine di riferimento:** `riferimenti/clip-2-start.png`
- **Salva come:** `clip/clip-2.mp4`
- **Movimento di camera:** avanzamento ("dolly in" / "push in"), intensità media.

```
Slow, steady dolly forward through the sunlit stone arch toward the Mediterranean coastal town at golden hour. As the camera advances, the arch, the taped sketch and the marble bust slide out of frame. The shot ends on open sea, distant hills and a bright pale sky filling the whole frame. Only the camera moves: the sea is calm, nothing else changes. Warm light, photorealistic, cinematic. One continuous shot at constant speed.
```

Se il foglio con lo schizzo o il busto si deformano, riprova: di solito una versione su tre viene pulita.

## Clip 3 — il sipario (consigliata)

- **Immagine di riferimento:** per ora nessuna. Usa la modalità "text to video". (L'immagine `riferimenti/clip-3-start.png` è troppo sfocata per fare da primo fotogramma: se lo strumento accetta un'immagine "di stile" o "di riferimento colore", puoi caricarla lì.)
- **Salva come:** `clip/clip-3.mp4`
- **Movimento di camera:** nessuno, camera ferma.

```
Static camera, straight front view. Two heavy burgundy velvet theatre curtains hang open at the left and right edges of the frame, in front of a plain, evenly lit warm cream background. The curtains close slowly toward the centre at constant speed until they meet and fill the whole frame. Deep wine-red velvet with rich vertical folds, soft warm light from above. No stage, no floor, no people, no text. Photorealistic, cinematic. One continuous shot.
```

Il sito la usa due volte: al contrario in apertura (le tende si aprono), in avanti nel finale.

## Clip 4 — le ombre (facoltativa)

- **Immagine di riferimento:** `riferimenti/clip-4-start.png`
- **Salva come:** `clip/clip-4.mp4`
- **Movimento di camera:** nessuno, camera ferma.

```
Static camera. Soft shadows of olive leaves sway very gently on the warm cream plaster wall, as if moved by a light breeze. The stone column and everything else stay perfectly still. Warm sunlight, calm, photorealistic. Seamless loop.
```
