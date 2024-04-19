import { Content, frontmatter } from '../content/content/about.mdx'
import { z } from 'astro:content'

const cvLineSchema = z.object({
	title: z.string(),
	timePeriod: z.string(),
	certification: z.string().optional().nullable(),
	location: z.string(),
})

const aboutSchema = z.object({
	basicInfo: z.record(z.string()),
	profiles: z.object({
		github: z.string().url(),
		linkedin: z.string().url(),
		dribbble: z.string().url(),
	}),
	cvPdfs: z.array(
		z.object({
			label: z.string(),
			code: z.string().length(2),
		})
	),
	cv: z.object({
		work: z.array(cvLineSchema),
		education: z.array(cvLineSchema),
		teaching: z.array(cvLineSchema),
		internships: z.array(cvLineSchema),
	}),
})
export type AboutFrontmatter = z.infer<typeof aboutSchema>

export const aboutFrontmatter = aboutSchema.parse(frontmatter)
export const AboutContent = Content
