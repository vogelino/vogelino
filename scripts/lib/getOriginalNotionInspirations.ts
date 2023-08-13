import { OriginalInspirationLinkSchema } from './../schemas/inspirationSchema'
import type { Client } from '@notionhq/client'
import {
	BlockObjectResponse,
	ImageBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { NotionImageType } from './getOriginalNotionProjects'
import { z } from 'zod'
import { NotionBlockSchema } from '../schemas/notionSchema'

export interface RawNotionInspirationLinkType extends Record<string, unknown> {
	id: string
	cover: NotionImageType
	icon:
		| null
		| NotionImageType
		| {
				type: 'emoji'
				emoji: string
		  }
	properties: {
		Name: {
			title: {
				type: 'text'
				plain_text: string
			}[]
		}
		URL: {
			url: string
		}
	}
	children: {
		type: 'image'
		image: NotionImageType
	}[]
}

export async function getOriginalNotionInspirations(
	databaseId: string,
	notion: Client,
	nextCursor?: string,
): Promise<RawNotionInspirationLinkType[]> {
	const response = await notion.databases.query({
		database_id: databaseId,
		page_size: 100,
		start_cursor: nextCursor,
	})

	const inspirations = z
		.array(OriginalInspirationLinkSchema)
		.parse(response.results)

	const linksImageRequests = inspirations.map(async (inspiration) => {
		const blocksResponse = await notion.blocks.children.list({
			block_id: inspiration.id,
		})

		const blocks = z.array(NotionBlockSchema).parse(blocksResponse.results)
		const imageBlock = blocks.filter((block) => block.type === 'image')[0]

		return [inspiration.id, imageBlock]
	})

	let linksImages = (await Promise.all(linksImageRequests)) as unknown as [
		string,
		ImageBlockObjectResponse,
	][]

	const imagerlsMap = linksImages
		.filter(([pageId, imageBlock]) => pageId && imageBlock)
		.reduce(
			(acc, [pageId, imageBlock]) => ({
				...acc,
				[pageId]:
					imageBlock.image.type === 'external'
						? imageBlock.image.external.url
						: imageBlock.image.file.url,
			}),
			{} as Record<string, string>,
		)

	const inspirationsWithImages = inspirations.map((inspiration) => ({
		...inspiration,
		cover: {
			type: 'external',
			external: {
				url: imagerlsMap[inspiration.id] || '',
			},
		} as NotionImageType,
	}))

	if (response.next_cursor && response.has_more) {
		const nextPage = await getOriginalNotionInspirations(
			databaseId,
			notion,
			response.next_cursor,
		)
		return [...inspirationsWithImages, ...nextPage]
	}

	return inspirationsWithImages
}
