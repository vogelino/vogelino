import { logIndented, logSecondary } from "./logUtil";
import puppeteer from "puppeteer";

export const getHeadlessPage = async (
  pageURL: string
): Promise<{
  page: puppeteer.Page;
  browser: puppeteer.Browser;
}> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 320, height: 320 });
  await page.goto(pageURL);
  await page.waitForTimeout(2000);
  page.on("console", (msg) => {
    logIndented(`PAGE LOG: "${msg.text()}"`, 2);
  });
  return { page, browser };
};
