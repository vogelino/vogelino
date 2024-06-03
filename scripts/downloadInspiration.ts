import * as dotenv from "dotenv";
import slugify from "slugify";
import { z } from "zod";
import {
  inspirationSchema,
  type InspirationType,
} from "../src/schemas/inspirations";
import { createDirectoriesIfNotAlreadyThere } from "./lib/createDirectoriesIfNotAlreadyThere";
import { getWebsiteScreenshotUrl } from "./lib/getWebsiteScreenshotUrl";
import { loadJson } from "./lib/loadJson";
import { logEnd, logH1, logIndented, logSecondary } from "./lib/logUtil";
import { saveAndResizeImage } from "./lib/saveAndResizeImage";
import { writeJsonFile } from "./lib/writeJsonFile";
import {
  INSPIRATIONS_JSON_PATH,
  INSPIRATION_FAVICON_EXPORT_PATH,
  INSPIRATION_RESIZED_EXPORT_PATH,
} from "./paths";
dotenv.config();

const githubPayloadZodSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  tags: z.string().array().default([]),
});
type GithubPayloadType = z.infer<typeof githubPayloadZodSchema>;

async function downloadInspirations() {
  logH1("ADDING AN INSPIRATION VIA GITHUB REPOSITORY DISPATCH");

  logSecondary(["🚚🐙 Parsing the GitHub payload"]);
  const githubPayload = getGithubPayloadUrl();

  logSecondary([`💭🧐 Parsing the inspiration from the GitHub payload`]);
  const parsedInspiration = await parseGithubInspiration(githubPayload);

  logSecondary(["👓📖 Loading existing inspirations from the JSON file"]);
  const existingInspirations = await loadJson(INSPIRATIONS_JSON_PATH);

  logSecondary([`💭🧐 Parsing the existing inspirations from the JSON file`]);
  const parsedInspirations = inspirationSchema
    .array()
    .parse(existingInspirations);

  logSecondary(["📁✅ Creating the folders for the downloaded inspirations"]);
  await createDirectoriesIfNotAlreadyThere("data");

  logSecondary([
    `💾💭 Saving the parsed inspiration along with the existing ones`,
  ]);
  await writeJsonFile(INSPIRATIONS_JSON_PATH, [
    parsedInspiration,
    ...parsedInspirations,
  ]);
  logIndented(`🛟 Saved ${parsedInspirations.length} parsed inspirations ✔️`);
  logIndented(INSPIRATIONS_JSON_PATH, 1);

  logEnd();

  process.exit();
}

void downloadInspirations();

function getGithubPayloadUrl() {
  const rawGithubPayload = JSON.parse(process.env.GITHUB_PAYLOAD || "{}");
  const githubPayload = githubPayloadZodSchema.safeParse(rawGithubPayload);

  if (!githubPayload.success) {
    const formattedZodError = githubPayload.error.issues
      .map((issue) => `${issue.path.join(" ")}: ${issue.message}`)
      .join(", ");
    throw new Error(
      `Payload validation error: ${formattedZodError}. Payload: ${JSON.stringify(rawGithubPayload)}`
    );
  }

  return githubPayload.data;
}

async function parseGithubInspiration(
  githubPayload: GithubPayloadType
): Promise<InspirationType> {
  const id = slugify(githubPayload.name.toLowerCase());
  await saveFavicon(githubPayload.url, id);
  await saveThumbnail(githubPayload.url, id);
  return {
    title: githubPayload.name,
    tags: githubPayload.tags,
    url: githubPayload.url,
    id,
    date: new Date().toISOString(),
  };
}

async function saveThumbnail(url: string, id: string) {
  const cloudinaryUrl = await getWebsiteScreenshotUrl(url);
  await saveAndResizeImage({
    fileName: `${id}.webp`,
    folder: `inspirations`,
    fileUrl: cloudinaryUrl,
  });

  return `${INSPIRATION_RESIZED_EXPORT_PATH}/${id}.webp`;
}

async function saveFavicon(url: string, id: string) {
  const size = 32;
  await saveAndResizeImage({
    fileName: `${id}.webp`,
    folder: `inspirations-favicons`,
    fileUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=${size}&url=${url}`,
  });

  return `${INSPIRATION_FAVICON_EXPORT_PATH}/${id}.png`;
}
