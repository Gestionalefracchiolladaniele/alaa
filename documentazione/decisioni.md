# Decisioni prese

In ordine di tempo. Tutte del 12 novembre 2026, salvo diversa indicazione. Ogni decisione ha il suo perché, così chi riprende il lavoro non le rimette in discussione senza motivo.

## Il materiale di partenza

| Decisione | Perché |
|---|---|
| Si lavora con il solo PDF, senza i file originali | Gli originali non sono disponibili adesso. Si vuole una prima versione da vedere, poi si sostituisce |
| Ogni immagine è uno "slot" sostituibile | Così gli originali entrano senza toccare il codice |
| Tutti i testi vengono riscritti come testo vero e corretti | Le 30 pagine del PDF sono immagini piatte, con parole deformate (p13, p16, p26) ed errori copiati da una pagina all'altra (p8) |
| Dati personali del CV fuori dal sito | Data di nascita, stato civile, nazionalità, visto e telefono non servono su un sito pubblico |
| Niente CV scaricabile | Il PDF del CV contiene quei dati. Il CV diventa una timeline dentro About |

## L'idea del sito

| Decisione | Perché |
|---|---|
| Stessa estetica, stessi contenuti, stessa lingua (inglese) del PDF | Il sito deve essere il portfolio di Alaa reso interattivo, non una cosa nuova |
| Il concept è quello della copertina: "Designing Beyond Boundaries", pellicola e ciak | È ciò che il PDF già comunica |
| Ordine di scene e progetti identico alle pagine del PDF, da 1 a 30 | Richiesta di Daniele |
| Il gesto ricorrente è "entrare" | A Daniele è piaciuta la camera che entra nell'arco di p3: diventa la firma del sito. Ogni scena ha la sua "porta" presa dal PDF |
| Apertura a sipario: tende di velluto, ciak davanti, poi si entra in profondità | Richiesta di Daniele. Il finale usa lo stesso sipario che si chiude |
| Il ciak è quello della copertina del PDF, ritagliato | Un ciak ridisegnato non sarebbe coerente con quello della scena 1 |
| Pila di libri come menu | È l'elemento che torna in tutte le copertine di sezione |
| Vista "Index" e contatto sempre visibile | Per chi ha poco tempo. Proposte da Fable, date per accettate salvo diverso avviso |
| Effetti sulle opere d'arte solo se non le modificano | Animare i quadri con l'AI cambierebbe il lavoro di Alaa |

## 3D e video

| Decisione | Perché |
|---|---|
| Blender solo per i lavori di Alaa, non per le scene decorative | Scelta di Daniele |
| Scene decorative con clip video AI generate da Daniele | Scelta di Daniele. Due obbligatorie (pellicola, arco), una consigliata (sipario), una facoltativa (ombre) |
| Il sito deve funzionare anche senza clip | Ogni sequenza ha una versione di riserva animata in codice |
| Due soli modelli 3D di prova: cucina Creo (p9) e padiglione di Kyrenia (p14) | Sono i due con la geometria più chiara. Prima si vede se il risultato convince, poi si decide sugli altri |
| Cucina Creo e non Lube | La Lube ha intagli e ornamenti difficili da ricostruire; la Creo ha forme semplici |
| Il 3D si mostra nel browser, senza immagini precalcolate | Il PC ha 2 core e grafica integrata: calcolare immagini realistiche richiederebbe giorni |
| Padiglione in stile plastico, non fotorealistico | Coerente con gli schizzi del PDF e leggero da mostrare |
| Se un modello 3D non convince, si rimette l'immagine | Detto da Daniele: il 3D è un di più, non un obbligo |
| Video veri di Alaa per moda e viaggi, se li avrà | Meglio dell'AI, che deforma volti e abiti. Facoltativi |

## Tecnica

| Decisione | Perché |
|---|---|
| Astro, GSAP, Lenis, three.js | Pagine generate dai file di contenuto, animazioni legate allo scroll, 3D caricato solo dove serve |
| Quattro famiglie di caratteri: Bodoni Moda, Cormorant Garamond, Jost, Allura | Scelta di Opus confrontando con p1, p2 e p4. Una in più del previsto: il testo lungo in Bodoni sarebbe stancante |
| I PDF originali restano fuori da git | Il portfolio pesa 23 MB e il CV ha dati personali |
| Pubblicazione su Vercel | Daniele lo sa già usare |

## Come si lavora

| Decisione | Perché |
|---|---|
| Fable pianifica e fa le parti difficili, Opus esegue | Scelta di Daniele |
| Un solo Opus alla volta, in parallelo con Fable | Più agenti insieme rischiano di fare le stesse cose in modi diversi |
| Opus a impegno medio | Scelta di Daniele |
| Le correzioni si annotano ma per ora non si applicano | Daniele vuole occuparsene in un altro momento |
| Le pagine di anteprima sul PC restano chiuse mentre Opus lavora | Per lasciargli tutto il computer |
| Le parti dove conta il gusto (ritmo delle porte, sipario) le scrive Fable; base dei video, testi e 3D li scrive un agente Opus lanciato da Fable con istruzioni scritte (12 nov sera) | Usare Fable solo dove fa differenza |
| Correzioni, domande per Alaa, file originali e clip 1 da rigenerare restano fuori dal lavoro per ora (12 nov sera) | Scelta di Daniele |
| Il progetto va spostato dal disco F: a un disco sano; la scheda SD solo come seconda copia (12 nov sera) | F: ha blocchi danneggiati e la build non parte più |
| Niente ciak nell'apertura: solo sipario e "Click to begin" (12 nov sera) | Scelta di Daniele dopo averlo visto |
| La clip 1 si usa tutta, anche con il cambio di scena (12 nov sera) | Scelta di Daniele |
| Il sipario finale è quello iniziale al contrario (12 nov sera) | Scelta di Daniele |
| Lo scroll deve avere una leggera inerzia, ma prima viene la leggerezza: si ottimizza tutto, misurando (12 nov sera) | A Daniele il sito risulta pesante; i ritocchi fatti senza misurare l'hanno peggiorato |
| Il Blocco C resta fermo finché la base non convince (12 nov sera) | Non costruire altre sezioni sopra qualcosa che non piace |
| Le bozze si fanno vedere con Netlify Drop (12 nov sera) | Scelta di Daniele: veloce e senza configurazione |
| Versione leggera: scroll del browser, video veri al posto delle sequenze di immagini (13 nov) | La misura ha mostrato che tutta la pesantezza veniva dal movimento |
| Copertina: video che gira da solo; arco: video legato allo scroll (13 nov) | Scelta di Daniele, dopo aver provato l'arco a clic |
| Sezioni: si prosegue solo cliccando (13 nov) | Scelta di Daniele |
| 3D che si compone, pulsanti per togliere i pezzi, padiglione con barra invece dello scroll (13 nov) | Scelta di Daniele |
| Progetti con il 3D per primi nelle pellicole (13 nov) | Metterli in evidenza; l'ordine del PDF vale per gli altri |
| Pubblicazione su Vercel, codice su GitHub (13 nov) | Scelta di Daniele |

## Lasciate in sospeso

- La forma della piccola apertura in testa al padiglione.
- A cosa deve servire il sito per Alaa (lavoro, clienti di interior, consulenza immobiliare): per ora tutte le discipline hanno lo stesso peso, come nel PDF.
- Dominio definitivo.
