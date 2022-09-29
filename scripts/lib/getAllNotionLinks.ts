import * as dotenv from "dotenv";
dotenv.config();
import { notion } from "./notion";

const IPP = 100;

const databaseId = process.env.NOTION_INSPIRATION_DATABASE_ID || "";

export async function getAllNotionInspirations(
  nextCursor?: string
): Promise<string[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: IPP,
    start_cursor: nextCursor,
  });
  const existingUrls = response.results.map((result) => {
    // @ts-ignore
    return result.properties.URL.url;
  });

  if (response.has_more && response.next_cursor) {
    const nextPage = await getAllNotionInspirations(response.next_cursor);
    return [...existingUrls, ...nextPage];
  }
  return existingUrls;
}
