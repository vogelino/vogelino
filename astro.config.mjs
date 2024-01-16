import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'

export default defineConfig({
	integrations: [tailwind(), mdx(), sitemap()],
	prefetch: true,
	site: `https://vogelino.com`,
})
