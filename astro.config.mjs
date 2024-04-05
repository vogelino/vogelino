import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import critters from '@playform/inline'
import { defineConfig } from 'astro/config'

export default defineConfig({
	integrations: [tailwind(), mdx(), sitemap(), critters()],
	prefetch: true,
	site: `https://vogelino.com`,
})
