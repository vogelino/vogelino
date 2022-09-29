import * as dotenv from "dotenv";
dotenv.config();
import { getNotionProjects } from "./../src/utils/getNotionProjects";
import { doesFileExists } from "./lib/doesFileExist";
import { downloadImage } from "./lib/downloadImage";
import { log, logEnd, logH1, logIndented, logSecondary } from "./lib/logUtil";
import { resizeImage } from "./lib/resizeImage";
import { getNotionPageContentImages } from "./lib/getNotionPageContentImages";
import fs from "node:fs/promises";
import {
  BG_IMAGEs_RESIZED_EXPORT_PATH,
  CONTENT_RESIZED_EXPORT_PATH,
  IMAGE_TMP_EXPORT_PATH,
  THUMBNAILS_RESIZED_EXPORT_PATH,
} from "./paths";
import { createDirectoriesIfNotAlreadyThere } from "./lib/createDirectoriesIfNotAlreadyThere";
import { notion } from "./lib/notion";

const WIDTH = 1440;
const HEIGHT = 960;

const databaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID || "";

async function downloadNotionProjectImages() {
  logH1(`Downloading all project images from Notion`);

  log(`databaseId: ${databaseId}`);
  const projects = await getNotionProjects(databaseId, notion, false);

  for (const project of projects) {
    const { slug, thumbnail, bgImage } = project;
    const contentImages = await getNotionPageContentImages(project.id);

    logSecondary([`Downloading images for page "${slug}"`]);
    logIndented(`📺 ${thumbnail.slice(0, 50)}...`);
    logIndented(`🖼 ${bgImage.slice(0, 50)}...`);
    logIndented(`📝 Content images:`);

    // MAKE SURE DIRECTORIES EXIST
    await createDirectoriesIfNotAlreadyThere(IMAGE_TMP_EXPORT_PATH);
    await createDirectoriesIfNotAlreadyThere(THUMBNAILS_RESIZED_EXPORT_PATH);
    await createDirectoriesIfNotAlreadyThere(BG_IMAGEs_RESIZED_EXPORT_PATH);
    await createDirectoriesIfNotAlreadyThere(CONTENT_RESIZED_EXPORT_PATH);

    // CHECK FOR EXISTING DESTINATION FILE FOR THUMBNAIL
    const thumbResizeDest = `${THUMBNAILS_RESIZED_EXPORT_PATH}/${slug}.webp`;
    const destThumbFileAlreadyExist = await doesFileExists(thumbResizeDest);

    // CHECK FOR EXISTING DESTINATION FILE FOR BG IMAGE
    const bgResizeDest = `${BG_IMAGEs_RESIZED_EXPORT_PATH}/${slug}.webp`;
    const destBgFileAlreadyExist = await doesFileExists(bgResizeDest);

    if (destThumbFileAlreadyExist) {
      logIndented(`⏭ Skipping (already exists)`);
    } else {
      // DOWNLOAD
      const { imageExt, data } = await downloadImage(thumbnail);
      const originalPath = `${IMAGE_TMP_EXPORT_PATH}/${slug}.${imageExt}`;

      // SAVING LARGE FILE
      logIndented(`💾 Saving file into: ${originalPath}`);
      await fs.writeFile(originalPath, data);
      logIndented(`✅ Success`);

      // RESIZING FILE
      logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`);
      await resizeImage(originalPath, thumbResizeDest, {
        width: WIDTH,
        height: HEIGHT,
        position: "top",
      });
      logIndented(`✅ Success!`, 1);
      await fs.unlink(originalPath);
    }

    if (destBgFileAlreadyExist) {
      logIndented(`⏭ Skipping (already exists)`);
    } else {
      // DOWNLOAD
      const { imageExt, data } = await downloadImage(bgImage);
      const originalPath = `${IMAGE_TMP_EXPORT_PATH}/${slug}.${imageExt}`;

      // SAVING LARGE FILE
      logIndented(`💾 Saving file into: ${originalPath}`);
      await fs.writeFile(originalPath, data);
      logIndented(`✅ Success`);

      // RESIZING FILE
      logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`);
      await resizeImage(originalPath, bgResizeDest, {
        width: WIDTH,
        height: HEIGHT,
        position: "center",
      });
      logIndented(`✅ Success!`, 1);
      await fs.unlink(originalPath);
    }

    for (const contentImg of contentImages) {
      // CHECK FOR EXISTING DESTINATION FILE FOR BG IMAGE
      const contentImgDest = `${CONTENT_RESIZED_EXPORT_PATH}/${contentImg.name}.webp`;
      const contentImgAlreadyExist = await doesFileExists(contentImgDest);

      if (contentImgAlreadyExist) {
        logIndented(`⏭ Skipping (already exists)`);
      } else {
        // DOWNLOAD
        const { imageExt, data } = await downloadImage(contentImg.url);
        const contentImgOriginalPath = `${IMAGE_TMP_EXPORT_PATH}/${slug}.${imageExt}`;

        // SAVING LARGE FILE
        logIndented(`💾 Saving file into: ${contentImgOriginalPath}`);
        await fs.writeFile(contentImgOriginalPath, data);
        logIndented(`✅ Success`);

        // RESIZING FILE
        logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`);
        await resizeImage(contentImgOriginalPath, contentImgDest, {
          width: WIDTH,
          withoutEnlargement: true,
        });
        logIndented(`✅ Success!`, 1);
        await fs.unlink(contentImgOriginalPath);
      }
    }
  }

  logEnd();
  process.exit();
}

downloadNotionProjectImages();
