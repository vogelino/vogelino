import type { APIContext } from 'astro'
import { createRSSFeed } from '../utils/rssUtil'

export async function GET(context: APIContext) {
	return createRSSFeed(context, {
		showInspirations: true,
		showProjects: false,
		showPages: false,
		title: "Vogelino – Lucas Vogel's portfolio inspirations",
		description:
			'RSS feed of the interface design and development portfolio of Lucas Vogel. This RSS feed only includes the inspirations.',
	})
}
