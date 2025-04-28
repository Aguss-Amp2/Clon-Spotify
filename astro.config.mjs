import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel'
import svelte from '@astrojs/svelte';

import react from '@astrojs/react';

export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [svelte(), react()],

  output: 'server',
  adapter: vercel(),
});