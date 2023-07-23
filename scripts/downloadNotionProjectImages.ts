import type { MappedNotionProject } from './lib/parseOriginalNotionProjects'
import type { RawNotionProjectType } from './lib/getOriginalNotionProjects'
import * as dotenv from 'dotenv'
dotenv.config()
import { doesFileExists } from './lib/doesFileExist'
import { downloadImage } from './lib/downloadImage'
import { log, logEnd, logH1, logIndented, logSecondary } from './lib/logUtil'
import { resizeImage } from './lib/resizeImage'
import { getNotionPageContentImages } from './lib/getNotionPageContentImages'
import fs from 'node:fs/promises'
import {
  BG_IMAGEs_RESIZED_EXPORT_PATH,
  CONTENT_RESIZED_EXPORT_PATH,
  IMAGE_TMP_EXPORT_PATH,
  ORIGINAL_PROJECTS_JSON_PATH,
  PROJECTS_JSON_PATH,
  THUMBNAILS_RESIZED_EXPORT_PATH,
  MEDIA_RESIZED_EXPORT_PATH,
} from './paths'
import { createDirectoriesIfNotAlreadyThere } from './lib/createDirectoriesIfNotAlreadyThere'
import { loadJson } from './lib/loadJson'
import parseNotionImageName from './lib/parseNotionImageName'

const WIDTH = 1440
const HEIGHT = 960

const databaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID || ''

