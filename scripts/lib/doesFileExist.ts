import fs from 'node:fs'

export const doesFileExists = async (filePath: string): Promise<boolean> => {
	const fileExists = fs.existsSync(filePath)
	if (fileExists) return true
	return false
}
