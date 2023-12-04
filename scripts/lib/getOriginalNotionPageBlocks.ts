import { z } from 'zod'
import { NotionBlockSchema, NotionBlockType } from 'notion-api-zod-schema'
import type { Client } from '@notionhq/client'

export const getOriginalNotionPageBlocks = async (
	pageId: string,
	notion: Client,
): Promise<NotionBlockType[]> => {
	const blocksResponse = await notion.blocks.children.list({
		block_id: pageId,
	})

	const blocks = blocksResponse.results
	return z.array(NotionBlockSchema).parse(blocks)
}
