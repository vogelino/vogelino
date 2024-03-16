import * as dotenv from 'dotenv'
dotenv.config()
import { notion } from './lib/notion'
import { createDirectoriesIfNotAlreadyThere } from './lib/createDirectoriesIfNotAlreadyThere'
import { getOriginalNotionInspirations } from './lib/getOriginalNotionInspirations'
import { parseOriginalNotionInspirations } from './lib/parseOriginalNotionInspirations'
import { INSPIRATIONS_JSON_PATH } from './paths'
import { writeJsonFile } from './lib/writeJsonFile'
import { logEnd, logH1, logIndented, logSecondary } from './lib/logUtil'
import { downloadNotionInspirationImages } from './downloadNotionInspirationImages'

const inspirationsDatabaseId = process.env.NOTION_INSPIRATION_DATABASE_ID || ''

async function downloadInspirations() {
	logH1(`Downloading inspirations from Notion`)
	const originalInspirations = await getOriginalNotionInspirations(
		inspirationsDatabaseId,
		notion,
	)

	await createDirectoriesIfNotAlreadyThere('data')

	logSecondary([`🧹 Parsing raw inspirations`])
	const inspirations =
		await parseOriginalNotionInspirations(originalInspirations)
	logIndented(`✅ Successfully parsed raw inspirations`)

	logSecondary([`💾 Saving ${inspirations.length} parsed inspirations`])
	await Promise.all([writeJsonFile(INSPIRATIONS_JSON_PATH, inspirations)])
	logIndented(`🛟 Saved ${inspirations.length} parsed inspirations ✔️`)
	logIndented(INSPIRATIONS_JSON_PATH, 1)

	logEnd()

	await downloadNotionInspirationImages({
		rawInspirations: originalInspirations,
		mappedInspirations: inspirations,
	})
	process.exit()
}

void downloadInspirations()
