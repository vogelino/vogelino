import * as dotenv from "dotenv";
dotenv.config();
import { getNotionProjects } from "../src/utils/getNotionProjects";
import { getAllNotionLinks } from "../src/utils/getAllNotionLinks";
import { notion } from "./lib/notion";
import { createDirectoriesIfNotAlreadyThere } from "./lib/createDirectoriesIfNotAlreadyThere";
import { INSPIRATIONS_JSON_PATH, PROJECTS_JSON_PATH } from "./paths";
import { writeJsonFile } from "./lib/writeJsonFile";
import { logEnd, logH1, logIndented, logSecondary } from "./lib/logUtil";

const projectsDatabaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID || "";
const inspirationsDatabaseId = process.env.NOTION_INSPIRATION_DATABASE_ID || "";

async function downloadCacheData() {
  logH1(`Downloading data from Notion`);
  logIndented(`🗂 Projects`);
  logIndented(`🗯 Inspirations`);
  const [projects, inspirations] = await Promise.all([
    getNotionProjects<true>(projectsDatabaseId, notion, true),
    getAllNotionLinks(inspirationsDatabaseId, notion),
  ]);
  logIndented(`✅ Success`);

  await createDirectoriesIfNotAlreadyThere("data");

  logSecondary([`💾 Downloading`]);
  logIndented(`🗂 ${projects.length} projects`);
  logIndented(`🗯 ${inspirations.length} inspirations`);
  await Promise.all([
    writeJsonFile(PROJECTS_JSON_PATH, projects),
    writeJsonFile(INSPIRATIONS_JSON_PATH, inspirations),
  ]);
  logIndented(`✅ Success`);

  logEnd();
  process.exit();
}

void downloadCacheData();
