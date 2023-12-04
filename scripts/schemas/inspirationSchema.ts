import { z } from 'zod'
import {
	NotionDatabaseCreatedTimeSchema,
	NotionDatabaseMultiSelectSchema,
	NotionDatabaseTitleSchema,
	NotionDatabaseUrlSchema,
	NotionPageSchema,
} from 'notion-api-zod-schema'

export const OriginalInspirationLinkSchema = NotionPageSchema.extend({
	properties: z.object({
		Created: NotionDatabaseCreatedTimeSchema,
		URL: NotionDatabaseUrlSchema,
		Tags: NotionDatabaseMultiSelectSchema,
		Name: NotionDatabaseTitleSchema,
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
