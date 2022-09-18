import slugify from "slugify";
import { notion } from "./notion";

interface NotionImageType {
  files: {
    external?: {
      url: string;
    };
    file?: {
      url: string;
    };
  }[];
}

interface NotionRichTextType {
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

interface RawNotionProjectType {
  properties: {
    Name: {
      title: {
        type: "text";
        plain_text: string;
      }[];
    };
    Description: NotionRichTextType;
    NameShort: NotionRichTextType;
    Thumbnail: NotionImageType;
    BgImage: NotionImageType;
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
  };
}

const parseNotionProject = (
  rawProject: RawNotionProjectType
): MappedNotionProject => {
  const { Name, NameShort, Description, Thumbnail, BgImage, Type, Year, URL } =
    rawProject.properties;

  const thumbnail =
    Thumbnail.files[0].external?.url || Thumbnail.files[0].file?.url || "";
  const bgImage =
    BgImage.files[0].external?.url || BgImage.files[0].file?.url || "";
  const type = Type.select.name;
  const fullTitle = Name.title.map(({ plain_text }) => plain_text).join("");
  const description = Description.rich_text.map(
    ({ text, annotations, href }) => ({
      text: text.content,
      link: href,
      highlighted: annotations.bold,
    })
  );
  const nameShort = NameShort.rich_text
    .map(({ text }) => text?.content)
    .join(" ");
  return {
    title: fullTitle,
    nameShort,
    description,
    type,
    slug: slugify(fullTitle),
    thumbnail,
    bgImage,
    year: Year.number,
    url: URL.url,
  };
};

export interface MappedNotionProject {
  title: string;
  nameShort: null | string;
  description: {
    text: null | string;
    link: null | string;
    highlighted: boolean;
  }[];
  type: string;
  slug: string;
  thumbnail: string;
  bgImage: string;
  year: number;
  url: null | string;
}

export const getNotionProjects = async (): Promise<MappedNotionProject[]> => {
  const notionResponse = await notion.databases.query({
    database_id: import.meta.env.NOTION_PORTFOLIO_DATABASE_ID,
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

  return notionProjects.map(parseNotionProject).sort((a, b) => b.year - a.year);
};
