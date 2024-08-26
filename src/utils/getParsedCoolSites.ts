import { ZodError } from 'zod'
import rawCoolSites from '../assets/data/cool-sites.json'
import { type CoolSiteType, coolSiteSchema } from '../schemas/coolSites'
import { getCoolSiteImages } from './imageUtil'
import { logZodErrorToTerminal } from './logZodErrorToTerminal'

export async function getParsedCoolSites(): Promise<CoolSiteType[]> {
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
