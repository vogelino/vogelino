import { z } from 'zod'
import {
	NotionBasicTextSchema,
	NotionBlockSchema,
	NotionDatabaseCheckboxSchema,
	NotionDatabaseFilesSchema,
	NotionDatabaseNumberSchema,
	NotionDatabaseRelationSchema,
	NotionPageSchema,
} from 'notion-api-zod-schema'

export const OriginalProjectSchema = NotionPageSchema.extend({
	properties: z.object({
		Quote: NotionRelationSchema,
		isActual: NotionFormulaSchema,
		'Highlight in Portfolio': NotionCheckboxSchema,
		Year: NotionDatabaseNumberSchema,
		Thumbnail: NotionDatabaseFilesSchema,
		// ClientID: NotionRollupSchema,
		'In collaboration with': NotionDatabaseRelationSchema,
		'Show in Portfolio': NotionDatabaseCheckboxSchema,
		Invoice: NotionDatabaseRelationSchema,
		Client: NotionDatabaseRelationSchema,
		Illustration: NotionDatabaseFilesSchema,
		ID: NotionBasicTextSchema,
		'Made for': NotionRelationSchema,
		'Long-ID': NotionFormulaSchema,
		Type: NotionSelectSchema,
		Tags: NotionMultiSelectSchema,
		'Created Time': NotionTimeSchema,
		URL: NotionUrlSchema,
		BgImage: NotionFilesSchema,
		Name: NotionTitleSchema,
		NameShort: NotionRichTextSchema,
		'Supervised by': NotionRelationSchema,
	}),
})
export type OriginalProjectType = z.infer<typeof OriginalProjectSchema>

export const ProjectSchema = z.object({
	id: z.string(),
	title: z.string(),
	nameShort: z.string().optional(),
	description: z.array(NotionTextSchema),
	type: z.string(),
	slug: z.string(),
	thumbnail: z.string(),
	illustration: z.string(),
	bgImage: z.string(),
	year: z.number(),
	url: z.string().optional(),
	collaborators: z.array(CollaboratorSchema),
	colleagues: z.array(CollaboratorSchema),
	supervisors: z.array(CollaboratorSchema),
	institutions: z.array(CollaboratorSchema),
	clients: z.array(CollaboratorSchema),
	highlighted: z.boolean(),
	blocks: z.array(NotionBlockSchema),
	media: z.array(z.string()),
})
export type ProjectType = z.infer<typeof ProjectSchema>
