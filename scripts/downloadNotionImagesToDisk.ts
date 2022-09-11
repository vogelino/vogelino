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

    // CHECK FOR EXISTING LARGE FILE
    let largePath = `${IMAGE_ORIGINALS_EXPORT_PATH}/${pageId}.png`;
    const fileAlreadyExistAsPng = await doesFileExists(largePath);

    if (fileAlreadyExistAsPng) {
      logIndented(`⏭ Skipping (already exists)`);
    } else {
      // DOWNLOAD
      const { imageExt, data } = await downloadImage(url);
      largePath = `${IMAGE_ORIGINALS_EXPORT_PATH}/${pageId}.${imageExt}`;

      // CHECK FOR EXISTING LARGE FILE
      const fileAlreadyExist = await doesFileExists(largePath);

      if (fileAlreadyExist) {
        logIndented(`⏭ Skipping (already exists)`);
      } else {
        // SAVING LARGE FILE
        logIndented(`💾 Saving file into: ${largePath}`);
        await fs.writeFile(largePath, data);
        logIndented(`✅ Success`);
      }
    }

    // CHECK FOR EXISTING LARGE FILE
    const resizeDest = `${IMAGE_RESIZED_EXPORT_PATH}/${pageId}.webp`;
    const resizedFileAlreadyExist = await doesFileExists(resizeDest);

    logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`);
    if (resizedFileAlreadyExist) {
      logIndented("⏭ Skipping (already exists)", 1);
      continue;
    }
    // RESIZING FILE
    await resizeImage(largePath, resizeDest, {
      width: WIDTH,
      height: HEIGHT,
      position: "top",
    });
    logIndented(`✅ Success!`, 1);
  }

  logEnd();
  process.exit();
}

downloadNotionImagesToDisk();
