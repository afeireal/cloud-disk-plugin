// @vitest-environment happy-dom
import type { Page, Browser } from "puppeteer";

import { cwd } from "node:process";
import { resolve } from "node:path";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { test, expect, describe, beforeAll, afterAll } from "vitest";
import getWebSocketDebuggerUrl from "./getWebSocketDebuggerUrl";

function generateRandomString(length: number = 6) {
  const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  while (length--) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

describe("provider", async () => {
  let browser: Browser;

  const env = dotenv.config({ path: resolve(cwd(), "./.env.test.local") });

  const randomString = generateRandomString(6);

  beforeAll(async () => {
    // browser = await puppeteer.launch
    const browserWSEndpoint = await getWebSocketDebuggerUrl();
    browser = await puppeteer.connect({
      defaultViewport: { width: 1920, height: 1080 },
      browserWSEndpoint,
    });
  });

  test.concurrent("baidu 甄嬛传", async () => {
    const page = await browser.newPage();
    env?.parsed?.TEST_URL_BAIDU && (await page.goto(env.parsed.TEST_URL_BAIDU), { timeout: 45000 });
    await previewTest(page, 76);
    await renameTest(page, randomString);
    await page.close();
  });

  test.concurrent("ali 甄嬛传", async () => {
    const page = await browser.newPage();
    env?.parsed?.TEST_URL_ALI && (await page.goto(env.parsed.TEST_URL_ALI));
    await page.waitForSelector("[class^=tr-wrapper--]");
    await previewTest(page, 76);
    await renameTest(page, randomString);
    await page.close();
  });

  test.concurrent("quark 甄嬛传", async () => {
    const page = await browser.newPage();
    env?.parsed?.TEST_URL_QUARK && (await page.goto(env.parsed.TEST_URL_QUARK));
    await page.waitForSelector(".ant-table-body tbody tr");
    await previewTest(page, 50);
    await renameTest(page, randomString);
    await page.close();
  });

  afterAll(async () => {
    await browser?.close();
  });
});

const previewTest = async (page: Page, count: number) => {
  const enterComponentButton = await page.waitForSelector(".enter-component-button");
  await enterComponentButton?.click();
  await page.waitForSelector(".rename-preview-content-grid-body .rename-preview-content-grid-item");
  const renamePreviewContentGridItem = await page.$$(
    ".rename-preview-content-grid-body .rename-preview-content-grid-item"
  );
  expect(renamePreviewContentGridItem?.length).toEqual(count);
};

const renameTest = async (page: Page, randomString: string) => {
  const titleElement = await page.$(".component-input-textarea");
  const seasonElement = await page.$(".component-input-input");
  const confirmButtonElement = await page.$(".rename-control-footer-button.confirm");
  await titleElement?.type(randomString + "-甄嬛传");
  await seasonElement?.type("1", { delay: 100 });
  await confirmButtonElement?.click();

  const resultMsgElement = await page.waitForSelector(".component-message-content", {
    timeout: 45000,
  });

  const resultMsg = await resultMsgElement?.$eval(
    ".component-message-content-message",
    (node: any) => node?.innerText
  );

  expect(resultMsg).toEqual("批量重命名成功");
};
