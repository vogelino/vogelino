import { z } from 'zod'
import {
	NotionDatabaseFilesSchema,
	NotionDatabaseRelationSchema,
	NotionDatabaseTitleSchema,
	NotionDatabaseUrlSchema,
	NotionPageSchema,
} from 'notion-api-zod-schema'

export const OriginalCollaboratorSchema = NotionPageSchema.extend({
	properties: z.object({
		'Made @': NotionDatabaseRelationSchema,
		'Supervised by': NotionDatabaseRelationSchema,
		'In collaboration with': NotionDatabaseRelationSchema,
		URL: NotionDatabaseUrlSchema,
		'Made with': NotionDatabaseRelationSchema,
		Avatar: NotionDatabaseFilesSchema,
		Name: NotionDatabaseTitleSchema,
	}),
})

export const CollaboratorSchema = z.object({
	id: z.string(),
	name: z.string(),
	url: z.string().url(),
	avatar: z.string(),
})
export type CollaboratorType = z.infer<typeof CollaboratorSchema>
