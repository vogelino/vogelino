import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import prefetch from "@astrojs/prefetch";
import sitemap from '@astrojs/sitemap';
import { astroImageTools } from "astro-imagetools";
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), prefetch(), sitemap(), astroImageTools],
  adapter: vercel({
    analytics: true
  }),
});
