import { ZodError } from 'zod'
import rawMediaShelf from '../../src/assets/data/media-shelf.json'
import { type MediaShelfType, mediaShelfSchema } from '../schemas/mediaShelf'
import { getMediaShelfImages } from './imageUtil'
import { logZodErrorToTerminal } from './logZodErrorToTerminal'

export async function getParsedMediaShelf(): Promise<MediaShelfType[]> {
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
