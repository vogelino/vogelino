import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import critters from '@playform/inline'
import sentry from '@sentry/astro'
import { defineConfig } from 'astro/config'

import solidJs from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		mdx(),
		sitemap(),
		critters(),
		sentry({
			dsn: process.env.SENTRY_DSN,
			sourceMapsUploadOptions: {
				project: 'vogelino-portfolio',
				authToken: process.env.SENTRY_AUTH_TOKEN,
			},
		}),
		solidJs(),
	],
	prefetch: true,
	site: process.env.NODE_ENV === 'development' ? 'http://localhost:4321' : 'https://vogelino.com',
})
