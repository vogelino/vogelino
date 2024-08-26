import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import critters from "@playform/inline";
import sentry from "@sentry/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
    critters(),
    sentry({
      dsn: process.env.SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: "vogelino-portfolio",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    solidJs(),
  ],
  prefetch: true,
  output: "static",
  site:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4321"
      : "https://vogelino.com",
  redirects: {
    "/inspirations/[...page]": "/cool-sites/[...page]",
    "/inspirations/[id]": "/cool-sites/[id]",
    "/api/inspirations.json": "/api/cool-sites.json",
    "/api/inspirations/[id].json": "/api/cool-sites/[id].json",
    "/rss-inspirations-only.xml": "/rss-cool-sites-only.xml",
  },
});
