/* Punto d'ingresso del movimento della home. Caricato da pages/index.astro.
   Ogni modulo esporta init() e si occupa solo dei propri agganci data-*.
   Ordine: prima l'apertura (blocca lo scroll), poi cio' che crea sezioni fissate dall'alto verso il basso,
   cosi' ScrollTrigger calcola le posizioni nell'ordine giusto. */
import { motion, ON } from './core.js';
import { init as opening } from './opening.js';   // Fable: sipario + ciak
import { init as sequence } from './sequence.js'; // Opus: video legati allo scroll (clip 1, clip 2)
import { init as divein } from './divein.js';     // Fable: le porte "entrare"
import { init as reveal } from './reveal.js';     // Opus: testi, contatori, titoli, scritte
import { init as finale } from './finale.js';     // Fable: il sipario si richiude a Thank You

const { ScrollTrigger } = motion();
opening();                            // sipario disegnato in codice
sequence();                           // video veri: copertina da sola, arco legato allo scroll
divein();                             // porte a clic
reveal();                             // testi che compaiono una volta sola, zoom copertine in CSS
finale();                             // sipario finale in codice
ScrollTrigger.sort();
ScrollTrigger.refresh();
