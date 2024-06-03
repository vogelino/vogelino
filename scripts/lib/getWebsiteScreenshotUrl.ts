import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function getWebsiteScreenshotUrl(url: string) {
	console.log(`📷 Downloading screenshot for ${url}`)
	return cloudinary.url(url, {
		gravity: 'north',
		height: 584,
		width: 840,
		crop: 'fill',
		sign_url: true,
		type: 'url2png',
		format: 'webp',
	})
}
