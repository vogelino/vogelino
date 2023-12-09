import type { Client } from '@notionhq/client'
import type {
	NotionImageType,
	NotionRichTextType,
	NotionTitleType,
} from './getOriginalNotionProjects'

export interface RawNotionTechnologyType extends Record<string, unknown> {
	id: string
	properties: {
		URL: {
			url: null | string
		}
		Name: NotionTitleType
		Description: NotionRichTextType
		Categories: {
			multi_select: {
				name: string
			}[]
		}
	}
	icon: null | { file?: { url?: string } }
}

export async function getOriginalNotionTechnologies(
	databaseId: string,
	notion: Client,
	nextCursor?: string,
): Promise<RawNotionTechnologyType[]> {
	const response = await notion.databases.query({
		database_id: databaseId,
		page_size: 100,
		start_cursor: nextCursor,
	})

	const technologies = response.results as unknown as RawNotionTechnologyType[]
	if (response.next_cursor && response.has_more) {
		const nextPage = await getOriginalNotionTechnologies(
			databaseId,
			notion,
			response.next_cursor,
		)
		return [...technologies, ...nextPage]
	}

	return technologies
}
