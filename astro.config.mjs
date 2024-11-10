// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), react(), sitemap()],
  site: 'https://ldellanegra.com',
  trailingSlash: "never",
  build: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
    format: 'file'
  }
});