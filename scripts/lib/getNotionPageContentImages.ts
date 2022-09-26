import type { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "./notion";

interface PageContentImageType {
  name: string;
  url: string;
}

export async function getNotionPageContentImages(
  pageId: string
): Promise<PageContentImageType[]> {
  const blocksResponse = await notion.blocks.children.list({
    block_id: pageId,
  });

  const blocks =
    blocksResponse.results as unknown as ImageBlockObjectResponse[];
  return blocks.reduce((acc, block) => {
    const image = block.image as {
      external?: { url: string };
      file?: { url: string };
      caption: {
        text: {
          content: string;
        };
      }[];
    };
    const img = image?.external || image?.file;
    const item = { name: block.id, url: img?.url } as PageContentImageType;
    if (img?.url) return [...acc, item];
    return acc;
  }, [] as PageContentImageType[]);
}
