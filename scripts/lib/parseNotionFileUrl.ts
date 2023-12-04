import { NotionDatabaseFilesType } from 'notion-api-zod-schema'

export function parseNotionFileUrl(file?: NotionDatabaseFilesType) {
	const firstFile = file?.files[0]
	if (!firstFile) return ''
	return firstFile.type === 'external'
		? firstFile.external.url
		: firstFile.file.url
}
