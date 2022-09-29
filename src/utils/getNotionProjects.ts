import type { Client } from "@notionhq/client";
import fetch from "node-fetch";
import slugify from "slugify";
import { contentTypeToImgExtension } from "../../scripts/lib/contentTypeToImgExtension";

interface NotionImageType {
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

interface NotionRelationType {
  id: string;
  type: "relation";
  relation: { id: string }[];
}

interface NotionTitleType {
  title: {
    type: "text";
    plain_text: string;
  }[];
}

export interface RawNotionProjectType {
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

const parseNotionFileUrl = (file?: NotionFilesType) => {
  const firstFile = file?.files[0];
  if (!firstFile) return "";
  return firstFile.external?.url || firstFile.file?.url || "";
};

const getRealtionExtractor =
  (rawProject: RawNotionProjectType) =>
  (key: string): string[] =>
    (
      rawProject.properties[
        key as keyof typeof rawProject.properties
      ] as NotionRelationType
    ).relation.map(({ id }) => id);

async function parseNotionProject(
  rawProject: RawNotionProjectType
): Promise<MappedNotionProject<false>> {
  const { Name, NameShort, Description, Type, Year, URL } =
    rawProject.properties;
  const fullTitle = Name.title.map(({ plain_text }) => plain_text).join("");
  const slug = slugify(fullTitle, {
    lower: true,
    strict: true,
    trim: true,
    remove: /\./gi,
  });

  const type = Type.select.name;
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

  const thumbnail = `/images/thumbnails/${slug}.webp`;
  const bgImage = `/images/bg-images/${slug}.webp`;
  const getRelationIds = getRealtionExtractor(rawProject);
  return {
    id: rawProject.id,
    title: fullTitle,
    nameShort,
    description,
    type,
    slug,
    thumbnail,
    bgImage,
    year: Year.number,
    url: URL.url,
    collaborators: getRelationIds("In collaboration with"),
    supervisors: getRelationIds("Supervised by"),
    colleagues: getRelationIds("Made With"),
    institutions: getRelationIds("Made @"),
  };
}

export interface MappedNotionProject<LoadRelations extends boolean>
  extends Record<string, unknown> {
  id: string;
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
  collaborators: LoadRelations extends true
    ? MappedCollaboratorPageType[]
    : string[];
  supervisors: LoadRelations extends true
    ? MappedCollaboratorPageType[]
    : string[];
  colleagues: LoadRelations extends true
    ? MappedCollaboratorPageType[]
    : string[];
  institutions: LoadRelations extends true
    ? MappedCollaboratorPageType[]
    : string[];
}

interface NotionCollaboratorPageType {
  id: string;
  properties: {
    URL: {
      url: null | string;
    };
    Avatar: NotionFilesType;
    Name: NotionTitleType;
  };
}

export interface MappedCollaboratorPageType {
  id: string;
  name: string;
  url?: string;
  avatar?: string;
}

export async function getNotionProjects<LoadRelations extends boolean>(
  databaseId: string,
  notionInstance: Client,
  loadRelations: undefined | LoadRelations
): Promise<MappedNotionProject<LoadRelations>[]> {
  const notionResponse = await notionInstance.databases.query({
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
  const mappedProjects = (
    await Promise.all(notionProjects.map(parseNotionProject))
  ).sort((a, b) => b.year - a.year);
  if (!loadRelations)
    return mappedProjects as unknown as MappedNotionProject<LoadRelations>[];
  const allCollaboratorIds = Array.from(
    mappedProjects
      .reduce((acc, p) => {
        [
          ...p.collaborators,
          ...p.colleagues,
          ...p.supervisors,
          ...p.institutions,
        ].forEach((id) => acc.add(id));
        return acc;
      }, new Set<string>())
      .values()
  );
  const allCollaboratorPromises = allCollaboratorIds.map((id) =>
    notionInstance.pages.retrieve({
      page_id: id,
    })
  );
  const allCollaboratorPages = await Promise.all(allCollaboratorPromises);
  const allCollaboratorPagesWithUrls = await getCollaboratorsImages(
    allCollaboratorPages as unknown as NotionCollaboratorPageType[]
  );
  const projectMapper = getCollaboratosMapper(allCollaboratorPagesWithUrls);
  return mappedProjects.map(
    projectMapper
  ) as unknown as MappedNotionProject<LoadRelations>[];
}

async function getCollaboratorsImages(
  allCollaboratorPages: NotionCollaboratorPageType[]
): Promise<NotionCollaboratorPageType[]> {
  const mappedPagesPromises = allCollaboratorPages.map(async (col) => {
    const url = parseNotionFileUrl(col.properties.Avatar);
    if (!url) return false;
    try {
      const imageExt = await getImageWithExtension(url);
      const imageUrl = `/images/collaborators/${col.id}.${imageExt}`;

      return {
        ...col,
        properties: {
          ...col.properties,
          Avatar: {
            files: [
              {
                external: {
                  url: imageUrl,
                },
              },
            ],
          },
        },
      };
    } catch (err) {
      console.log(url);
      console.log(err);

      return false;
    }
  });
  const mappedPages = await Promise.all(mappedPagesPromises);
  return mappedPages.filter(Boolean) as unknown as NotionCollaboratorPageType[];
}

function getCollaboratosMapper(
  allCollaboratorPages: NotionCollaboratorPageType[]
) {
  return (project: MappedNotionProject<false>): MappedNotionProject<true> => {
    return {
      ...project,
      collaborators: mapNotionCollaborators(
        allCollaboratorPages,
        project.collaborators
      ),
      colleagues: mapNotionCollaborators(
        allCollaboratorPages,
        project.colleagues
      ),
      supervisors: mapNotionCollaborators(
        allCollaboratorPages,
        project.supervisors
      ),
      institutions: mapNotionCollaborators(
        allCollaboratorPages,
        project.institutions
      ),
    };
  };
}

function mapNotionCollaborators(
  allCollaboratorPages: NotionCollaboratorPageType[],
  ids: string[]
): MappedCollaboratorPageType[] {
  return ids.reduce((acc, id) => {
    const collaborator = allCollaboratorPages.find((p) => p.id === id);
    if (!collaborator) return acc;
    return [...acc, mapNotionCollaborator(collaborator)];
  }, [] as MappedCollaboratorPageType[]);
}

function mapNotionCollaborator(
  col: NotionCollaboratorPageType
): MappedCollaboratorPageType {
  return {
    id: col.id,
    name: col.properties.Name.title
      .map(({ plain_text }) => plain_text)
      .join(""),
    url: col.properties.URL.url || undefined,
    avatar: parseNotionFileUrl(col.properties.Avatar),
  };
}

async function getImageWithExtension(url: string): Promise<string> {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");
  const originalImageExt = contentTypeToImgExtension(contentType);
  const imageExt = originalImageExt === "svg" ? "svg" : "webp";
  return imageExt;
}
