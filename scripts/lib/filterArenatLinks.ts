import { urlsAreEquals } from "./urlsAreEqual";

interface FilterArenaLinksType<ObjType> {
  arenaLinks: ObjType[];
  existingLinks: string[];
}

export function filterArenatLinks<ObjType extends { url: string }>({
  arenaLinks,
  existingLinks,
}: FilterArenaLinksType<ObjType>) {
  return arenaLinks.filter(
    (arenaLink) =>
      !existingLinks.find((existingLink) =>
        urlsAreEquals(existingLink, arenaLink.url)
      )
  );
}
