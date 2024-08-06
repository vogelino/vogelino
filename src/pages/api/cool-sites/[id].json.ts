import type { APIRoute } from 'astro'
import { getParsedCoolSites } from '../../../utils/getParsedCoolSites'

export async function getStaticPaths() {
	const coolSites = await getParsedCoolSites()
	return coolSites.map((i) => ({ params: { id: i.id } }))
}

export const GET: APIRoute = async ({ params, site }) => {
	const coolSites = await getParsedCoolSites()
	const coolSite = coolSites.find((i) => i.id === params.id)

	if (!coolSite) return new Response('Not found', { status: 404 })
	if (!site)
		return new Response('Site property in context is not defined', {
			status: 500,
		})

	return new Response(
		JSON.stringify({
			...coolSite,
			thumbnail: formatUrl(site, coolSite.thumbnail?.src),
			favicon: formatUrl(site, coolSite.favicon?.src),
		}),
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
