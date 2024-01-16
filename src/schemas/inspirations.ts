import { z } from 'zod'

export const inspirationSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string().url(),
	thumbnail: z.string(),
})
export type InspirationType = z.infer<typeof inspirationSchema>
