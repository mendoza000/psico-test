// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://psico-test-cuestionario.vercel.app',
  integrations: [react()],

  vite: {
    // Cast: conflicto de tipos entre el Vite (rolldown) de Astro y @tailwindcss/vite.
    // Es solo de tipos; en runtime funciona.
    plugins: [/** @type {any} */ (tailwindcss())]
  }
});