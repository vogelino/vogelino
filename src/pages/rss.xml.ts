import type { APIContext } from "astro";
import { createRSSFeed } from "../utils/rssUtil";

export async function GET(context: APIContext) {
  return createRSSFeed(context, {
    showCoolSites: true,
    showProjects: true,
    showPages: true,
  });
}
