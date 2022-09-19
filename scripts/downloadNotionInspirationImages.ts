import * as dotenv from "dotenv";
dotenv.config();
import { doesFileExists } from "./lib/doesFileExist";
import { downloadImage } from "./lib/downloadImage";
import { getAllNotionInspirationImages } from "./lib/getAllNotionInspirationImages";
import { logEnd, logH1, logIndented, logSecondary } from "./lib/logUtil";
import { resizeImage } from "./lib/resizeImage";
import fs from "node:fs/promises";
import {
  IMAGE_TMP_EXPORT_PATH,
  INSPIRATION_RESIZED_EXPORT_PATH,
} from "./paths";
import { createDirectoriesIfNotAlreadyThere } from "./lib/createDirectoriesIfNotAlreadyThere";

const WIDTH = 560;
const HEIGHT = 292;

const databaseId = process.env.NOTION_INSPIRATION_DATABASE_ID || "";

async function downloadNotionInspirationImages() {
  logH1(`Downloading all images from Notion`);

  const images = await getAllNotionInspirationImages(databaseId, false);

  for (const [pageId, url] of images) {
    logSecondary([`Downloading image "${pageId}"`]);
    logIndented(`🔗 ${url.slice(0, 50)}...`);

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
        logIndented(`✅ Success`);
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

  logEnd();
  process.exit();
}

downloadNotionInspirationImages();
