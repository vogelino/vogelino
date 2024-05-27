import { z } from 'zod'

export const inspirationSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string().url(),
	thumbnail: z.object({
		src: z.string(),
		width: z.number(),
		height: z.number(),
		format: z.enum(['jpeg', 'png', 'webp', 'avif', 'svg']),
		orientation: z.number().optional(),
	}),
	date: z.string(),
})
export type InspirationType = z.infer<typeof inspirationSchema>
