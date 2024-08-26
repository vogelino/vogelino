import { type ContentEntryMap, getCollection, getEntry } from 'astro:content'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import type { APIContext } from 'astro'
import { marked } from 'marked'
import type { AstroGlobImageType, AstroImageType } from '../utils/astroTypes'
import { getParsedCoolSites } from './getParsedCoolSites'
import {
	getCollaborationImage,
	getOgImage,
	getProjectImages,
	getProjectThumnnail,
	getTechnologyImage,
} from './imageUtil'

function stripMarkdown(str: string) {
	return str
		.replace('..', '.')
		.replaceAll('*', '')
		.replaceAll(/\[(.+)\]\(.+\)/gi, '$1')
		.replaceAll(/&.*?;/gi, '')
}

export async function createRSSFeed(
	context: APIContext,
	options: {
		showCoolSites: boolean
		showProjects: boolean
		showPages: boolean
		title?: string
		description?: string
	}
) {
	const site = context.site?.toString().replace(/\/$/, '') || `https://vogelino.com`
	const ogImages = Object.entries(
		import.meta.glob<AstroGlobImageType<'png'>>('/src/assets/images/og/*.png', {
			eager: true,
		})
	).map(([url, { default: image }]) => ({ url, image }))

	const ogHome = ogImages.find((file) => file.url.includes('home'))?.image
	const ogCoolSites = ogImages.find((file) => file.url.includes('cool-sites'))?.image
	const ogAbout = ogImages.find((file) => file.url.includes('about'))?.image
	return rss({
		title: options.title || "Vogelino – Lucas Vogel's multimedia portfolio",
		description: `${
			options.description || 'Interface design and development portfolio of Lucas Vogel'
		}
      There are currently the following RSS Feeds available:
      <ul>
        <li>All contents RSS feed: ${site}/rss.xml</li>
        <li>Only pages RSS feed: ${site}/rss-pages-only.xml</li>
        <li>Only projects RSS feed: ${site}/rss-projects-only.xml</li>
        <li>Only cool-sites RSS feed: ${site}/rss-cool-sites-only.xml</li>
      </ul>
      `,
		site,
		xmlns: {
			content: 'http://purl.org/rss/1.0/modules/content/',
			webfeeds: 'http://webfeeds.org/rss/1.0',
		},
		customData: `
		${ogHome && `<webfeeds:cover image="${site}${ogHome.src}" />`}
		<webfeeds:icon>${site}/apple-touch-icon.png</webfeeds:icon>
		<webfeeds:logo>${site}/safari-pinned-tab.svg</webfeeds:logo>
		<webfeeds:accentColor>E30002</webfeeds:accentColor>
		<webfeeds:related layout=”card” target=”browser”/>
		`,
		items: [
			...(options.showPages
				? [
						{
							title: 'Cool websites that I like...',
							description:
								'Discover my curated list (or dump) of websites that I find inspirational. It can be a website that has a great design, which is well developed, has captivating content or a fun concept.',
							pubDate: new Date('2023-10-01'),
							link: '/cool-sites',
							enclosure: getEnclosureByImage(site, ogCoolSites),
						},
						{
							title: "Website release! Lucas Vogel's multimedia portfolio is out there!",
							description:
								'I am happy to announce the release of my new portfolio website. It is a multimedia portfolio that showcases my work in interface design and development. I hope you enjoy it!',
							pubDate: new Date('2023-12-01'),
							link: '/',
							enclosure: getEnclosureByImage(site, ogHome),
						},
						{
							title: 'Learn more about me!',
							description:
								'Discover more about me, my work and my passion for interface design and development.',
							pubDate: new Date('2023-11-01'),
							link: '/about',
							enclosure: getEnclosureByImage(site, ogAbout),
							content: await getHTMLContentBySlug('content', 'about'),
						},
					]
				: []),
			...(options.showProjects ? await getRSSProjectItems(site) : []),
			...(options.showCoolSites ? await getRSSCoolSitesItems(site) : []),
		].sort((a, b) => (b.pubDate || new Date()).getTime() - (a.pubDate || new Date()).getTime()),
	})
}

