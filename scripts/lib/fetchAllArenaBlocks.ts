import fetch from "node-fetch";

const IPP = 100;

export interface ArenaBlockType {
  id: string;
  title: string;
  description: string;
  class: string;
  source?: {
    url: string;
    title: string;
    provider?: {
      title: string | null;
      url: string | null;
    };
  };
  image?: {
    original?: {
      url: string;
    };
  };
}

export async function fetchAllArenaBlocks(
  page = 1,
  prevItems: ArenaBlockType[] = []
): Promise<ArenaBlockType[]> {
  const response = await fetch(
    `https://api.are.na/v2/channels/websites-yukewfitpaa/contents?page=${page}&per=${IPP}`
  );
  const json = (await response.json()) as { contents: ArenaBlockType[] };
  const pageBlocks = json.contents;
  const totalBlocks = [...prevItems, ...pageBlocks];

  if (pageBlocks.length === IPP) {
    return await fetchAllArenaBlocks(page + 1, totalBlocks);
  }
  return totalBlocks;
}
