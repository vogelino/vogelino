import { Client } from "@notionhq/client";

const auth = process.env.NOTION_API_SECRET;

if (!auth) throw new Error(`No env var NOTION_API_SECRET defined!!`);

export const notion = new Client({ auth });
