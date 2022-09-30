import * as dotenv from "dotenv";
dotenv.config();
import {
  ArenaLinkType,
  getExistingArenaLinks,
} from "./lib/getExistingArenaLinks";
import { filterArenatLinks } from "./lib/filterArenatLinks";
import { logEnd, logIndented, logSecondary, logSummary } from "./lib/logUtil";
import { notion } from "./lib/notion";
import { loadJson } from "./lib/loadJson";
import { INSPIRATIONS_JSON_PATH } from "./paths";
import { MappedNotionInspirationLinkType } from "./lib/parseOriginalNotionInspirations";

const databaseId = process.env.NOTION_INSPIRATION_DATABASE_ID || "";

async function addLink(link: ArenaLinkType): Promise<void> {
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: link.faviconUrl
      ? {
          external: {
            url: link.faviconUrl,
          },
        }
      : null,
    properties: {
      Name: {
        title: [
          {
            text: {
              content: link.title,
            },
          },
        ],
      },
      URL: {
        url: link.url,
      },
      Tags: {
        multi_select: [
          { name: "Individual Inspiration" },
          { name: "Webdesign" },
          { name: "Are.na" },
        ],
      },
    },
    children: [
      {
        type: "image",
        image: {
          type: "external",
          external: {
            url: link.thumbnail,
          },
        },
      },
    ],
  });
}

async function addArenaLinks() {
  const [inspirations, arenaLinks] = await Promise.all([
    loadJson<MappedNotionInspirationLinkType[]>(INSPIRATIONS_JSON_PATH),
    getExistingArenaLinks(),
  ]);
  const existingLinks = inspirations.map(({ url }) => url);
  const arenaLinksToAdd = filterArenatLinks<ArenaLinkType>({
    existingLinks,
    arenaLinks,
  });

  const totalLinks = existingLinks.length + arenaLinks.length;
  const skippedLinks = totalLinks - arenaLinksToAdd.length;

  logSummary(`Uploading links to Notion`, [
    `⏭ Skipping ${skippedLinks} already existing links`,
    `🔗 Uploading ${arenaLinksToAdd.length} links to Notion`,
  ]);

  for (const newLink of arenaLinksToAdd) {
    logSecondary([`⏫ "${newLink.url}"`]);
    try {
      await addLink(newLink);
      logIndented(`✅ Success!`);
    } catch (error) {
      logIndented(`❌ Error`);
      logIndented((error as { body: string }).body, 1);
    }
  }

  logEnd();
  process.exit();
}

addArenaLinks();
