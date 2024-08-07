import type { AstroGlobImageType } from "./astroTypes";

export function getOgImage(slug: string) {
  const images = parseImagesForSlug(
    slug,
    import.meta.glob<AstroGlobImageType<"png">>(`/src/assets/images/og/*.png`, {
      eager: true,
    })
  );
  return images[0];
}

export function getProjectThumnnail(slug: string) {
  const images = parseImagesForSlug(
    slug,
    import.meta.glob<AstroGlobImageType<"png">>(
      `/src/assets/images/thumbnails/*.png`,
      {
        eager: true,
      }
    )
  );
  return images[0];
}

export function getCollaborationImage(slug: string) {
  const images = parseImagesForSlug(
    slug,
    import.meta.glob<AstroGlobImageType<"png">>(
      `/src/assets/images/collaborators/*.*`,
      {
        eager: true,
      }
    )
  );
  return images[0];
}

export function getProjectImages(slug: string) {
  return parseImagesForSlug(
    slug,
    import.meta.glob<AstroGlobImageType<"png">>(
      `/src/assets/images/projects-media/*.webp`,
      {
        eager: true,
      }
    )
  );
}

export function getTechnologyImage(slug: string) {
  const images = parseImagesForSlug(
    slug,
    import.meta.glob<AstroGlobImageType<"png">>(
      `/src/assets/images/technologies/*.svg`,
      {
        eager: true,
      }
    )
  );
  return images[0];
}

export function getMediaShelfImages(slug: string) {
  const images = parseImagesForSlug(
    slug,
    import.meta.glob<AstroGlobImageType<"webp">>(
      "/src/assets/images/media-shelf/*.webp",
      {
        eager: true,
      }
    )
  );
  return images[0];
}

export function getCoolSiteImages(slug: string) {
  const thumbnails = parseImagesForSlug(
    slug,
    import.meta.glob<AstroGlobImageType<"webp">>(
      "/src/assets/images/cool-sites/*.webp",
      {
        eager: true,
      }
    )
  );
  const favicons = parseImagesForSlug(
    slug,
    import.meta.glob<AstroGlobImageType<"webp">>(
      "/src/assets/images/cool-sites-favicons/*.webp",
      {
        eager: true,
      }
    )
  );
  return {
    thumbnail: thumbnails[0],
    favicon: favicons[0],
  };
}

function parseImagesForSlug(
  slug: string,
  images: Record<
    string,
    AstroGlobImageType<"jpg" | "png" | "jpeg" | "webp" | "avif" | "svg">
  >
) {
  return Object.entries(images)
    .filter(([url]) => url.includes(slug))
    .map(([_, { default: image }]) => image);
}
