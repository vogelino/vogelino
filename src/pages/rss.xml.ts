import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

function stripMarkdown(str: string) {
	return str
		.replace('..', '.')
		.replaceAll('*', '')
		.replaceAll(/\[(.+)\]\(.+\)/gi, '$1')
		.replaceAll(/&.*?;/gi, '')
}

export async function GET(context: APIContext) {
	const projects = (await getCollection('projects')).map((p) => ({
		title: `New project: ${stripMarkdown(p.data.title)}!`,
		pubDate: p.data.pubDate,
		description: stripMarkdown(`${p.data.description}.`),
		link: `/projects/${p.slug}/`,
	}))
	return rss({
		title: "Vogelino – Lucas Vogel's multimedia portfolio",
		description: 'Interface design and development portfolio of Lucas Vogel',
		site: context.site,
		items: [
			{
				title: 'Inspirational websites that I like...',
				description:
					'Discover my curated list (or dump) of websites that I find inspirational. It can be a website that has a great design, which is well developed, has captivating content or a fun concept.',
				pubDate: new Date('2023-10-01'),
				link: '/inspirations',
			},
			{
				title: "Website release! Lucas Vogel's multimedia portfolio is out there!",
				description:
					'I am happy to announce the release of my new portfolio website. It is a multimedia portfolio that showcases my work in interface design and development. I hope you enjoy it!',
				pubDate: new Date('2023-12-01'),
				link: '/',
			},
			{
				title: 'Learn more about me!',
				description:
					'Discover more about me, my work and my passion for interface design and development.',
				pubDate: new Date('2023-11-01'),
				link: '/about',
			},
			...projects,
		].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
	})
}
