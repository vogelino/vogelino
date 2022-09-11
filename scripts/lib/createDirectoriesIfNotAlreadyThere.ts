import fsSync from "node:fs";
import fs from "node:fs/promises";

export const createDirectoriesIfNotAlreadyThere = async (
  path: string
): Promise<void> => {
  const dirExists = fsSync.existsSync(path);
  if (!dirExists) {
    await fs.mkdir(path, { recursive: true });
  }
};
