import { inspirationSchema } from '../../src/schemas/inspirations'
import type { RawNotionInspirationLinkType } from './getOriginalNotionInspirations'

export interface MappedNotionInspirationLinkType extends Record<string, unknown> {
	id: string
	title: string
	url: string
	date: string
}

function mapNotionInspirationLink(
	rawLink: RawNotionInspirationLinkType
): MappedNotionInspirationLinkType {
	const { Name, URL, Date: inspirationDate } = rawLink.properties

	const inspiration = {
		id: rawLink.id,
		title: Name.title.map((item) => item.plain_text).join(''),
		url: URL.url,
		date: inspirationDate.created_time,
	}
	const validation = inspirationSchema.safeParse(inspiration)
	if (!validation.success) {
		const val = validation as unknown as { error: { message: string } }
		const error = val.error.message as string
		console.log(
			`Error parsing inspiration ${inspiration.id}: ${error}`,
			JSON.stringify(inspiration, null, 2)
		)
	}
	return inspiration
}

export async function parseOriginalNotionInspirations(
	originalInspirations: RawNotionInspirationLinkType[]
): Promise<MappedNotionInspirationLinkType[]> {
	return originalInspirations.map(mapNotionInspirationLink)
}
