import { readFile } from 'node:fs/promises'

export async function loadJson<
	T = Record<string, unknown> | Record<string, unknown>[],
>(pathToFile: string): Promise<T> {
	const file = await readFile(pathToFile, 'utf-8')
	const json = await JSON.parse(file)
	return json as T
}
