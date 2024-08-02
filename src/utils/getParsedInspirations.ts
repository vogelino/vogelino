import { ZodError } from 'zod'
import { loadJson } from '../../scripts/lib/loadJson'
import { INSPIRATIONS_JSON_PATH } from '../../scripts/paths'
import { type InspirationType, inspirationSchema } from '../schemas/inspirations'
import { getInspirationImages } from './imageUtil'

export async function getParsedInspirations(): Promise<InspirationType[]> {
	const rawInspirations = await loadJson<InspirationType[]>(INSPIRATIONS_JSON_PATH)
	const parsedInspirations = rawInspirations.reduce((acc, inspiration) => {
		const { thumbnail, favicon } = getInspirationImages(inspiration.id)
		const newInspiration = { ...inspiration, thumbnail, favicon }
		try {
			const newParsedInspiration = inspirationSchema.parse(newInspiration)
			acc.push(newParsedInspiration)
			return acc
		} catch (error) {
			if (error instanceof ZodError) {
				logZodErrorToTerminal(error, newInspiration)
			} else {
				console.log(error)
			}
			return acc
		}
	}, [] as InspirationType[])

	return parsedInspirations
}

function logZodErrorToTerminal(error: ZodError, newInspiration: Record<string, unknown>) {
	const name =
		typeof newInspiration === 'object' &&
		newInspiration !== null &&
		('title' in newInspiration || 'id' in newInspiration)
			? newInspiration.title || newInspiration.id
			: 'Unknown Inspiration'
	console.log('\n\n––––––––––––––––––––––––––')
	console.log(`Cool Site Parsing Error for "${name}":`)
	for (const issue of error.issues) {
		const formattedIssueMessage = ` - ${issue.path.join('.')}: ${issue.message}`
		console.log(formattedIssueMessage)
	}
	console.log('––––––––––––––––––––––––––\n\n')
}
