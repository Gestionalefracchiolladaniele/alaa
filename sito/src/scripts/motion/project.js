/* Punto d'ingresso del movimento delle pagine progetto. Caricato da components/ProjectPage.astro.
   Prima il 3D (il padiglione crea una sezione fissata in alto), poi i testi (titolo in due colori,
   contatori dei numeri chiave). three.js non e' qui: lo carica models.js quando serve. */
import { motion } from './core.js';
import { init as models } from '../three/models.js';
import { init as reveal } from './reveal.js';

const { ScrollTrigger } = motion();
models();
reveal();
ScrollTrigger.refresh();
