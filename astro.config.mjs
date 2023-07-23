import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import { astroImageTools } from "astro-imagetools";

/**
 * @type {import('astro-imagetools').GlobalConfigOptions}
 */
export default defineConfig({
  integrations: [tailwind(), prefetch(), sitemap(), astroImageTools],
});
