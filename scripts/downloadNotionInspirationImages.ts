import * as dotenv from 'dotenv'
import { doesFileExists } from './lib/doesFileExist'
import type { RawNotionInspirationLinkType } from './lib/getOriginalNotionInspirations'
import { logEnd, logH1, logIndented, logSecondary } from './lib/logUtil'
import { parseNotionFileUrl } from './lib/parseNotionFileUrl'
import type { MappedNotionInspirationLinkType } from './lib/parseOriginalNotionInspirations'
import { saveAndResizeImage } from './lib/saveAndResizeImage'
import { INSPIRATION_RESIZED_EXPORT_PATH } from './paths'
dotenv.config()

const WIDTH = 560
const HEIGHT = 292

export async function downloadNotionInspirationImages({
	rawInspirations,
	mappedInspirations,
}: {
	rawInspirations: RawNotionInspirationLinkType[]
	mappedInspirations: MappedNotionInspirationLinkType[]
}) {
	logH1('Downloading all images from Notion')

	const images = rawInspirations.reduce((acc, rawInspiration) => {
		if (!rawInspiration.cover) {
			return acc
		}
		acc.push([rawInspiration.id, parseNotionFileUrl({ files: [rawInspiration.cover] })])
		return acc
	}, [] as string[][])

	for (const [pageId, url] of images) {
		logSecondary([`Downloading image "${pageId}"`])
		logIndented(`🔗 ${url.slice(0, 50)}...`)

		await saveAndResizeImage({
			fileName: `${pageId}.webp`,
			folder: 'inspirations',
			fileUrl: url,
			resize: {
				width: WIDTH,
				height: HEIGHT,
				position: 'top',
			},
		})
	}

	// VERIFYING ALL IMAGES ARE REALLY DOWNLOADED
	for (const inspiration of mappedInspirations) {
		const filePath = `${INSPIRATION_RESIZED_EXPORT_PATH}/${inspiration.id}.webp`
		const fileExists = await doesFileExists(filePath)
		if (!fileExists) {
			logSecondary([`⛔️ Missing file found for inspiration "${inspiration.title}"!`])
			logIndented(filePath)
		}
	}

	logEnd()
	process.exit()
}
