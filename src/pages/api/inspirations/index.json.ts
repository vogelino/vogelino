import type { APIRoute } from "astro";
import { getParsedInspirations } from "../../inspirations/[...page].astro";

export const GET: APIRoute = async ({ site }) => {
  const inspirations = await getParsedInspirations();

  return new Response(
    JSON.stringify(
      inspirations.map((i) => ({
        ...i,
        thumbnail: i.thumbnail
          ? `${site}${i.thumbnail.src}`.replaceAll("//", "/")
          : null,
        favicon: i.favicon
          ? `${site}${i.favicon.src}`.replaceAll("//", "/")
          : null,
      }))
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
