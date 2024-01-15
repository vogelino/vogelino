import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import prefetch from '@astrojs/prefetch'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'

export default defineConfig({
	integrations: [tailwind(), mdx(), prefetch(), sitemap()],
	site: `https://vogelino22.vercel.app`,
})
