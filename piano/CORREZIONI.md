# Correzioni da fare

Registro unico delle cose da sistemare, trovate controllando il lavoro. Lo tiene Fable.

- **Chi:** F = Fable, O = Opus, D = Daniele, A = serve una risposta di Alaa.
- **Stato:** aperta · in corso · fatta · sospesa (decisa di non farla adesso).
- Le domande per Alaa sui contenuti stanno in `DA-CONFERMARE.md`, non qui.
- **Per ora nessuno le applica:** Daniele ha deciso (12 nov) di occuparsene lui in un altro momento. Il file serve a tenerne traccia. Opus non lo modifica.

## Aperte

| # | Dove | Problema | Cosa fare | Chi | Stato |
|---|---|---|---|---|---|
| 1 | `site.json`, contatti | L'indirizzo LinkedIn `linkedin.com/in/alaaattal` è indovinato: il CV dice solo "LinkedIn: AlaaAttal". Un link sbagliato su un sito pubblico porta a un'altra persona o a una pagina vuota | Finché Alaa non conferma: mostrare "LinkedIn: AlaaAttal" come testo, senza link | O | aperta |
| 2 | Slot `fashion-bw-01`, `fashion-bw-02` (e controllare gli altri `fashion-*` e `travel-*`) | I ritagli prendono la polaroid storta del PDF: bordi bianchi inclinati e nastro adesivo dentro l'immagine. Nel sito le polaroid le disegna il codice, quindi verrebbero due cornici | Ritagliare solo l'interno della foto (stringere il riquadro, o raddrizzare prima di ritagliare) | O | aperta |
| 3 | Foglio di controllo degli slot | I fogli in `tools/_cache/contact/` mostrano circa 55 slot su 220. Non è chiaro se gli altri 165 siano stati controllati a vista | Rigenerare i fogli per tutti gli slot e controllarli; annotare in `AVANZAMENTO.md` quelli dubbi | O | aperta |
| 4 | `da-fornire/riferimenti/clip-3-start.png` | Nell'angolo in basso a destra entra un pezzo dell'ovale crema; l'immagine è molto sfocata (ingrandita da 176 px) | Ritaglio di solo velluto, senza l'angolo crema. Valutare un velluto più grande da un'altra pagina (p1, p4 o p20 ne hanno di più estesi) | O | aperta |
| 5 | `da-fornire/riferimenti/ciak.png` e `sito/src/assets/ciak.png` | Scontorno approssimativo: resta un cuneo crema tra asta e corpo e un angolo di velluto in basso a sinistra | Rifinire lo scontorno e separare l'asta dal corpo (serve per farla chiudere) quando si costruisce l'apertura | F | aperta |
| 6 | Palette di `creo-sharjah.json` e configuratore 3D | Due grigi diversi per la stessa anta: `#6d5c4c` nella palette (campionato dall'immagine, che ha luce calda) e `#6f6a66` nel configuratore | Scegliere un solo valore per ogni materiale e usarlo in entrambi i posti | F | aperta |
| 7 | Prova 3D in `tools/prototipi/3d/` | È una pagina a sé, fuori dal sito | Portare i tre file in `sito/src/scripts/three/`, collegare il padiglione allo scroll, aggiungere l'immagine di riserva | F | aperta |
| 8 | `tokens.css`, font | Quattro famiglie di caratteri (Bodoni Moda, Cormorant Garamond, Jost, Allura) invece delle tre previste: più peso da scaricare | Tenere, ma caricare solo i pesi usati e controllare il peso totale in F8 | O | aperta |
| 9 | `clip-2-start.png` | Dentro l'inquadratura ci sono il foglio con lo schizzo e il busto: nel video usciranno dai bordi, ma l'AI potrebbe deformarli | Nessuna modifica al file. Nel generare la clip, se vengono male, provare con il ritaglio del solo arco | D | aperta |

## Sospese

| # | Dove | Problema | Nota | Chi |
|---|---|---|---|---|
| S1 | Padiglione di Kyrenia, apertura piccola in testa | La forma non è quella voluta: Daniele la vuole "meno ad arco, più vicina a una linea dritta, più stretta verso il basso dalla parte del centro" | Lasciata com'è per decisione di Daniele (12 nov). Prima di rifarla, farsi indicare la forma su un'immagine | F |

## Fatte

| # | Dove | Problema | Come è stata risolta | Chi |
|---|---|---|---|---|
| — | Cucina Creo, anteprima d'angolo | Si vedeva il bordo della parete e uno sfondo di altro colore | Parete e pavimento allargati, sfondo dello stesso colore | F |
| — | Padiglione di Kyrenia | Apertura in testa a tutta sezione, forma a cupola | Guscio allungato che tocca terra ai due capi, grande apertura vetrata sul fianco, colmo al centro, testa bassa | F |
