import type {
	BlockObjectResponse,
	ImageBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { notion } from './notion'

const IPP = 100

export async function getAllNotionInspirationImages(
	databaseId: string,
	onlyExternal = true,
	nextCursor?: string,
): Promise<[string, string][]> {
	const response = await notion.databases.query({
		database_id: databaseId,
		page_size: IPP,
		start_cursor: nextCursor,
	})

	const linksImageRequests = response.results.map(async (page) => {
		const blocksResponse = await notion.blocks.children.list({
			block_id: page.id,
		})

		const blocks = blocksResponse.results as unknown as BlockObjectResponse[]
		const imageBlock = blocks.filter((block) => block.type === 'image')[0]

		return [page.id, imageBlock]
	})

	let linksImages = (await Promise.all(linksImageRequests)) as unknown as [
		string,
		ImageBlockObjectResponse,
	][]
	if (onlyExternal) {
		linksImages = linksImages.filter(
			([_pageId, imageBlock]) =>
				imageBlock && imageBlock.image.type === 'external',
		)
	}

	const onlyImageUrls = linksImages
		.filter(([pageId, imageBlock]) => pageId && imageBlock)
		.map(
			([pageId, imageBlock]) =>
				[
					pageId,
					imageBlock.image.type === 'external'
						? imageBlock.image.external.url
						: imageBlock.image.file.url,
				] as [string, string],
		)

	if (response.next_cursor && response.has_more) {
		const nextPage = await getAllNotionInspirationImages(
			databaseId,
			onlyExternal,
			response.next_cursor,
		)
		return [...onlyImageUrls, ...nextPage]
	}

	return onlyImageUrls
}
