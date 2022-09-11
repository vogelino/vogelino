import {
  ArenaLinkType,
  getExistingArenaLinkMap,
} from "./getExistingArenaLinks";
import { writeJsonFile } from "./writeJsonFile";
import { ARENA_LINKS_JSON_PATH } from "../paths";

export const addArenaLinkToFile = async (
  link: ArenaLinkType
): Promise<void> => {
  const existingArenaLinkMap = await getExistingArenaLinkMap();
  const newArenaLinksMap = {
    sites: { ...existingArenaLinkMap, [link.title]: link },
  };
  await writeJsonFile(ARENA_LINKS_JSON_PATH, newArenaLinksMap);
};
