import type { ArenaLinkType } from "./getExistingArenaLinks";
import { urlsAreEquals } from "./urlsAreEqual";

type FilterArenaLinksType = (props: {
  arenaLinks: ArenaLinkType[];
  existingLinks: string[];
}) => ArenaLinkType[];

export const filterArenatLinks: FilterArenaLinksType = ({
  arenaLinks,
  existingLinks,
}) =>
  arenaLinks.filter(
    (arenaLink) =>
      !existingLinks.find((existingLink) =>
        urlsAreEquals(existingLink, arenaLink.url)
      )
  );
