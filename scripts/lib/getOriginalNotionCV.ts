import type { Client } from "@notionhq/client";
import {
  NotionRichTextType,
  NotionTitleType,
} from "./getOriginalNotionProjects";

export interface RawNotionCVType extends Record<string, unknown> {
  id: string;
  properties: {
    title: NotionTitleType;
    timePeriod: NotionRichTextType;
    location: NotionRichTextType;
    certification: NotionRichTextType;
    category: {
      select: {
        name: string;
      };
    };
  };
}

export async function getOriginalNotionCV(
  databaseId: string,
  notion: Client
): Promise<RawNotionCVType[]> {
  const notionResponse = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "title",
          title: {
            is_not_empty: true,
          },
        },
        {
          property: "timePeriod",
          rich_text: {
            is_not_empty: true,
          },
        },
        {
          property: "location",
          rich_text: {
            is_not_empty: true,
          },
        },
      ],
    },
  });
  const notionCV = notionResponse.results as unknown as RawNotionCVType[];

  return notionCV;
}
