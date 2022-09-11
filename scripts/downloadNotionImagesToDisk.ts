import { doesFileExists } from "./lib/doesFileExist";
import { downloadImage } from "./lib/downloadImage";
import { getAllNotionLinksImages } from "./lib/getAllNotionLinksImages";
import { logEnd, logH1, logIndented, logSecondary } from "./lib/logUtil";
import { resizeImage } from "./lib/resizeImage";
import fs from "node:fs/promises";
import {
  IMAGE_ORIGINALS_EXPORT_PATH,
  IMAGE_RESIZED_EXPORT_PATH,
} from "./paths";
import { createDirectoriesIfNotAlreadyThere } from "./lib/createDirectoriesIfNotAlreadyThere";

const WIDTH = 560;
const HEIGHT = 292;

/*
1. Images are downloaded from notion and saved in the images repo
3. The file names are based on the page id
4. The images are resized/optimized to fit my needs
5. All files in the folder that do not correspond to any link are deleted
6. Once all images are clean, a manual push on the images repo is made
7. A GitHub action reacts to the push of the images repo and fires a vercel webhook
8. The vercel webhook triggers the deployment of the astro website

TADAA! All the images are now hosted on my side!
*/
async function downloadNotionImagesToDisk() {
  logH1(`Downloading all images from Notion`);

  const images = await getAllNotionLinksImages(false);

  for (const [pageId, url] of images) {
    logSecondary([`Downloading image "${pageId}"`]);
    logIndented(`🔗 ${url.slice(0, 50)}...`);

    // MAKE SURE DIRECTORIES EXIST
    await createDirectoriesIfNotAlreadyThere(IMAGE_ORIGINALS_EXPORT_PATH);
    await createDirectoriesIfNotAlreadyThere(IMAGE_RESIZED_EXPORT_PATH);

    // CHECK FOR EXISTING DESTINATION FILE
    const resizeDest = `${IMAGE_RESIZED_EXPORT_PATH}/${pageId}.webp`;
    const destinationFileAlreadyExist = await doesFileExists(resizeDest);

    if (destinationFileAlreadyExist) {
      logIndented(`⏭ Skipping (already exists)`);
    } else {
      // DOWNLOAD
      const { imageExt, data } = await downloadImage(url);
      const originalPath = `${IMAGE_ORIGINALS_EXPORT_PATH}/${pageId}.${imageExt}`;

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

downloadNotionImagesToDisk();
