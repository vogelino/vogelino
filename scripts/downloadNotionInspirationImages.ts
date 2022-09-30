import { MappedNotionInspirationLinkType } from "./lib/parseOriginalNotionInspirations";
import * as dotenv from "dotenv";
dotenv.config();
import { doesFileExists } from "./lib/doesFileExist";
import { downloadImage } from "./lib/downloadImage";
import { log, logEnd, logH1, logIndented, logSecondary } from "./lib/logUtil";
import { resizeImage } from "./lib/resizeImage";
import fs from "node:fs/promises";
import {
  IMAGE_TMP_EXPORT_PATH,
  INSPIRATIONS_JSON_PATH,
  INSPIRATION_RESIZED_EXPORT_PATH,
  ORIGINAL_INSPIRATIONS_JSON_PATH,
} from "./paths";
import { createDirectoriesIfNotAlreadyThere } from "./lib/createDirectoriesIfNotAlreadyThere";
import { RawNotionInspirationLinkType } from "./lib/getOriginalNotionInspirations";
import { loadJson } from "./lib/loadJson";
import { parseNotionFileUrl } from "./lib/parseNotionFileUrl";

const WIDTH = 560;
const HEIGHT = 292;

async function downloadNotionInspirationImages() {
  logH1(`Downloading all images from Notion`);

  const inspirations = await loadJson<RawNotionInspirationLinkType[]>(
    ORIGINAL_INSPIRATIONS_JSON_PATH
  );
  const images = inspirations.reduce((acc, rawInspiration) => {
    if (!rawInspiration.cover) return acc;
    return [
      ...acc,
      [
        rawInspiration.id,
        parseNotionFileUrl({ files: [rawInspiration.cover] }),
      ],
    ];
  }, [] as string[][]);

  for (const [pageId, url] of images) {
    logSecondary([`Downloading image "${pageId}"`]);
    logIndented(`🔗 ${url.slice(0, 50)}...`);

    if (pageId === "f453ef97-bc37-43d2-99ac-c1612c53f10b")
      // MAKE SURE DIRECTORIES EXIST
      await createDirectoriesIfNotAlreadyThere(IMAGE_TMP_EXPORT_PATH);
    await createDirectoriesIfNotAlreadyThere(INSPIRATION_RESIZED_EXPORT_PATH);

    // CHECK FOR EXISTING DESTINATION FILE
    const resizeDest = `${INSPIRATION_RESIZED_EXPORT_PATH}/${pageId}.webp`;
    const destinationFileAlreadyExist = await doesFileExists(resizeDest);

    if (destinationFileAlreadyExist) {
      logIndented(`⏭ Skipping (already exists)`);
    } else {
      // DOWNLOAD
      const { imageExt, data } = await downloadImage(url);
      const originalPath = `${IMAGE_TMP_EXPORT_PATH}/${pageId}.${imageExt}`;

      // CHECK FOR EXISTING LARGE FILE
      const fileAlreadyExist = await doesFileExists(originalPath);

      if (fileAlreadyExist) {
        logIndented(`⏭ Skipping (already exists)`);
      } else {
        // SAVING LARGE FILE
        logIndented(`💾 Saving file into: ${originalPath}`);
        await fs.writeFile(originalPath, data);
        logIndented(`🛟 Saved ✔️`);
      }

      // RESIZING FILE
      logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`);
      await resizeImage(originalPath, resizeDest, {
        width: WIDTH,
        height: HEIGHT,
        position: "top",
      });
      logIndented(`✅ Success!`, 1);
      await fs.unlink(originalPath);
    }
  }

  const mappedInspirations = await loadJson<MappedNotionInspirationLinkType[]>(
    INSPIRATIONS_JSON_PATH
  );
  // VERIFYING ALL IMAGES ARE REALLY DOWNLOADED
  for (const inspiration of mappedInspirations) {
    const filePath = `${INSPIRATION_RESIZED_EXPORT_PATH}/${inspiration.id}.webp`;
    const fileExists = await doesFileExists(filePath);
    if (!fileExists) {
      logSecondary([
        `⛔️ Missing file found for inspiration "${inspiration.title}"!`,
      ]);
      logIndented(filePath);
    }
  }

  logEnd();
  process.exit();
}

downloadNotionInspirationImages();
