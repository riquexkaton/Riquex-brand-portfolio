import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// TODO: replace with the production domain once it is decided.
const SITE_URL = 'https://riquex-portfolio.pages.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // HTML compression uses Astro 7's default `compressHTML: 'jsx'` (prettier-plugin-astro formats for the same rules).
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
  fonts: [
    {
      name: 'Google Sans Flex',
      cssVariable: '--font-google-sans-flex',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'IBM Plex Mono',
      cssVariable: '--font-ibm-plex-mono',
      provider: fontProviders.fontsource(),
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
