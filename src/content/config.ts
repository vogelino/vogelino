import { defineCollection, reference, z } from "astro:content";

const collaboratorSchema = z.object({
  name: z.string(),
  url: z.string().url().optional().nullable(),
  avatarFormat: z.string().default("webp"),
});
export type CollaboratorType = z.infer<typeof collaboratorSchema>;

const technologySchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string().url().optional().nullable(),
  categories: z.array(z.string()),
});
export type TechnologyType = z.infer<typeof technologySchema>;

const projectSchema = z.object({
  title: z.string(),
  nameShort: z.string().optional().nullable(),
  description: z.string(),
  type: z.string(),
  year: z.number(),
  pubDate: z.coerce.date(),
  url: z.string().url().nullable().optional(),
  repo: z.string().url().nullable().optional(),
  links: z
    .array(
      z.object({
        url: z.string(),
        label: z.string(),
      })
    )
    .optional()
    .default([]),
  collaborators: z.array(reference("collaborators")).default([]),
  colleagues: z.array(reference("collaborators")).default([]),
  supervisors: z.array(reference("collaborators")).default([]),
  institutions: z.array(reference("collaborators")).default([]),
  clients: z.array(reference("collaborators")).default([]),
  technologies: z.array(reference("technologies")).default([]),
  highlighted: z.boolean().default(false),
  media: z.array(z.string()).default([]),
});
export type ProjectType = z.infer<typeof projectSchema>;

const ceramicSchema = z.object({
  name: z.string(),
});
export type CeramicType = z.infer<typeof ceramicSchema>;

const experimentSchema = z.object({
  name: z.string(),
});
export type ExperimentType = z.infer<typeof experimentSchema>;

const projects = defineCollection({
  type: "content",
  schema: projectSchema,
});

const collaborators = defineCollection({
  type: "content",
  schema: collaboratorSchema,
});

const technologies = defineCollection({
  type: "content",
  schema: technologySchema,
});

const experiments = defineCollection({
  type: "content",
  schema: experimentSchema,
});

const ceramics = defineCollection({
  type: "content",
  schema: ceramicSchema,
});

export const collections = {
  projects,
  collaborators,
  technologies,
  experiments,
  ceramics,
};
