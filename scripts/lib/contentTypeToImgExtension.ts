export const contentTypeToImgExtension = (contentType?: string | null): string => {
	if (!contentType)
		throw new Error(`The resonse's content-type was invalid: ${typeof contentType})`)
	if (contentType === 'image/svg+xml') return 'svg'
	const imageExtensionMatch = contentType?.match(/^image\/(?<ext>\b[^\d\W]+\b)$/)?.groups
	const imageExt = imageExtensionMatch?.ext
	if (!imageExt)
		throw new Error(`The requested url was not an image (content-type: ${contentType})`)
	return imageExt
}
