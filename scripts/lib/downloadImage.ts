import { contentTypeToImgExtension } from './contentTypeToImgExtension'
import fetch from 'node-fetch'
import { logIndented } from './logUtil'

export const downloadImage = async (
	url: string,
): Promise<{
	imageExt: string
	data: NodeJS.ReadableStream
}> => {
	let timeoutExceeded = true
	setTimeout(() => {
		if (timeoutExceeded) throw new Error(`Timout exceeded for file "${url}"`)
	}, 10000)
	console.log(url)
	const response = await fetch(url)
	timeoutExceeded = false
	const contentType = response.headers.get('content-type')
	const imageExt = contentTypeToImgExtension(contentType)
	logIndented(`📄 The file is an image with the ".${imageExt}" extension`)

	return {
		imageExt,
		data: response.body,
	}
}
