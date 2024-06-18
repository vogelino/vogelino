import { loadJson } from '../../scripts/lib/loadJson'
import { INSPIRATIONS_JSON_PATH } from '../../scripts/paths'
import { type InspirationType, inspirationSchema } from '../schemas/inspirations'
import { getInspirationImages } from './imageUtil'

export async function getParsedInspirations(): Promise<InspirationType[]> {
	const rawInspirations = await loadJson<InspirationType[]>(INSPIRATIONS_JSON_PATH)
	const parsedInspirations = rawInspirations.reduce((acc, inspiration) => {
		const { thumbnail, favicon } = getInspirationImages(inspiration.id)
		try {
			acc.push(inspirationSchema.parse({ ...inspiration, thumbnail, favicon }))
			return acc
		} catch (error) {
			console.log('Error parsing inspiration:', JSON.stringify(inspiration, null, 2))
			console.log(error)
			return acc
		}
	}, [] as InspirationType[])

	return parsedInspirations
}
