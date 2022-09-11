import { notion } from "./notion";

const IPP = 100;

type NotionImageType = Record<
  "external" | "file",
  {
    url: string;
  }
>;

interface RawNotionInspirationLinkType {
  id: string;
  cover: null | NotionImageType;
  icon:
    | null
    | NotionImageType
    | {
        type: "emoji";
        emoji: string;
      };
  properties: {
    Name: {
      title: {
        type: "text";
        plain_text: string;
      }[];
    };
    URL: {
      url: string;
    };
  };
  children: {
    type: "image";
    image: NotionImageType;
  }[];
}

export interface MappedNotionInspirationLinkType {
  id: string;
  title: string;
  url: string;
  thumbnail: string | undefined;
  icon: string | { emoji: string };
}

function mapNotionInspirationLink(
  rawLink: RawNotionInspirationLinkType
): MappedNotionInspirationLinkType {
  const { icon, cover } = rawLink;
  const { Name, URL } = rawLink.properties;
  let iconToReturn: string | { emoji: string } = "";
  if (icon) {
    if ("emoji" in icon) iconToReturn = icon;
    else {
      iconToReturn = (icon?.file || icon?.external)?.url;
    }
  }
  return {
    id: rawLink.id,
    title: Name.title.map((item) => item.plain_text).join(""),
    url: URL.url,
    thumbnail: (cover?.file || cover?.external)?.url,
    icon: iconToReturn,
  };
}

export async function getAllNotionLinks(
  prevLinks: MappedNotionInspirationLinkType[] = [],
  nextCursor?: string
): Promise<MappedNotionInspirationLinkType[]> {
  const response = await notion.databases.query({
    database_id: import.meta.env.NOTION_INSPIRATION_DATABASE_ID,
    page_size: IPP,
    start_cursor: nextCursor,
    filter: {
      property: "Tags",
      multi_select: {
        does_not_contain: "Unreachable",
      },
    },
  });

  const rawNotionLinks =
    response.results as unknown as RawNotionInspirationLinkType[];

  let mappedNotionLinks = [];
  for (const rawNotionLink of rawNotionLinks) {
    const mappedNotionLink = mapNotionInspirationLink(rawNotionLink);
    mappedNotionLinks.push(mappedNotionLink);
  }

  const allLinksUpToNow = [...prevLinks, ...mappedNotionLinks];

  if (response.next_cursor && response.has_more) {
    return getAllNotionLinks(allLinksUpToNow, response.next_cursor);
  }
  return allLinksUpToNow;
}
