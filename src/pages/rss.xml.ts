import { type ContentEntryMap, getCollection, getEntryBySlug } from 'astro:content'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { marked } from 'marked'
import type { AstroGlobImageType, AstroImageType } from '../utils/astroTypes'

function stripMarkdown(str: string) {
	return str
		.replace('..', '.')
		.replaceAll('*', '')
		.replaceAll(/\[(.+)\]\(.+\)/gi, '$1')
		.replaceAll(/&.*?;/gi, '')
}

export async function GET(context: APIContext) {
	const site = context.site.toString().replace(/\/$/, '')
	const ogImages = Object.entries(
		import.meta.glob<AstroGlobImageType<'png'>>('/src/assets/images/og/*.png', {
			eager: true,
		})
	).map(([url, { default: image }]) => ({ url, image }))

	const ogHome = ogImages.find((file) => file.url.includes('home'))?.image
	const ogInspirations = ogImages.find((file) => file.url.includes('inspirations'))?.image
	const ogAbout = ogImages.find((file) => file.url.includes('about'))?.image
	return rss({
		title: "Vogelino – Lucas Vogel's multimedia portfolio",
		description: 'Interface design and development portfolio of Lucas Vogel',
		site: context.site,
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
			...(await getRSSProjectItems(site)),
		].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
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

async function getRSSProjectItems(site: string) {
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
			}
		})
	)
}

async function getHTMLContentBySlug(collection: keyof ContentEntryMap, slug: string) {
	const entry = await getEntryBySlug(collection, slug)
	return wrapInCdata(
		[`<h1>${entry.data.title}</h1>`, `<h2>${entry.data.description}</h2>`, marked(entry.body)].join(
			''
		)
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
