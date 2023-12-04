import * as dotenv from 'dotenv'
dotenv.config()
import { doesFileExists } from './lib/doesFileExist'
import { downloadImage } from './lib/downloadImage'
import { log, logEnd, logH1, logIndented, logSecondary } from './lib/logUtil'
import { resizeImage } from './lib/resizeImage'
import fs from 'node:fs/promises'
import {
	COLLABORATORS_RESIZED_EXPORT_PATH,
	IMAGE_TMP_EXPORT_PATH,
	ORIGINAL_COLLABORATORS_JSON_PATH,
} from './paths'
import { createDirectoriesIfNotAlreadyThere } from './lib/createDirectoriesIfNotAlreadyThere'
import { loadJson } from './lib/loadJson'
import { parseNotionFileUrl } from './lib/parseNotionFileUrl'
import { z } from 'zod'
import { OriginalCollaboratorSchema } from './schemas/collaboratorSchema'

const WIDTH = 90
const HEIGHT = 90

const databaseId = process.env.NOTION_COLLABORATORS_DATABASE_ID || ''

async function downloadNotionCollaboratorsImages() {
	logH1(`Downloading all collaborator images from Notion`)

	log(`databaseId: ${databaseId}`)
	const collaborators = await loadJson(ORIGINAL_COLLABORATORS_JSON_PATH)
	const parsedCollaborators = z
		.array(OriginalCollaboratorSchema)
		.parse(collaborators)
	const images = parsedCollaborators.map((rawCollaborator) => [
		rawCollaborator.id,
		parseNotionFileUrl(rawCollaborator.properties.Avatar),
	])

	for (const [id, url] of images) {
		logSecondary([`Downloading collaborator image for page "${id}"`])
		logIndented(`🤡 ${url.slice(0, 50)}...`)

		// MAKE SURE DIRECTORIES EXIST
		await createDirectoriesIfNotAlreadyThere(IMAGE_TMP_EXPORT_PATH)
		await createDirectoriesIfNotAlreadyThere(COLLABORATORS_RESIZED_EXPORT_PATH)

		// CHECK FOR EXISTING DESTINATION FILE
		const thumbResizeDest = `${COLLABORATORS_RESIZED_EXPORT_PATH}/${id}.webp`
		const destThumbFileAlreadyExist = await doesFileExists(thumbResizeDest)

		if (destThumbFileAlreadyExist) {
			logIndented(`⏭ Skipping (already exists)`)
		} else {
			// DOWNLOAD
			const { imageExt, data } = await downloadImage(url)

			if (imageExt === 'svg') {
				const svgPath = `${COLLABORATORS_RESIZED_EXPORT_PATH}/${id}.svg`
				logIndented(`💾 Saving file into: ${svgPath}`)
				await fs.writeFile(svgPath, data)
				logIndented(`🛟 Saved ✔️`)
				continue
			}

			const originalPath = `${IMAGE_TMP_EXPORT_PATH}/${id}.${imageExt}`
			// SAVING LARGE FILE
			logIndented(`💾 Saving file into: ${originalPath}`)
			await fs.writeFile(originalPath, data)
			logIndented(`🛟 Saved ✔️`)

			// RESIZING FILE
			logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`)
			await resizeImage(originalPath, thumbResizeDest, {
				width: WIDTH,
				height: HEIGHT,
				position: 'center',
			})
			logIndented(`✅ Success!`, 1)
			await fs.unlink(originalPath)
		}
	}

	logEnd()
	process.exit()
}

downloadNotionCollaboratorsImages()
