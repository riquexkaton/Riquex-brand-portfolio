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
  // Hash-based CSP in a <meta> tag: Astro hashes every script and <style> it emits.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "require-trusted-types-for 'script'",
      ],
      styleDirective: {
        // Every stylesheet is inlined (and hashed), so style-src needs no source. Split-text staggers read
        // `style="--i:N"`, so inline style attributes stay allowed (style-src-attr).
        resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
  // No Markdown here; the default Shiki highlighter emits inline styles CSP would block.
  markdown: { syntaxHighlight: false },
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
