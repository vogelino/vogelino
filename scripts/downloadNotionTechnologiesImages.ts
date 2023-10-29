import * as dotenv from 'dotenv'
dotenv.config()
import { doesFileExists } from './lib/doesFileExist'
import { downloadImage } from './lib/downloadImage'
import { log, logEnd, logH1, logIndented, logSecondary } from './lib/logUtil'
import { resizeImage } from './lib/resizeImage'
import fs from 'node:fs/promises'
import {
	TECHOLOGIES_EXPORT_PATH,
	IMAGE_TMP_EXPORT_PATH,
	ORIGINAL_TECHNOLOGIES_JSON_PATH,
} from './paths'
import { createDirectoriesIfNotAlreadyThere } from './lib/createDirectoriesIfNotAlreadyThere'
import { loadJson } from './lib/loadJson'
import { RawNotionTechnologyType } from './lib/getOriginalNotionTechnologies'
import slugify from 'slugify'

const databaseId = process.env.NOTION_TECHNOLOGIES_DATABASE_ID || ''

async function downloadNotionTechnologiesImages() {
	logH1(`Downloading all technologies logos from Notion`)

	log(`databaseId: ${databaseId}`)
	const technologies = await loadJson<RawNotionTechnologyType[]>(
		ORIGINAL_TECHNOLOGIES_JSON_PATH,
	)

	for (const tech of technologies) {
		const techName = tech.properties.Name.title
			.map((title) => title.plain_text)
			.join(' ')
		const techSlug = slugify(techName, { lower: true })
		const url = tech.icon?.file?.url || ''
		logSecondary([`Downloading technology logo for "${techName}"`])
		logIndented(`🔧 ${url.slice(0, 50)}...`)

		// MAKE SURE DIRECTORIES EXIST
		await createDirectoriesIfNotAlreadyThere(IMAGE_TMP_EXPORT_PATH)
		await createDirectoriesIfNotAlreadyThere(TECHOLOGIES_EXPORT_PATH)

		// CHECK FOR EXISTING DESTINATION FILE
		const thumbResizeDest = `${TECHOLOGIES_EXPORT_PATH}/${techSlug}.svg`
		const destThumbFileAlreadyExist = await doesFileExists(thumbResizeDest)

		if (destThumbFileAlreadyExist) {
			logIndented(`⏭ Skipping (already exists)`)
		} else {
			// DOWNLOAD
			const { data } = await downloadImage(url)
			const svgPath = `${TECHOLOGIES_EXPORT_PATH}/${techSlug}.svg`
			logIndented(`💾 Saving file into: ${svgPath}`)
			await fs.writeFile(svgPath, data)
			logIndented(`🛟 Saved ✔️`)
		}
	}

	logEnd()
	process.exit()
}

downloadNotionTechnologiesImages()
