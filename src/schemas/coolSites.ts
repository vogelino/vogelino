import { z } from "zod";
import { imageSchema } from "./imageSchema";

export const coolSiteSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  thumbnail: imageSchema,
  favicon: imageSchema,
  date: z.string(),
  tags: z.string().array().default([]),
});
export type CoolSiteType = z.infer<typeof coolSiteSchema>;
