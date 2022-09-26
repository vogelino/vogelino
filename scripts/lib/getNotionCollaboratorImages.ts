import type { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const IPP = 100;

export async function getNotionCollaboratorImages(
  databaseId: string,
  notion: Client,
  nextCursor?: string
): Promise<[string, string][]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: IPP,
    start_cursor: nextCursor,
  });

  const results = response.results as PageObjectResponse[];

  const onlyImageUrls = results
    .map(({ id, icon }) => {
      if (icon?.type === "external") return [id, icon.external.url];
      if (icon?.type === "file") return [id, icon.file.url];
    })
    .filter(Boolean) as [string, string][];

  if (response.next_cursor && response.has_more) {
    const nextPage = await getNotionCollaboratorImages(
      databaseId,
      notion,
      response.next_cursor
    );
    return [...onlyImageUrls, ...nextPage];
  }

  return onlyImageUrls;
}
