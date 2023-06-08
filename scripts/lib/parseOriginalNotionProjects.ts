import type {
  NotionRelationType,
  RawNotionProjectType,
} from "./getOriginalNotionProjects";
import fetch from "node-fetch";
import type { RawNotionCollaboratorType } from "./getOriginalNotionCollaborators";
import slugify from "slugify";
import { contentTypeToImgExtension } from "./contentTypeToImgExtension";
import { parseNotionFileUrl } from "./parseNotionFileUrl";

export interface MappedCollaboratorPageType {
  id: string;
  name: string;
  url?: string;
  avatar?: string;
}

export interface MappedNotionProject extends Record<string, unknown> {
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
  collaborators: MappedCollaboratorPageType[];
  supervisors: MappedCollaboratorPageType[];
  colleagues: MappedCollaboratorPageType[];
  institutions: MappedCollaboratorPageType[];
  highlighted: boolean;
}

export async function parseOriginalNotionProjects(
  originalProjects: RawNotionProjectType[],
  originalCollaborators: RawNotionCollaboratorType[]
): Promise<MappedNotionProject[]> {
  const allCollaboratorPagesWithUrls = await getCollaboratorsImages(
    originalCollaborators
  );
  return originalProjects.map((p) =>
    mapOriginalNotionProject(p, allCollaboratorPagesWithUrls)
  );
}

function mapOriginalNotionProject(
  rawProject: RawNotionProjectType,
  rawCollaborators: RawNotionCollaboratorType[]
): MappedNotionProject {
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
  const highlighted =
    !!rawProject.properties["Highlight in portfolio"].checkbox;

  const thumbnail = `/images/thumbnails/${slug}.webp`;
  const bgImage = `/images/bg-images/${slug}.webp`;
  const getRelationIds = getRealtionExtractor(rawProject);
  const collaboratorsIds = getRelationIds("In collaboration with");
  const supervisorsIds = getRelationIds("Supervised by");
  const colleaguesIds = getRelationIds("Made With");
  const institutionsIds = getRelationIds("Made @");
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
    collaborators: mapNotionCollaborators(rawCollaborators, collaboratorsIds),
    colleagues: mapNotionCollaborators(rawCollaborators, supervisorsIds),
    supervisors: mapNotionCollaborators(rawCollaborators, colleaguesIds),
    institutions: mapNotionCollaborators(rawCollaborators, institutionsIds),
    highlighted,
  };
}

function getRealtionExtractor(rawProject: RawNotionProjectType) {
  return (key: string): string[] =>
    (
      rawProject.properties[
        key as keyof typeof rawProject.properties
      ] as NotionRelationType
    ).relation.map(({ id }) => id);
}

function mapNotionCollaborators(
  allCollaboratorPages: RawNotionCollaboratorType[],
  ids: string[]
): MappedCollaboratorPageType[] {
  return ids.reduce((acc, id) => {
    const collaborator = allCollaboratorPages.find((p) => p.id === id);
    if (!collaborator) return acc;
    return [...acc, mapNotionCollaborator(collaborator)];
  }, [] as MappedCollaboratorPageType[]);
}

function mapNotionCollaborator(
  col: RawNotionCollaboratorType
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

async function getCollaboratorsImages(
  allCollaboratorPages: RawNotionCollaboratorType[]
): Promise<RawNotionCollaboratorType[]> {
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
  return mappedPages.filter(Boolean) as unknown as RawNotionCollaboratorType[];
}

async function getImageWithExtension(url: string): Promise<string> {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");
  const originalImageExt = contentTypeToImgExtension(contentType);
  const imageExt = originalImageExt === "svg" ? "svg" : "webp";
  return imageExt;
}
