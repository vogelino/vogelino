import { type ContentEntryMap, getCollection, getEntryBySlug } from 'astro:content'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import type { APIContext } from 'astro'
import { marked } from 'marked'
import { getParsedInspirations } from '../pages/inspirations/[...page].astro'
import type { AstroGlobImageType, AstroImageType } from '../utils/astroTypes'

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
		showInspirations: boolean
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
	const ogInspirations = ogImages.find((file) => file.url.includes('inspirations'))?.image
	const ogAbout = ogImages.find((file) => file.url.includes('about'))?.image
	return rss({
		title: options.title || "Vogelino – Lucas Vogel's multimedia portfolio",
		description: wrapInCdata(`${
			options.description || 'Interface design and development portfolio of Lucas Vogel'
		}
      There are currently the following RSS Feeds available:
      <ul>
        <li>All contents RSS feed: ${site}/rss.xml</li>
        <li>Only pages RSS feed: ${site}/rss-pages-only.xml</li>
        <li>Only projects RSS feed: ${site}/rss-projects-only.xml</li>
        <li>Only inspirations RSS feed: ${site}/rss-inspirations-only.xml</li>
      </ul>
      `),
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
							title: 'Inspirational websites that I like...',
							description:
								'Discover my curated list (or dump) of websites that I find inspirational. It can be a website that has a great design, which is well developed, has captivating content or a fun concept.',
							pubDate: new Date('2023-10-01'),
							link: '/inspirations',
							enclosure: getEnclosureByImage(site, ogInspirations),
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
			...(options.showInspirations ? await getRSSInspirationItems(site) : []),
		].sort((a, b) => (b.pubDate || new Date()).getTime() - (a.pubDate || new Date()).getTime()),
	})
}

function getOgImage(slug: string) {
	const images = Object.entries(
		import.meta.glob<AstroGlobImageType<'png'>>('/src/assets/images/og/*.png', {
			eager: true,
		})
	)
	const image = images.find(([url]) => url.includes(slug))
	if (!image) return
	return image[1].default
}

async function getRSSInspirationItems(site: string): Promise<RSSFeedItem[]> {
	const inspirations = await getParsedInspirations()
	return await Promise.all(
		inspirations.map(async (i) => {
			const imageAlt = `Cover image for the inspiration '${i.title}'`
			const imageString = `<img src="${i.thumbnail?.src}" alt="${imageAlt}" />`
			return {
				title: `New inspiration: ${i.title}!`,
				pubDate: new Date(i.date),
				description: wrapInCdata(
					[`New website added to vogelino's list of inspirations: `, i.title, imageString].join(' ')
				),
				link: `/inspirations/${i.id}`,
				enclosure: getEnclosureByImage(site, i.thumbnail),
				customData: i.thumbnail && `<webfeeds:cover image="${site}${i.thumbnail.src}" />`,
			}
		})
	)
}
async function getRSSProjectItems(site: string): Promise<RSSFeedItem[]> {
	const projectsData = await getCollection('projects')
	return await Promise.all(
		projectsData.map(async (p) => {
			const ogImage = getOgImage(p.slug)
			const title = stripMarkdown(p.data.title)
			const imageAlt = `Cover image for the project '${title}'`
			const imageString = `<img src="${ogImage?.src}" alt="${imageAlt}" />`
			return {
				title: `New project: ${title}!`,
				pubDate: p.data.pubDate,
				description: wrapInCdata(
					[stripMarkdown(`${p.data.description}.`), ogImage ? imageString : ''].join(' ')
				),
				link: `/projects/${p.slug}/`,
				enclosure: getEnclosureByImage(site, ogImage),
				content: await getHTMLContentBySlug('projects', p.slug),
				customData: ogImage && `<webfeeds:cover image="${site}${ogImage.src}" />`,
			}
		})
	)
}

async function getHTMLContentBySlug(collection: keyof ContentEntryMap, slug: string) {
	const entry = await getEntryBySlug(collection, slug)
	if (!entry) return
	return wrapInCdata(
		[
			entry.data.title && `<h1>${entry.data.title}</h1>`,
			entry.data.description && `<h2>${entry.data.description}</h2>`,
			marked(entry.body),
		]
			.filter(Boolean)
			.join('')
	)
}

function getEnclosureByImage(site: string, image?: AstroImageType) {
	if (!image) return
	return {
		url: [site, image.src].join(''),
		type: `image/${image.format}`,
		length: image.width * image.height,
	}
}

function wrapInCdata(content: string) {
	return `<![CDATA[${content}]]>`
}
