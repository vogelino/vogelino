export interface ProjectType {
  titleLine1: string;
  titleLine2: string;
  slug: string;
  imagePath: string;
  imageAlt: string;
  type: string;
  description: string;
}

export const projects: ProjectType[] = [
  {
    titleLine1: `Hidden`,
    titleLine2: `Perspectives`,
    slug: `hidden-perspectives`,
    imagePath: `/images/projects/hidden-perspectives/thumbnail.webp`,
    imageAlt: `The Shah with John F. Kennedy and Robert McNamara in 1962`,
    type: `Web Archive`,
    description:
      `A digital archive gathering documents and events ` +
      `relating to the U.S. – Iran political relationship.`,
  },
  {
    titleLine1: `Letter`,
    titleLine2: `Stori.es`,
    slug: `letter-stories-raoul-hausmann`,
    imagePath: `/images/projects/letter-stories/thumbnail.webp`,
    imageAlt: `Black and white portrait of german dada artist Raoul Hausmann`,
    type: `Dataviz`,
    description:
      `A  visualization of the correspondence ` +
      `between the austrian dada artist Raoul Hausmann and his ` +
      `contemporaries.`,
  },
  {
    titleLine1: `Design job`,
    titleLine2: `2030`,
    slug: `design-job-2030`,
    imagePath: `/images/projects/design-job-2030/thumbnail.webp`,
    imageAlt: `Old photo of an old flying car`,
    type: `Web Timeline`,
    description:
      `A critical-design timeline gathering real and ` +
      `speculative contents about the past and future of design jobs.`,
  },
  {
    titleLine1: `Streem`,
    titleLine2: `Magazine`,
    slug: `streem-retro-future-webdesign`,
    imagePath: `/images/projects/streem-magazine/thumbnail.webp`,
    imageAlt: `Line drawing of a city, mixed with 3d words such as Wurstbande`,
    type: `Scrollytelling`,
    description:
      `An experimental and fictional alternative ` +
      `online presence for the Berlin street magazine Streem.`,
  },
  {
    titleLine1: `Airbnb vs.`,
    titleLine2: `Berlin`,
    slug: `airbnb-vs-berlin`,
    imagePath: `/images/projects/airbnb-vs-berlin/thumbnail.webp`,
    imageAlt: `A birds-eye view of some building in Berlin with the U-Bahn`,
    type: `Data Journalism`,
    description:
      `A data journalism article analysing the impact of ` +
      `the housing platform Airbnb on Berlin.`,
  },
  {
    titleLine1: `Multigen`,
    titleLine2: `Living`,
    slug: `multi-generational-living-platform`,
    imagePath: `/images/projects/multigen-living/thumbnail.webp`,
    imageAlt: `Two senior women laughting together`,
    type: `Community Platform`,
    description:
      `A communication and organisation platform ` +
      ` for people linving in multi-generational communities.`,
  },
  {
    titleLine1: `Open`,
    titleLine2: `Circle`,
    slug: `open-circle-circular-economy-platform`,
    imagePath: `/images/projects/open-circle/thumbnail.webp`,
    imageAlt: `A street sign of a roundabout`,
    type: `Circular Economy`,
    description:
      `An online community web app for sharing circular` +
      ` economy-related know-how.`,
  },
];
