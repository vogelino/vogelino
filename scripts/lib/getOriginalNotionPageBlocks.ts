import { z } from 'zod'
import { NotionBlockSchema } from './../schemas/notionSchema'
import type { Client } from '@notionhq/client'
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export const getOriginalNotionPageBlocks = async (
	pageId: string,
	notion: Client,
): Promise<BlockObjectResponse[]> => {
	const blocksResponse = await notion.blocks.children.list({
		block_id: pageId,
	})

	const blocks = blocksResponse.results
	return z.array(NotionBlockSchema).parse(blocks)
}
