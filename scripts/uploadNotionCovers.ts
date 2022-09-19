import type { UpdatePageResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "./lib/notion";
import { getAllNotionInspirationImages } from "./lib/getAllNotionInspirationImages";
import { logEnd, logH1 } from "./lib/logUtil";

async function addImageToPage([pageId, imageUrl]: [
  string,
  string
]): Promise<UpdatePageResponse> {
  return notion.pages.update({
    page_id: pageId,
    cover: {
      external: {
        url: imageUrl,
      },
    },
  });
}

const databaseId = process.env.NOTION_INSPIRATION_DATABASE_ID || "";

async function uploadNotionCovers(): Promise<void> {
  const notionImages = await getAllNotionInspirationImages(databaseId, false);

  logH1(`Uploading ${notionImages.length} external image covers to Notion`);

  const updates = notionImages.map(addImageToPage);
  await Promise.all(updates);

  logH1(`Successfully uploaded ${notionImages.length} image covers to Notion`);

  logEnd();
  process.exit();
}

uploadNotionCovers();