async function downloadNotionProjectImages() {
  logH1(`Downloading all project images from Notion`)

  log(`databaseId: ${databaseId}`)
  const parsedProjects = await loadJson<MappedNotionProject[]>(
    PROJECTS_JSON_PATH,
  )
  const originalProjects = await loadJson<RawNotionProjectType[]>(
    ORIGINAL_PROJECTS_JSON_PATH,
  )

  for (const projectIdx in parsedProjects) {
    const { id, slug, media } = parsedProjects[projectIdx]
    const contentImages = await getNotionPageContentImages(id)
    const originalProject = originalProjects[projectIdx]
    const thumbnail = originalProject.properties.Thumbnail.files[0].file?.url
    const bgImage = originalProject.properties.BgImage.files[0].file?.url
    const mediaImages = originalProject.properties.Media.files

    if (!thumbnail) throw new Error(`Project "${slug}" has no thumbnail`)
    if (!bgImage) throw new Error(`Project "${slug}" has no background image`)
    if (mediaImages.length === 0) throw new Error(`Project "${slug}" has no media images`)

    logSecondary([`Downloading images for page "${slug}"`])
    logIndented(`📝 Content images:`)

    // MAKE SURE DIRECTORIES EXIST
    await createDirectoriesIfNotAlreadyThere(IMAGE_TMP_EXPORT_PATH)
    await createDirectoriesIfNotAlreadyThere(THUMBNAILS_RESIZED_EXPORT_PATH)
    await createDirectoriesIfNotAlreadyThere(BG_IMAGEs_RESIZED_EXPORT_PATH)
    await createDirectoriesIfNotAlreadyThere(CONTENT_RESIZED_EXPORT_PATH)
    await createDirectoriesIfNotAlreadyThere(MEDIA_RESIZED_EXPORT_PATH)

    // CHECK FOR EXISTING DESTINATION FILE FOR THUMBNAIL
    const thumbResizeDest = `${THUMBNAILS_RESIZED_EXPORT_PATH}/${slug}.webp`
    const destThumbFileAlreadyExist = await doesFileExists(thumbResizeDest)

    // CHECK FOR EXISTING DESTINATION FILE FOR BG IMAGE
    const bgResizeDest = `${BG_IMAGEs_RESIZED_EXPORT_PATH}/${slug}.webp`
    const destBgFileAlreadyExist = await doesFileExists(bgResizeDest)

    // CHECK FOR EXISTING DESTINATION FILE FOR MEDIA
    for (let imageIdx in mediaImages) {
      const image = mediaImages[imageIdx]
      const mediaName = parseNotionImageName(image, +imageIdx)
      const mediaTmpDest = `${IMAGE_TMP_EXPORT_PATH}/${mediaName}`
      const mediaResizedDest = `${MEDIA_RESIZED_EXPORT_PATH}/${mediaName}`
      const mediaFileAlreadyExist = await doesFileExists(mediaTmpDest)

      if (mediaFileAlreadyExist || !image.file) {
        logIndented(`⏭ Skipping (already exists)`)
        continue;
      }

      // DOWNLOAD
      const { data } = await downloadImage(image.file.url)

      // SAVING LARGE FILE
      logIndented(`💾 Saving file into: ${mediaTmpDest}`)
      await fs.writeFile(mediaTmpDest, data)
      logIndented(`🛟 Saved ✔️`)

      // RESIZING FILE
      logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`)
      await resizeImage(mediaTmpDest, mediaResizedDest, {
        height: HEIGHT,
        withoutEnlargement: true,
        withoutReduction: false,
      })
      logIndented(`✅ Success!`, 1)
      await fs.unlink(mediaTmpDest)
    }

    if (destThumbFileAlreadyExist) {
      logIndented(`⏭ Skipping (already exists)`)
    } else {
      // DOWNLOAD
      const { imageExt, data } = await downloadImage(thumbnail)
      const destPath = `${IMAGE_TMP_EXPORT_PATH}/${slug}.${imageExt}`

      // SAVING LARGE FILE
      logIndented(`💾 Saving file into: ${destPath}`)
      await fs.writeFile(destPath, data)
      logIndented(`🛟 Saved ✔️`)

      // RESIZING FILE
      logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`)
      await resizeImage(destPath, thumbResizeDest, {
        width: WIDTH,
        height: HEIGHT,
        position: 'top',
      })
      logIndented(`✅ Success!`, 1)
      await fs.unlink(destPath)
    }

    if (destBgFileAlreadyExist) {
      logIndented(`⏭ Skipping (already exists)`)
    } else {
      // DOWNLOAD
      const { imageExt, data } = await downloadImage(bgImage)
      const destPath = `${IMAGE_TMP_EXPORT_PATH}/${slug}.${imageExt}`

      // SAVING LARGE FILE
      logIndented(`💾 Saving file into: ${destPath}`)
      await fs.writeFile(destPath, data)
      logIndented(`🛟 Saved ✔️`)

      // RESIZING FILE
      logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`)
      await resizeImage(destPath, bgResizeDest, {
        width: WIDTH,
        height: HEIGHT,
        position: 'center',
      })
      logIndented(`✅ Success!`, 1)
      await fs.unlink(destPath)
    }

    for (const contentImg of contentImages) {
      // CHECK FOR EXISTING DESTINATION FILE FOR BG IMAGE
      const contentImgDest = `${CONTENT_RESIZED_EXPORT_PATH}/${contentImg.name}.webp`
      const contentImgAlreadyExist = await doesFileExists(contentImgDest)

      if (contentImgAlreadyExist) {
        logIndented(`⏭ Skipping (already exists)`)
      } else {
        // DOWNLOAD
        const { imageExt, data } = await downloadImage(contentImg.url)
        const contentImgOriginalPath = `${IMAGE_TMP_EXPORT_PATH}/${slug}.${imageExt}`

        // SAVING LARGE FILE
        logIndented(`💾 Saving file into: ${contentImgOriginalPath}`)
        await fs.writeFile(contentImgOriginalPath, data)
        logIndented(`🛟 Saved ✔️`)

        // RESIZING FILE
        logIndented(`📐 Resizing (${WIDTH}x${HEIGHT})`)
        await resizeImage(contentImgOriginalPath, contentImgDest, {
          width: WIDTH,
          withoutEnlargement: true,
        })
        logIndented(`✅ Success!`, 1)
        await fs.unlink(contentImgOriginalPath)
      }
    }
  }

  logEnd()
  process.exit()
}

downloadNotionProjectImages()
