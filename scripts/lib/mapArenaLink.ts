import type { ArenaBlockType } from "./fetchAllArenaBlocks";
import type { ArenaLinkType } from "./getExistingArenaLinks";

export const mapArenaLink = (link: ArenaBlockType): ArenaLinkType => ({
  title:
    link?.source?.provider?.title || link?.source?.title || link.title || "",
  url: link?.source?.url || link?.source?.provider?.url || "",
  thumbnail: link.image?.original?.url || "",
  faviconUrl: null,
});
