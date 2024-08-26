import * as dotenv from 'dotenv'
import slugify from 'slugify'
import { z } from 'zod'
import { type CoolSiteType, coolSiteSchema } from '../src/schemas/coolSites'
import { getFaviconUrl } from '../src/utils/getFaviconUrl'
import { createDirectoriesIfNotAlreadyThere } from './lib/createDirectoriesIfNotAlreadyThere'
import { getWebsiteScreenshotUrl } from './lib/getWebsiteScreenshotUrl'
import { loadJson } from './lib/loadJson'
import { logEnd, logH1, logIndented, logSecondary } from './lib/logUtil'
import { saveAndResizeImage } from './lib/saveAndResizeImage'
import { writeJsonFile } from './lib/writeJsonFile'
import {
	COOL_SITES_JSON_PATH,
	COOL_SITE_FAVICON_EXPORT_PATH,
	COOL_SITE_RESIZED_EXPORT_PATH,
} from './paths'
dotenv.config()

const githubPayloadZodSchema = z.object({
	name: z.string(),
	url: z.string().url(),
	tags: z.string().array().default([]),
})
type GithubPayloadType = z.infer<typeof githubPayloadZodSchema>

async function downloadCoolparsedCoolSitess() {
	logH1('ADDING AN COOL_SITE VIA GITHUB REPOSITORY DISPATCH')

	logSecondary(['🚚🐙 Parsing the GitHub payload'])
	const githubPayload = getGithubPayloadUrl()

	logIndented(`✅ Payload parsed ✔️`)
	logIndented(JSON.stringify(githubPayload, null, 2))

	logSecondary([`💭🧐 Parsing the cool-site from the GitHub payload`])
	const parsedCoolSites = await parseGithubCoolparsedCoolSites(githubPayload)

	logSecondary(['👓📖 Loading existing cool-sites from the JSON file'])
	const existingCoolparsedCoolSitess = await loadJson(COOL_SITES_JSON_PATH)

	logSecondary([`💭🧐 Parsing the existing cool-sites from the JSON file`])
	const parsedCoolSitess = coolSiteSchema.array().parse(existingCoolparsedCoolSitess)

	logSecondary(['📁✅ Creating the folders for the downloaded cool-sites'])
	await createDirectoriesIfNotAlreadyThere('data')

	logSecondary([`💾💭 Saving the parsed cool-site along with the existing ones`])
	await writeJsonFile(COOL_SITES_JSON_PATH, [parsedCoolSites, ...parsedCoolSitess])
	logIndented(`🛟 Saved ${parsedCoolSitess.length} parsed cool-sites ✔️`)
	logIndented(COOL_SITES_JSON_PATH, 1)

	logEnd()

	process.exit()
}

void downloadCoolparsedCoolSitess()

function getGithubPayloadUrl() {
	const rawGithubPayload = JSON.parse(process.env.GITHUB_PAYLOAD || '{}')
	const githubPayload = githubPayloadZodSchema.safeParse(rawGithubPayload)

	if (!githubPayload.success) {
		const formattedZodError = githubPayload.error.issues
			.map((issue) => `${issue.path.join(' ')}: ${issue.message}`)
			.join(', ')
		throw new Error(
			`Payload validation error: ${formattedZodError}. Payload: ${JSON.stringify(rawGithubPayload)}`
		)
	}

	return githubPayload.data
}

async function parseGithubCoolparsedCoolSites(
	githubPayload: GithubPayloadType
): Promise<CoolSiteType> {
	const id = slugify(githubPayload.name, {
		lower: true,
		strict: true,
	})
	await saveFavicon(githubPayload.url, id)
	await saveThumbnail(githubPayload.url, id)
	return {
		title: githubPayload.name,
		tags: githubPayload.tags,
		url: githubPayload.url,
		id,
		date: new Date().toISOString(),
	}
}

async function saveThumbnail(url: string, id: string) {
	logIndented(`💾 Saving thumbnail for "${id}" (${url})`)
	const cloudinaryUrl = await getWebsiteScreenshotUrl(url)
	logIndented(`🌧️ Dowloading cloudinary thumbnail url: ${cloudinaryUrl}`)
	await saveAndResizeImage({
		fileName: `${id}.webp`,
		folder: `cool-sites`,
		fileUrl: cloudinaryUrl,
	})

	return `${COOL_SITE_RESIZED_EXPORT_PATH}/${id}.webp`
}

async function saveFavicon(url: string, id: string) {
	const size = 32
	logIndented(`💾 Saving favicon for "${id}" (${url})`)
	const domain = new URL(url).hostname
	try {
		await saveAndResizeImage({
			fileName: `${id}.webp`,
			folder: `cool-sites-favicons`,
			fileUrl: getFaviconUrl({ url, size }),
		})

		return `${COOL_SITE_FAVICON_EXPORT_PATH}/${id}.png`
	} catch (error) {
		logIndented(`💾 Failed to save favicon for "${id}" (${domain})`)
		return getFaviconUrl({ url, size })
	}
}
