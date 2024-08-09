import { ZodError } from 'zod'
import { loadJson } from '../../scripts/lib/loadJson'
import { MEDIA_SHELF_JSON_PATH } from '../../scripts/paths'
import { type MediaShelfType, mediaShelfSchema } from '../schemas/mediaShelf'
import { getMediaShelfImages } from './imageUtil'
import { logZodErrorToTerminal } from './logZodErrorToTerminal'

export async function getParsedMediaShelf(): Promise<MediaShelfType[]> {
	const rawMediaShelf = await loadJson<MediaShelfType[]>(MEDIA_SHELF_JSON_PATH)
	const parsedMediaShelf = rawMediaShelf.reduce((acc, mediaShelf) => {
		const thumbnail = getMediaShelfImages(mediaShelf.id)
		const newMediaSchelfItem = { ...mediaShelf, thumbnail }
		try {
			const newParsedCoolSite = mediaShelfSchema.parse(newMediaSchelfItem)
			acc.push(newParsedCoolSite)
			return acc
		} catch (error) {
			if (error instanceof ZodError) {
				logZodErrorToTerminal(error, newMediaSchelfItem)
			} else {
				console.log(error)
			}
			return acc
		}
	}, [] as MediaShelfType[])

	return parsedMediaShelf
}
