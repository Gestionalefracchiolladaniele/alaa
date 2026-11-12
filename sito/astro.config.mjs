// @ts-check
import { defineConfig } from 'astro/config';

// Sito statico. Le immagini degli slot sono ottimizzate da Astro (sharp) in WebP/AVIF.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  image: {
    responsiveStyles: false,
  },
  devToolbar: { enabled: false },
});
