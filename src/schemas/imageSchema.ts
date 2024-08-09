import { z } from 'zod'

export const imageSchema = z
	.object({
		src: z.string(),
		width: z.number(),
		height: z.number(),
		format: z.enum(['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg']),
		orientation: z.number().optional(),
	})
	.optional()
