import type { APIRoute } from "astro";
import { getParsedInspirations } from "../../inspirations/[...page].astro";

export async function getStaticPaths() {
  const inspirations = await getParsedInspirations();
  return inspirations.map((i) => ({ params: { id: i.id } }));
}

export const GET: APIRoute = async ({ params, site }) => {
  const inspirations = await getParsedInspirations();
  const inspiration = inspirations.find((i) => i.id === params.id);

  if (!inspiration) return new Response("Not found", { status: 404 });

  return new Response(
    JSON.stringify({
      ...inspiration,
      thumbnail: inspiration.thumbnail
        ? `${site}${inspiration.thumbnail.src}`.replaceAll("//", "/")
        : null,
      favicon: inspiration.favicon
        ? `${site}${inspiration.favicon.src}`.replaceAll("//", "/")
        : null,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
