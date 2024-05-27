import type { APIContext } from 'astro'
import { createRSSFeed } from '../utils/rssUtil'

export async function GET(context: APIContext) {
	return createRSSFeed(context, {
		showInspirations: true,
		showProjects: true,
		showPages: true,
	})
}
