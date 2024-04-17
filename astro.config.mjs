import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import critters from '@playform/inline'
import sentry from '@sentry/astro'
import { defineConfig } from 'astro/config'

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
	],
	telemetry: false,
	prefetch: true,
	site: `https://vogelino.com`,
})
