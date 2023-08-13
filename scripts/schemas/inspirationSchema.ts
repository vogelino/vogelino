import { z } from 'zod'
import {
	NotionMultiSelectSchema,
	NotionPageSchema,
	NotionTimeSchema,
	NotionTitleSchema,
	NotionUrlSchema,
} from 'notion-api-zod-schema'

export const OriginalInspirationLinkSchema = NotionPageSchema.extend({
	properties: z.object({
		Created: NotionTimeSchema,
		URL: NotionUrlSchema,
		Tags: NotionMultiSelectSchema,
		Name: NotionTitleSchema,
	}),
})

export const InspirationSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string().url(),
	thumbnail: z.string(),
	icon: z.string().url(),
})
export type InspirationType = z.infer<typeof InspirationSchema>
