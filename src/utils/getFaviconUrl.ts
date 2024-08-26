export function getFaviconUrl({
	size = 32,
	url,
}: {
	size?: number
	url: string
}) {
	const domain = new URL(url).hostname.replace('www.', '')
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
}
