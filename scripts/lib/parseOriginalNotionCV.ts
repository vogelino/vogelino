import { RawNotionCVType } from "./getOriginalNotionCV";
import { NotionTextType } from "./getOriginalNotionProjects";

export interface MappedNotionCVLine extends Record<string, unknown> {
  id: string;
  title: NotionTextType[];
  timePeriod: string | null;
  certification: string | null;
  location: string | null;
  category: "work" | "education" | "teaching" | "internships";
}

export type MappedNotionCV = Record<string, MappedNotionCVLine[]>;

const getKeyFilterFnc =
  (arr: MappedNotionCVLine[]) =>
  (key: MappedNotionCVLine["category"]): MappedNotionCVLine[] =>
    arr.filter((l) => l.category === key).reverse();

export async function parseOriginalNotionCV(
  originalCV: RawNotionCVType[]
): Promise<MappedNotionCV> {
  const mappedCVLines = originalCV.map(mapOriginalNotionCVLine);
  const filterByKey = getKeyFilterFnc(mappedCVLines);
  return {
    work: filterByKey("work"),
    education: filterByKey("education"),
    teaching: filterByKey("teaching"),
    internships: filterByKey("internships"),
  };
}

function richTextToString(s: { plain_text: string }[]): string {
  return s
    .map(({ plain_text }) => plain_text)
    .join(" ")
    .trim();
}

function mapOriginalNotionCVLine(
  rawCVLine: RawNotionCVType
): MappedNotionCVLine {
  const { title, timePeriod, certification, location, category } =
    rawCVLine.properties;

  return {
    id: rawCVLine.id,
    title: title.title,
    timePeriod: richTextToString(timePeriod.rich_text),
    certification: richTextToString(certification.rich_text),
    location: richTextToString(location.rich_text),
    category:
      category.select.name.toLowerCase() as MappedNotionCVLine["category"],
  };
}
