import { z } from "zod";
import { imageSchema } from "./imageSchema";

export const mediaShelfSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  thumbnail: imageSchema.optional(),
  date: z.string(),
  tags: z.string().array().default([]),
  type: z.enum(["video", "book", "article", "podcast", "course"]),
});
export type MediaShelfType = z.infer<typeof mediaShelfSchema>;
