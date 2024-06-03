import { z } from 'zod'

const imageSchema = z
	.object({
		src: z.string(),
		width: z.number(),
		height: z.number(),
		format: z.enum(['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg']),
		orientation: z.number().optional(),
	})
	.optional()

export const inspirationSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string().url(),
	thumbnail: imageSchema,
	favicon: imageSchema,
	date: z.string(),
	tags: z.string().array().default([]),
})
export type InspirationType = z.infer<typeof inspirationSchema>
