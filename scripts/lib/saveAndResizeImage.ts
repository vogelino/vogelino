import fs from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";
import { IMAGE_DEST_EXPORT_PATH, IMAGE_TMP_EXPORT_PATH } from "../paths";
import { createDirectoriesIfNotAlreadyThere } from "./createDirectoriesIfNotAlreadyThere";
import { doesFileExists } from "./doesFileExist";
import { downloadImage } from "./downloadImage";
import { logIndented } from "./logUtil";
import { resizeImage } from "./resizeImage";

interface SaveAndResizeImageParamsType {
  fileName: string;
  folder: string;
  fileUrl?: string; //;
  resize?: sharp.ResizeOptions;
}

export async function saveAndResizeImage({
  fileName,
  folder,
  fileUrl,
  resize,
}: SaveAndResizeImageParamsType) {
  const fileAndFolder = `${folder}/${fileName}`;
  const destPath = `${IMAGE_DEST_EXPORT_PATH}/${fileAndFolder}`;
  if (!fileUrl)
    throw new Error(`fileUrl was undefined for destination "${fileAndFolder}"`);

  // CHECK FOR EXISTING DESTINATION FILE
  const alreadyExist = await doesFileExists(destPath);

  if (alreadyExist) {
    logIndented("⏭ Skipping (already exists)");
    return;
  }

  // DOWNLOAD
  const { data, imageExt } = await downloadImage(fileUrl);

  const tmpPath = `${IMAGE_TMP_EXPORT_PATH}/${folder}/${fileName.replace(/\.[^/.]+$/, "")}.${imageExt}`;
  const firstSavePath = resize ? tmpPath : destPath;
  await createDirectoriesIfNotAlreadyThere(dirname(tmpPath));
  await createDirectoriesIfNotAlreadyThere(dirname(destPath));

  if (!data) {
    throw Error(`The file could not be downloaded at path ${fileUrl}`);
  }

  let finalData = await stream2buffer(data);
  if (!fileName.endsWith(imageExt)) {
    finalData = await sharp(finalData)
      .toFormat(imageExt as "png")
      .toBuffer();
  }
  // SAVING (TMP) FILE
  logIndented(`💾 Saving file into: ${firstSavePath}`);

  await fs.writeFile(firstSavePath, finalData);
  logIndented("🛟 Saved ✔️");

  if (!resize) return;

  // RESIZING FILE
  logIndented(`📐 Resizing (${resize?.width}x${resize?.height})`);
  await resizeImage(tmpPath, destPath, resize);
  logIndented("✅ Saved and resized!", 1);
  await fs.unlink(tmpPath);
}

async function stream2buffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
