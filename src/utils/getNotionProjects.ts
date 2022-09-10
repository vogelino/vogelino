import slugify from "slugify";
import { notion } from "./notion";

interface RawNotionProjectType {
  properties: {
    Name: {
      title: {
        type: "text";
        plain_text: string;
      }[];
    };
    Thumbnail: {
      files: {
        external: {
          url: string;
        };
      }[];
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
  const { Name, Thumbnail, Type } = rawProject.properties;
  const thumbnail = Thumbnail.files[0].external.url;
  const type = Type.select.name;
  const fullTitle = Name.title.map(({ plain_text }) => plain_text).join("");
  const [titleLine1, ...rest] = fullTitle.split(" ");
  const titleLine2 = rest.join(" ");
  return {
    fullTitle,
    titleLine1,
    titleLine2,
    type,
    slug: slugify(fullTitle),
    thumbnail,
  };
};

export interface MappedNotionProject {
  fullTitle: string;
  titleLine1: string;
  titleLine2: string;
  type: string;
  slug: string;
  thumbnail: string;
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

  return notionProjects.map(parseNotionProject);
};
