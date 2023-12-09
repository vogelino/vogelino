import { doesFileExists } from "./doesFileExist";
import { downloadImage } from "./downloadImage";
import { logIndented } from "./logUtil";
import { resizeImage } from "./resizeImage";
import sharp from "sharp";
import fs from 'node:fs/promises'
import { dirname, extname } from 'path'
import { createDirectoriesIfNotAlreadyThere } from "./createDirectoriesIfNotAlreadyThere";
import { IMAGE_DEST_EXPORT_PATH, IMAGE_TMP_EXPORT_PATH } from "../paths";

interface SaveAndResizeImageParamsType {
  fileName: string;
  folder: string;
  fileUrl?: string//;
  resize?: sharp.ResizeOptions;
}

export async function saveAndResizeImage({
  fileName,
  folder,
  fileUrl,
  resize,
}: SaveAndResizeImageParamsType) {
  const fileAndFolder = `${folder}/${fileName}`
  const destPath = `${IMAGE_DEST_EXPORT_PATH}/${fileAndFolder}`
  const tmpPath = `${IMAGE_TMP_EXPORT_PATH}/${fileAndFolder}`
  if (!fileUrl) throw new Error(`fileUrl was undefined for destination "${fileAndFolder}"`)

  // CHECK FOR EXISTING DESTINATION FILE
  const alreadyExist = await doesFileExists(destPath)

  if (alreadyExist) {
    logIndented(`⏭ Skipping (already exists)`)
    return
  }

  await createDirectoriesIfNotAlreadyThere(dirname(tmpPath))
  await createDirectoriesIfNotAlreadyThere(dirname(destPath))

  // DOWNLOAD
  const { data } = await downloadImage(fileUrl)
  const firstSavePath = resize ? tmpPath : destPath

  if (!data) {
    throw Error(`The file could not be downloaded at path ${fileUrl}`)
  }

  // SAVING (TMP) FILE
  logIndented(`💾 Saving file into: ${firstSavePath}`)
  await fs.writeFile(firstSavePath, data)
  logIndented(`🛟 Saved ✔️`)

  if (!resize) return

  // RESIZING FILE
  logIndented(`📐 Resizing (${resize?.width}x${resize?.height})`)
  await resizeImage(tmpPath, destPath, resize)
  logIndented(`✅ Saved and resized!`, 1)
  await fs.unlink(tmpPath)
}
