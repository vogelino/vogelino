import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import prefetch from '@astrojs/prefetch'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
	integrations: [tailwind(), prefetch(), sitemap()],
	site: `https://vogelino22.vercel.app`,
})
