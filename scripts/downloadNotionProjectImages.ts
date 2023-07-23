import type { MappedNotionProject } from './lib/parseOriginalNotionProjects'
import type { RawNotionProjectType } from './lib/getOriginalNotionProjects'
import * as dotenv from 'dotenv'
dotenv.config()
import { log, logEnd, logH1, logIndented, logSecondary } from './lib/logUtil'
import { getNotionPageContentImages } from './lib/getNotionPageContentImages'
import {
  ORIGINAL_PROJECTS_JSON_PATH,
  PROJECTS_JSON_PATH,
} from './paths'
import { loadJson } from './lib/loadJson'
import parseNotionImageName from './lib/parseNotionImageName'
import { saveAndResizeImage } from './lib/saveAndResizeImage'

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
    const illustration = originalProject.properties.Illustration.files[0].file?.url
    const bgImage = originalProject.properties.BgImage.files[0].file?.url
    const mediaImages = originalProject.properties.Media.files

    if (mediaImages.length === 0) throw new Error(`Project "${slug}" has no media images`)

    logSecondary([`Downloading images for page "${slug}"`])
    logIndented(`📝 Content images:`)

    // THUMBNAIL
    await saveAndResizeImage({
      fileUrl: thumbnail,
      fileName: `${slug}.webp`,
      folder: `thumbnails`,
      resize: {
        width: WIDTH,
        height: HEIGHT,
        position: 'top',
      }
    })

    // ILLUSTRATION
    await saveAndResizeImage({
      fileUrl: illustration,
      fileName: `${slug}.webp`,
      folder: `illustrations`,
    })

    // BG IMAGE
    await saveAndResizeImage({
      fileUrl: bgImage,
      fileName: `${slug}.webp`,
      folder: `bg-images`,
      resize: {
        width: WIDTH,
        height: HEIGHT,
        position: 'center',
      }
    })

    // SLIDER IMAGES
    for (let imageIdx in mediaImages) {
      const image = mediaImages[imageIdx]
      const mediaName = parseNotionImageName(image, +imageIdx)

      if (!image.file) {
        logIndented(`⏭ Skipping (already exists)`)
        continue;
      }

      await saveAndResizeImage({
        fileUrl: image.file.url,
        fileName: mediaName,
        folder: `projects-media`,
        resize: {
          height: HEIGHT,
          withoutEnlargement: true,
          withoutReduction: false,
        }
      })
    }

    // CONTENT IMAGES
    for (const contentImg of contentImages) {
      await saveAndResizeImage({
        fileUrl: contentImg.url,
        fileName: `${contentImg.name}.webp`,
        folder: `content`,
        resize: {
          width: WIDTH,
          withoutEnlargement: true,
        }
      })
    }
  }

  logEnd()
  process.exit()
}

downloadNotionProjectImages()
