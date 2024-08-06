import type { APIRoute } from 'astro'
import { getParsedCoolSites } from '../../../utils/getParsedCoolSites'

export const GET: APIRoute = async ({ site }) => {
	const coolSites = await getParsedCoolSites()

	if (!site)
		return new Response('Site property in context is not defined', {
			status: 500,
		})

	return new Response(
		JSON.stringify(
			coolSites.map((i) => ({
				...i,
				thumbnail: formatUrl(site, i.thumbnail?.src),
				favicon: formatUrl(site, i.favicon?.src),
			}))
		),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
}

function formatUrl(site: URL, path?: string) {
	if (!path) return null
	const url = new URL(path, site)
	return url.toString()
}
