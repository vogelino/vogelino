import sharp from 'sharp'

export const resizeImage = async (
	path: string,
	dest: string,
	options: sharp.ResizeOptions,
) => {
	await sharp(path).resize(options).webp({ lossless: true }).toFile(dest)
}
