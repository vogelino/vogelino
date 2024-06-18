import type { APIRoute } from 'astro'
import { getParsedInspirations } from '../../../utils/getParsedInspirations'

export async function getStaticPaths() {
	const inspirations = await getParsedInspirations()
	return inspirations.map((i) => ({ params: { id: i.id } }))
}

export const GET: APIRoute = async ({ params, site }) => {
	const inspirations = await getParsedInspirations()
	const inspiration = inspirations.find((i) => i.id === params.id)

	if (!inspiration) return new Response('Not found', { status: 404 })
	if (!site)
		return new Response('Site property in context is not defined', {
			status: 500,
		})

	return new Response(
		JSON.stringify({
			...inspiration,
			thumbnail: formatUrl(site, inspiration.thumbnail?.src),
			favicon: formatUrl(site, inspiration.favicon?.src),
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
