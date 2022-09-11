import { logSummary, logSecondary, logEnd } from "./lib/logUtil";
import { addArenaLinkToFile } from "./lib/addArenaLinkToFile";
import { getExistingArenaLinkMap } from "./lib/getExistingArenaLinks";
import { getAllNotionLinks } from "./lib/getAllNotionLinks";
import { filterArenatLinks } from "./lib/filterArenatLinks";
import type { ArenaLinkType } from "./lib/getExistingArenaLinks";
import { fetchAllArenaBlocks } from "./lib/fetchAllArenaBlocks";
import { mapArenaLink } from "./lib/mapArenaLink";
import { getHeadlessPage } from "./lib/getHeadlessPage";
import { logH1, logIndented } from "./lib/logUtil";

let successfulFaviconsScrapes = 0;
async function getAllArenaLinks(): Promise<void> {
  logH1(`Fetching Arena Blocks via API`);

  const blocks = await fetchAllArenaBlocks();

  logH1(`Arena Links successfully fetched (${blocks.length} blocks)`);

  const arenaLinkBlocks = blocks.filter((link) => link.class === "Link");
  logIndented(`Link blocks: ${arenaLinkBlocks.length}`);
  const mappedArenaLinks = arenaLinkBlocks.map(mapArenaLink);
  const arenaLinks = mappedArenaLinks.filter(
    (link) => !!link.title && !!link.thumbnail && !!link.url
  );
  logIndented(`Complete blocks: ${arenaLinks.length}`);

  const [existingLinksMap, notionLinks] = await Promise.all([
    getExistingArenaLinkMap(),
    getAllNotionLinks(),
  ]);
  const exitingLinkUrls = Object.values(existingLinksMap).filter(
    Boolean
  ) as ArenaLinkType[];
  const existingLinks = [
    ...notionLinks,
    ...exitingLinkUrls.map(({ url }) => url),
  ];
  const filteredLinks = filterArenatLinks({ existingLinks, arenaLinks });
  logSummary(`Arena Links successfully fetched`, [
    `${arenaLinks.length} links`,
    `${arenaLinks.length - filteredLinks.length} skipped links`,
    `${filteredLinks.length} new links`,
  ]);

  const linksWithoutFavicon = filteredLinks.filter((link) => !link.faviconUrl);

  logH1(`Crawling missing favicons (${linksWithoutFavicon.length} favicons)`);

  for (const link of filteredLinks) {
    logSecondary([`🏊‍♀️ Crawling Favicon for: ${link.url}`]);

    if (!link || existingLinksMap[link.title]?.faviconUrl) {
      logIndented(`⏭ Skipping already existing favicon`);
      continue;
    }

    let faviconUrl: string | null = null;

    try {
      const { page } = await getHeadlessPage(link.url);

      try {
        const faviconUrlString = await page.evaluate(() => {
          const faviconElement = document.querySelector('link[rel*="icon"]');
          return faviconElement && faviconElement.getAttribute("href");
        });

        if (faviconUrlString) {
          faviconUrl = new URL(faviconUrlString, link.url).toString();
        }
      } finally {
        await page.close();
        continue;
      }
    } finally {
      if (faviconUrl) {
        logIndented(`✅ Found favicon`);
        successfulFaviconsScrapes += 1;
      } else {
        logIndented(`❌ No favicon found`);
      }
      logIndented(`💾 Saving to file`);
      await addArenaLinkToFile({ ...link, faviconUrl });
      logIndented(`🛟 Saved ✔️`);
      continue;
    }
  }

  logH1(
    `Successfully scraped ${successfulFaviconsScrapes} of ${filteredLinks.length} favicons`
  );
  successfulFaviconsScrapes = 0;

  logEnd();
  process.exit();
}

getAllArenaLinks();
