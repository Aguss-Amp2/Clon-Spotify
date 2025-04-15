import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  experimental: {
    viewTransitions: true,
  },
  vite: {
    plugins: [tailwindcss()]
  }
});