import type {
	NotionImageType,
	NotionRelationType,
	NotionTextType,
	RawNotionProjectWithBlocksType,
} from './getOriginalNotionProjects'
import fetch from 'node-fetch'
import type { RawNotionCollaboratorType } from './getOriginalNotionCollaborators'
import slugify from 'slugify'
import { contentTypeToImgExtension } from './contentTypeToImgExtension'
import { parseNotionFileUrl } from './parseNotionFileUrl'
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import parseNotionImageName from './parseNotionImageName'
import { RawNotionTechnologyType } from './getOriginalNotionTechnologies'

export interface MappedCollaboratorPageType {
	id: string
	name: string
	url?: string
	avatar?: string
}

export interface MappedTechnologyPageType {
	id: string
	name: string
	description?: string
	categories: string[]
	url?: string
	logo?: string
}

export type MappedNotionTextContentsType = {
	text: null | string
	link: null | string
	highlighted: boolean
}[]

export interface MappedNotionProject extends Record<string, unknown> {
	id: string
	title: string
	nameShort: null | string
	description: NotionTextType[]
	type: string
	slug: string
	thumbnail: string
	illustration: string
	year: number
	url: null | string
	clients: MappedCollaboratorPageType[]
	collaborators: MappedCollaboratorPageType[]
	supervisors: MappedCollaboratorPageType[]
	colleagues: MappedCollaboratorPageType[]
	institutions: MappedCollaboratorPageType[]
	technologies: Record<string, MappedTechnologyPageType[]>
	highlighted: boolean
	blocks: BlockObjectResponse[]
	media: string[]
}

export async function parseOriginalNotionProjects(
	originalProjects: RawNotionProjectWithBlocksType[],
	originalCollaborators: RawNotionCollaboratorType[],
	originalTechnologies: RawNotionTechnologyType[],
): Promise<MappedNotionProject[]> {
	const allCollaboratorPagesWithUrls = await getCollaboratorsImages(
		originalCollaborators,
	)
	const allTechnologiesWithUrls = await getTechnologiesImages(
		originalTechnologies,
	)
	return originalProjects.map((p) =>
		mapOriginalNotionProject(
			p,
			allCollaboratorPagesWithUrls,
			allTechnologiesWithUrls,
		),
	)
}

function mapOriginalNotionProject(
	rawProject: RawNotionProjectWithBlocksType,
	rawCollaborators: RawNotionCollaboratorType[],
	rawTechnologies: RawNotionTechnologyType[],
): MappedNotionProject {
	const { Name, NameShort, Description, Type, Year, URL, Media } =
		rawProject.properties
	const fullTitle = Name.title.map(({ plain_text }) => plain_text).join('')
	const nameShort = NameShort.rich_text
		.map(({ text }) => text?.content)
		.join(' ')
	const slug = slugify(nameShort || fullTitle, {
		lower: true,
		strict: true,
		trim: true,
		remove: /\./gi,
	})

	const type = Type.select.name
	const description = Description.rich_text
	const highlighted = !!rawProject.properties['Highlight in portfolio'].checkbox

	const thumbnail = `/images/thumbnails/${slug}.webp`
	const illustration = `/images/illustration/${slug}.webp`
	const getRelationIds = getRealtionExtractor(rawProject)
	const collaboratorsIds = getRelationIds('In collaboration with')
	const technologiesIds = getRelationIds('Technologies')
	const supervisorsIds = getRelationIds('Supervised by')
	const colleaguesIds = getRelationIds('Made With')
	const institutionsIds = getRelationIds('Made @')
	const clientsIds = getRelationIds('Made for')
	return {
		id: rawProject.id,
		title: fullTitle,
		nameShort,
		description,
		type,
		slug,
		thumbnail,
		illustration,
		year: Year.number,
		url: URL.url,
		collaborators: mapNotionCollaborators(rawCollaborators, collaboratorsIds),
		colleagues: mapNotionCollaborators(rawCollaborators, colleaguesIds),
		supervisors: mapNotionCollaborators(rawCollaborators, supervisorsIds),
		institutions: mapNotionCollaborators(rawCollaborators, institutionsIds),
		clients: mapNotionCollaborators(rawCollaborators, clientsIds),
		technologies: mapNotionTechnologies(rawTechnologies, technologiesIds),
		highlighted,
		blocks: rawProject.properties.blocks,
		media: mapNotionMedia(Media.files, slug),
	}
}

function mapNotionMedia(media: NotionImageType[], slug: string) {
	return media.map((image, idx) =>
		parseNotionImageName(image, idx, slug).replace(/\.webp$/, ''),
	)
}

