import type { Client } from "@notionhq/client";
import type {
  NotionFilesType,
  NotionTitleType,
} from "./getOriginalNotionProjects";

export interface RawNotionCollaboratorType extends Record<string, unknown> {
  id: string;
  properties: {
    URL: {
      url: null | string;
    };
    Avatar: NotionFilesType;
    Name: NotionTitleType;
  };
}

export async function getOriginalNotionCollaborators(
  databaseId: string,
  notion: Client,
  nextCursor?: string
): Promise<RawNotionCollaboratorType[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 100,
    start_cursor: nextCursor,
  });

  const inspirations =
    response.results as unknown as RawNotionCollaboratorType[];
  if (response.next_cursor && response.has_more) {
    const nextPage = await getOriginalNotionCollaborators(
      databaseId,
      notion,
      response.next_cursor
    );
    return [...inspirations, ...nextPage];
  }

  return inspirations;
}
