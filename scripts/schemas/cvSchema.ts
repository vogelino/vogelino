import { z } from 'zod'
import {
	NotionColorSchema,
	NotionTextSchema,
	NotionUserSchema,
} from 'notion-api-zod-schema'

export const OriginalCvRowSchema = z.object({
	object: z.literal('page'),
	id: z.string(),
	created_time: z.string(),
	last_edited_time: z.string(),
	created_by: NotionUserSchema,
	last_edited_by: NotionUserSchema,
	cover: z.string().nullable(),
	icon: z.string().nullable(),
	parent: z.object({
		type: z.enum(['page_id', 'database_id']),
		database_id: z.string().nullable(),
		page_id: z.string().nullable(),
	}),
	archived: z.boolean(),
	properties: z.object({
		timePeriod: z.object({
			id: z.string(),
			type: z.literal('rich_text'),
			rich_text: z.array(NotionTextSchema),
		}),
		certification: z.object({
			id: z.string(),
			type: z.literal('rich_text'),
			rich_text: z.array(NotionTextSchema),
		}),
		location: z.object({
			id: z.string(),
			type: z.literal('rich_text'),
			rich_text: z.array(NotionTextSchema),
		}),
		category: z.object({
			id: z.string(),
			type: z.literal('select'),
			select: z.object({
				id: z.string(),
				name: z.string(),
				color: NotionColorSchema,
			}),
		}),
		title: z.object({
			id: z.string(),
			type: z.literal('title'),
			title: z.array(NotionTextSchema),
		}),
	}),
	url: z.string().nullable(),
	public_url: z.string().nullable(),
})
export type OriginalCvRowType = z.infer<typeof OriginalCvRowSchema>

export const OriginalCvSchema = z.array(OriginalCvRowSchema)
export type OriginalCvType = z.infer<typeof OriginalCvSchema>

const CvRowSchema = z.object({
	id: z.string(),
	title: z.array(NotionTextSchema),
	timePeriod: z.array(NotionTextSchema),
	certification: z.array(NotionTextSchema),
	location: z.array(NotionTextSchema),
	category: z.enum(['work', 'education', 'teaching', 'internships']),
})
export type CvRowType = z.infer<typeof CvRowSchema>

export const CvSchema = z.object({
	work: z.array(CvRowSchema),
	education: z.array(CvRowSchema),
	teaching: z.array(CvRowSchema),
	internships: z.array(CvRowSchema),
})