async function getRSSCoolSitesItems(site: string): Promise<RSSFeedItem[]> {
	const coolSites = await getParsedCoolSites()
	return await Promise.all(
		coolSites.map(async (i) => {
			const imageAlt = `Cover image for the cool site '${i.title}'`
			const imageString = `<img src="${i.thumbnail?.src}" alt="${imageAlt}" />`
			return {
				title: `New cool site: ${i.title}!`,
				pubDate: new Date(i.date),
				description: `New website added to vogelino's list of cool sites: ${i.title}`,
				content: [
					`<h1>New website added to vogelino's list of cool sites: ${i.title}</h1>`,
					imageString,
					`<h2>Tags</h2><ul>${i.tags.map((tag) => `<li>${tag}</li>`).join('')}</ul>`,
				].join(' '),
				categories: i.tags,
				link: `/cool-sites/${i.id}`,
				enclosure: getEnclosureByImage(site, i.thumbnail),
				customData: i.thumbnail && `<webfeeds:cover image="${site}${i.thumbnail.src}" />`,
			} satisfies RSSFeedItem
		})
	)
}
async function getRSSProjectItems(site: string): Promise<RSSFeedItem[]> {
	const projectsData = await getCollection('projects')
	const technologies = (await getCollection('technologies')) || []
	return await Promise.all(
		projectsData.map(async (p) => {
			const ogImage = getOgImage(p.slug)
			const title = stripMarkdown(p.data.title)
			const imageAlt = `Cover image for the project '${title}'`
			const imageString = ogImage ? `<img src="${site}${ogImage.src}" alt="${imageAlt}" />` : ''
			const content = await getProjectHTMLContentBySlug(p.slug, site)
			return {
				title: `New project: ${title}!`,
				pubDate: p.data.pubDate,
				description: [stripMarkdown(`${p.data.description}.`), ogImage ? imageString : ''].join(
					' '
				),
				link: `/projects/${p.slug}/`,
				enclosure: getEnclosureByImage(site, ogImage),
				content,
				customData: ogImage && `<webfeeds:cover image="${site}${ogImage.src}" />`,
				categories: [
					p.data.type,
					...p.data.technologies
						.map((tech) => technologies.find((t) => t.slug === tech.slug)?.data.name || '')
						.filter(Boolean),
				],
			} satisfies RSSFeedItem
		})
	)
}

async function getHTMLContentBySlug(collection: keyof ContentEntryMap, slug: string) {
	const entry = await getEntry(collection, slug)
	if (!entry) return
	return [
		entry.data.title && `<h1>${entry.data.title}</h1>`,
		entry.data.description && `<p>${entry.data.description}</p>`,
		marked(entry.body),
	]
		.filter(Boolean)
		.join('')
}

async function getProjectHTMLContentBySlug(slug: string, site: string) {
	const entry = await getEntry('projects', slug)
	const technologies = (await getCollection('technologies')) || []
	const collaborators = (await getCollection('collaborators')) || []
	if (!entry) return
	const p = entry.data
	const thumbnail = getProjectThumnnail(slug)
	const images = getProjectImages(slug)
	return [
		thumbnail && `<img src="${site}${thumbnail.src}" alt="Thumbnail of the project ${p.title}" />`,
		p.title && `<h1>${p.title.replaceAll('*', '')}</h1>`,
		p.description && `<p>${p.description.replaceAll('*', '')}</p>`,
		renderHTMLList(
			'Project images',
			images.map(
				(i, idx) => `<img src="${site}${i.src}" alt="Project image ${idx + 1} for ${p.title}" />`
			)
		),
		`<h2>About this project</h2>`,
		marked(entry.body),
		['clients', 'colleagues', 'supervisors', 'institutions', 'collaborators']
			.map((key) =>
				renderHTMLList(
					key.charAt(0).toUpperCase() + key.slice(1),
					p[key].map((coll: { slug: string }) => {
						const col = collaborators.find((c) => c.slug === coll.slug)?.data
						if (!col) return ''
						const colImage = getCollaborationImage(coll.slug)
						return [
							col.url && `<a href="${col.url}" title="More information about '${col.name}'">`,
							colImage &&
								`<img src="${site}${colImage.src}" alt="Profile picture of ${col.name}" width="20" height="20" />&nbsp;`,
							col.name,
							col.url && `</a>`,
						].join('')
					})
				)
			)
			.join(''),
		renderHTMLList(
			'Technologies',
			p.technologies.map((tech) => {
				const t = technologies.find((t) => t.slug === tech.slug)?.data
				if (!t) return ''
				const tImage = getTechnologyImage(tech.slug)
				return [
					t.url && `<a href="${t.url}" title="More information about '${t.name}'">`,
					tImage &&
						`<img src="${site}${tImage.src}" alt="Profile picture of ${t.name}" width="20" height="20" />&nbsp;`,
					t.name,
					t.url && `</a>`,
				].join('')
			})
		),
	]
		.filter(Boolean)
		.join('')
}

function renderHTMLList(title: string, list?: string[]) {
	const l = list?.filter(Boolean) || []
	if (l.length === 0) return ''
	return `<h2>${title}</h2>
  <ul>
    ${l.map((item) => `<li>${item}</li>`).join('')}
  </ul>`
}

function getEnclosureByImage(
	site: string,
	image?: AstroImageType<'jpg' | 'png' | 'jpeg' | 'webp' | 'avif' | 'svg'>
) {
	if (!image) return
	return {
		url: [site, image.src].join(''),
		type: `image/${image.format}`,
		length: image.width * image.height,
	}
}
