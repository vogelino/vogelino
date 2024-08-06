import { ZodError } from 'zod'
import { loadJson } from '../../scripts/lib/loadJson'
import { COOL_SITES_JSON_PATH } from '../../scripts/paths'
import { type CoolSiteType, coolSiteSchema } from '../schemas/coolSites'
import { getCoolSiteImages } from './imageUtil'

export async function getParsedCoolSites(): Promise<CoolSiteType[]> {
	const rawCoolSites = await loadJson<CoolSiteType[]>(COOL_SITES_JSON_PATH)
	const parsedCoolSites = rawCoolSites.reduce((acc, coolSite) => {
		const { thumbnail, favicon } = getCoolSiteImages(coolSite.id)
		const newCoolSite = { ...coolSite, thumbnail, favicon }
		try {
			const newParsedCoolSite = coolSiteSchema.parse(newCoolSite)
			acc.push(newParsedCoolSite)
			return acc
		} catch (error) {
			if (error instanceof ZodError) {
				logZodErrorToTerminal(error, newCoolSite)
			} else {
				console.log(error)
			}
			return acc
		}
	}, [] as CoolSiteType[])

	return parsedCoolSites
}

function logZodErrorToTerminal(error: ZodError, newCoolSite: Record<string, unknown>) {
	const name =
		typeof newCoolSite === 'object' &&
		newCoolSite !== null &&
		('title' in newCoolSite || 'id' in newCoolSite)
			? newCoolSite.title || newCoolSite.id
			: 'Unknown CoolSite'
	console.log('\n\n––––––––––––––––––––––––––')
	console.log(`Cool Site Parsing Error for "${name}":`)
	for (const issue of error.issues) {
		const formattedIssueMessage = ` - ${issue.path.join('.')}: ${issue.message}`
		console.log(formattedIssueMessage)
	}
	console.log('––––––––––––––––––––––––––\n\n')
}
