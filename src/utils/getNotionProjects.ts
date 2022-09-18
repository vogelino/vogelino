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

interface RawNotionProjectType {
  properties: {
    Name: {
      title: {
        type: "text";
        plain_text: string;
      }[];
    };
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
  };
}

const parseNotionProject = (
  rawProject: RawNotionProjectType
): MappedNotionProject => {
  const { Name, Thumbnail, BgImage, Type, Year } = rawProject.properties;
  const thumbnail =
    Thumbnail.files[0].external?.url || Thumbnail.files[0].file?.url || "";
  const bgImage =
    BgImage.files[0].external?.url || BgImage.files[0].file?.url || "";
  const type = Type.select.name;
  const fullTitle = Name.title.map(({ plain_text }) => plain_text).join("");
  return {
    title: fullTitle,
    type,
    slug: slugify(fullTitle),
    thumbnail,
    bgImage,
    year: Year.number,
  };
};

export interface MappedNotionProject {
  title: string;
  type: string;
  slug: string;
  thumbnail: string;
  bgImage: string;
  year: number;
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
