import type { Client } from '@notionhq/client'
import type {
	BlockObjectResponse,
	ImageBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

export interface NotionImageType {
	type: string
	name: string
	external?: {
		url: string
	}
	file?: {
		url: string
		expiry_time: string
	}
}

export interface NotionFilesType {
	files: NotionImageType[]
}

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
	nextCursor?: string
): Promise<RawNotionInspirationLinkType[]> {
	const response = await notion.databases.query({
		database_id: databaseId,
		page_size: 100,
		start_cursor: nextCursor,
	})

	const inspirations = response.results as unknown as RawNotionInspirationLinkType[]

	const linksImageRequests = inspirations.map(async (inspiration) => {
		const blocksResponse = await notion.blocks.children.list({
			block_id: inspiration.id,
		})

		const blocks = blocksResponse.results as unknown as BlockObjectResponse[]
		const imageBlock = blocks.filter((block) => block.type === 'image')[0]

		return [inspiration.id, imageBlock]
	})

	const linksImages = (await Promise.all(linksImageRequests)) as unknown as [
		string,
		ImageBlockObjectResponse,
	][]

	const imagerlsMap = linksImages
		.filter(([pageId, imageBlock]) => pageId && imageBlock)
		.reduce(
			(acc, [pageId, imageBlock]) => {
				acc[pageId] =
					imageBlock.image.type === 'external'
						? imageBlock.image.external.url
						: imageBlock.image.file.url
				return acc
			},
			{} as Record<string, string>
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
		const nextPage = await getOriginalNotionInspirations(databaseId, notion, response.next_cursor)
		return [...inspirationsWithImages, ...nextPage]
	}

	return inspirationsWithImages
}
