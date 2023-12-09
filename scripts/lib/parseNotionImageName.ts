import slugify from 'slugify'
import { NotionImageType } from './getOriginalNotionProjects'

function padWithLeadingZeros(num: number, totalLength = 3) {
	return String(num).padStart(totalLength, '0')
}

export default function parseNotionImageName(
	notionImage: NotionImageType,
	idx: number,
	slug: string,
) {
	const paddedIdx = padWithLeadingZeros(+idx + 1, 3)
	const { name } = notionImage
	const fileExtension = name.split('.').pop() === 'svg' ? 'svg' : 'webp'
	const slugifiedName = slugify(`${paddedIdx}-${slug}`, {
		lower: true,
		strict: true,
	})
	const mediaDest = `${slugifiedName}.${fileExtension}`
	return mediaDest
}
