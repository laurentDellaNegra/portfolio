// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), react()],
  site: 'https://ldellanegra.com',
  trailingSlash: "never",
  build: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
    format: 'file'
  }
});