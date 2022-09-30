import type { Client } from "@notionhq/client";

export interface NotionImageType {
  type: string;
  external?: {
    url: string;
  };
  file?: {
    url: string;
  };
}

export interface NotionFilesType {
  files: NotionImageType[];
}

export interface NotionRichTextType {
  rich_text: {
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
  }[];
}

export interface NotionRelationType {
  id: string;
  type: "relation";
  relation: { id: string }[];
}

export interface NotionTitleType {
  title: {
    type: "text";
    plain_text: string;
  }[];
}

export interface RawNotionProjectType extends Record<string, unknown> {
  id: string;
  properties: {
    Name: NotionTitleType;
    Description: NotionRichTextType;
    NameShort: NotionRichTextType;
    Thumbnail: NotionFilesType;
    BgImage: NotionFilesType;
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
  };
}

export async function getOriginalNotionProjects(
  databaseId: string,
  notion: Client
): Promise<RawNotionProjectType[]> {
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
          property: "Thumbnail",
          files: {
            is_not_empty: true,
          },
        },
      ],
    },
  });
  const notionProjects =
    notionResponse.results as unknown as RawNotionProjectType[];
  return notionProjects;
}
