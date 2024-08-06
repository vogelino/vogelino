import type { APIContext } from 'astro'
import { createRSSFeed } from '../utils/rssUtil'

export async function GET(context: APIContext) {
	return createRSSFeed(context, {
		showCoolSites: false,
		showProjects: false,
		showPages: true,
		title: "Vogelino – Lucas Vogel's portfolio pages",
		description:
			'RSS feed of the interface design and development portfolio of Lucas Vogel. This RSS feed only includes the static pages.',
	})
}
