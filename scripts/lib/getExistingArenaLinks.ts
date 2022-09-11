import fs from "node:fs/promises";
import { ARENA_LINKS_JSON_PATH } from "../paths";

export interface ArenaLinkType {
  url: string;
  title: string;
  thumbnail: string;
  faviconUrl: string | null;
}

export type ArenLinksDataType = { sites: Record<string, null | ArenaLinkType> };

export const getExistingArenaLinks = async (): Promise<ArenaLinkType[]> => {
  const existingMap = await fs.readFile(ARENA_LINKS_JSON_PATH, "utf-8");
  const { sites } = JSON.parse(`${existingMap}`) as ArenLinksDataType;
  return Object.values(sites) as ArenaLinkType[];
};

export const getExistingArenaLinkMap = async (): Promise<
  ArenLinksDataType["sites"]
> => {
  const existingMap = await fs.readFile(ARENA_LINKS_JSON_PATH, "utf-8");
  const { sites } = JSON.parse(`${existingMap}`) as ArenLinksDataType;
  return sites;
};
