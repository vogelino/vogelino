import type { Client } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getOriginalNotionPageBlocks } from "./getOriginalNotionPageBlocks";

export interface NotionImageType {
  type: string;
  name: string;
  external?: {
    url: string;
  };
  file?: {
    url: string;
    expiry_time: string;
  };
}

export interface NotionFilesType {
  files: NotionImageType[];
}

export interface NotionTextType {
  type: "text";
  text: { content: string | null; link: null | string };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
  };
  plain_text: string;
  href: null | string;
}

export interface NotionRichTextType {
  rich_text: NotionTextType[];
}

export interface NotionRelationType {
  id: string;
  type: "relation";
  relation: { id: string }[];
}

export interface NotionTitleType {
  title: NotionTextType[];
}

export interface RawNotionProjectType extends Record<string, unknown> {
  id: string;
  properties: {
    Name: NotionTitleType;
    Description: NotionRichTextType;
    NameShort: NotionRichTextType;
    Thumbnail: NotionFilesType;
    Illustration: NotionFilesType;
    BgImage: NotionFilesType;
    Media: NotionFilesType;
    Year: {
      number: number;
    };
    Type: {
      select: {
        name: string;
      };
    };
    URL: {
      url: null | string;
    };
    "In collaboration with": NotionRelationType;
    "Supervised by": NotionRelationType;
    "Made With": NotionRelationType;
    "Made @": NotionRelationType;
    "Show in portfolio": {
      checkbox: boolean;
    };
    "Highlight in portfolio": {
      checkbox: boolean;
    };
  };
}

export interface RawNotionProjectWithBlocksType extends RawNotionProjectType {
  properties: RawNotionProjectType["properties"] & {
    blocks: BlockObjectResponse[];
  };
}

export async function getOriginalNotionProjects(
  databaseId: string,
  notion: Client
): Promise<RawNotionProjectWithBlocksType[]> {
  const notionResponse = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Show in portfolio",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Illustration",
          files: {
            is_not_empty: true,
          },
        },
        {
          property: "Thumbnail",
          files: {
            is_not_empty: true,
          },
        },
        {
          property: "Media",
          files: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Year",
        direction: "descending",
      },
    ],
  });
  const notionProjects =
    notionResponse.results as unknown as RawNotionProjectWithBlocksType[];

  for (const notionProjectIdx in notionProjects) {
    let project = notionProjects[notionProjectIdx];

    const blocks = await getOriginalNotionPageBlocks(project.id, notion);
    project.properties.blocks = blocks;
    notionProjects[notionProjectIdx] = project;
  }
  return notionProjects;
}
