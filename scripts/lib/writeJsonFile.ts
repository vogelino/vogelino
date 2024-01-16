import fs from 'node:fs/promises'

export const writeJsonFile = async <T = unknown>(
	path: string,
	content: T | Record<string, T> | Record<string, T>[],
): Promise<void> => {
	const jsonString = JSON.stringify(content, null, 2)
	await fs.writeFile(path, jsonString, 'utf-8')
}