function getRealtionExtractor(rawProject: RawNotionProjectWithBlocksType) {
	return (key: string): string[] =>
		(
			rawProject.properties[
				key as keyof typeof rawProject.properties
			] as NotionRelationType
		).relation.map(({ id }) => id)
}

function mapNotionCollaborators(
	allCollaboratorPages: RawNotionCollaboratorType[],
	ids: string[],
): MappedCollaboratorPageType[] {
	return ids.reduce((acc, id) => {
		const collaborator = allCollaboratorPages.find((p) => p.id === id)
		if (!collaborator) return acc
		return [...acc, mapNotionCollaborator(collaborator)]
	}, [] as MappedCollaboratorPageType[])
}

function mapNotionTechnologies(
	allTechnologiesPages: RawNotionTechnologyType[],
	ids: string[],
): Record<string, MappedTechnologyPageType[]> {
	const technologies = ids.reduce((acc, id) => {
		const technology = allTechnologiesPages.find((p) => p.id === id)
		if (!technology) return acc
		return [...acc, mapNotionTechnology(technology)]
	}, [] as MappedTechnologyPageType[])
	const allCategories = technologies.reduce((acc, { categories }) => {
		categories.forEach((cat) => acc.add(cat))
		return acc
	}, new Set<string>())
	const sortedCategories = Array.from(allCategories).sort((a, b) =>
		a.localeCompare(b),
	)
	return sortedCategories.reduce((acc, cat) => {
		return {
			...acc,
			[cat]: technologies
				.filter(({ categories }) => categories.includes(cat))
				.sort((a, b) => a.name.localeCompare(b.name)),
		}
	}, {} as Record<string, MappedTechnologyPageType[]>)
}

function mapNotionCollaborator(
	col: RawNotionCollaboratorType,
): MappedCollaboratorPageType {
	return {
		id: col.id,
		name: col.properties.Name.title
			.map(({ plain_text }) => plain_text)
			.join(''),
		url: col.properties.URL.url || undefined,
		avatar: parseNotionFileUrl(col.properties.Avatar),
	}
}

function mapNotionTechnology(
	col: RawNotionTechnologyType,
): MappedTechnologyPageType {
	return {
		id: col.id,
		name: col.properties.Name.title
			.map(({ plain_text }) => plain_text)
			.join(''),
		description: col.properties.Description.rich_text
			.map(({ plain_text }) => plain_text)
			.join(''),
		categories: col.properties.Categories.multi_select.map(({ name }) => name),
		url: col.properties.URL.url || undefined,
		logo:
			!col.icon || !('external' in col.icon) || !col.icon.file?.url
				? undefined
				: col.icon.file.url,
	}
}

async function getCollaboratorsImages(
	allCollaboratorPages: RawNotionCollaboratorType[],
): Promise<RawNotionCollaboratorType[]> {
	const mappedPagesPromises = allCollaboratorPages.map(async (col) => {
		const url = parseNotionFileUrl(col.properties.Avatar)
		if (!url) return false
		try {
			const imageExt = await getImageWithExtension(url)
			const imageUrl = `/images/collaborators/${col.id}.${imageExt}`

			return {
				...col,
				properties: {
					...col.properties,
					Avatar: {
						files: [
							{
								external: {
									url: imageUrl,
								},
							},
						],
					},
				},
			}
		} catch (err) {
			console.log(url)
			console.log(err)

			return false
		}
	})
	const mappedPages = await Promise.all(mappedPagesPromises)
	return mappedPages.filter(Boolean) as unknown as RawNotionCollaboratorType[]
}

async function getTechnologiesImages(
	allTechnologiesPages: RawNotionTechnologyType[],
): Promise<RawNotionTechnologyType[]> {
	const mappedPagesPromises = allTechnologiesPages.map(async (col) => {
		if (!col.icon || !('file' in col.icon) || !col.icon.file?.url) return false
		const url = col.icon.file.url
		try {
			const imageExt = await getImageWithExtension(url)
			const imageUrl = `/images/technologies/${col.id}.${imageExt}`

			return {
				...col,
				icon: {
					...col.icon,
					external: {
						url: imageUrl,
					},
				},
			}
		} catch (err) {
			console.log(url)
			console.log(err)

			return false
		}
	})
	const mappedPages = await Promise.all(mappedPagesPromises)
	return mappedPages.filter(Boolean) as unknown as RawNotionTechnologyType[]
}

async function getImageWithExtension(url: string): Promise<string> {
	const response = await fetch(url)
	const contentType = response.headers.get('content-type')
	const originalImageExt = contentTypeToImgExtension(contentType)
	const imageExt = originalImageExt === 'svg' ? 'svg' : 'webp'
	return imageExt
}
