import slugify from 'slugify'
import { NotionImageType } from './getOriginalNotionProjects'

function padWithLeadingZeros(num: number, totalLength = 3) {
	return String(num).padStart(totalLength, '0')
}

export default function parseNotionImageName(
	notionImage: NotionImageType,
	idx: number,
) {
	const paddedIdx = padWithLeadingZeros(+idx + 1, 3)
	const { name } = notionImage
	const nameWithoutExtArr = name.substr(0, name.lastIndexOf('.')) || name
	const fileExtension = name.split('.').pop() === 'svg' ? 'svg' : 'webp'
	const slugifiedName = slugify(nameWithoutExtArr)
	const mediaDest = `${paddedIdx}-${slugifiedName}.${fileExtension}`
	return mediaDest
}
