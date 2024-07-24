// @vitest-environment happy-dom

import type { Document } from "happy-dom";

import { test, expect, describe, beforeEach } from "vitest";
import { Window as HappyWindow } from "happy-dom";
import querySelector from "@/utils/querySelector";

describe("querySelector", () => {
  let window;
  let document: Document;

  beforeEach(() => {
    // 创建一个 Happy DOM 的 Window 实例
    window = new HappyWindow();
    document = window.document;

    // 设置 HTML 结构
    document.body.innerHTML = `<div id="app">Hello, World!</div>`;

    // 将全局的 document 和 window 对象设置为 Happy DOM 的实例
    global.document = document as unknown as globalThis.Document;
    global.window = window as unknown as Window & typeof globalThis;
  });

  test(`querySelector<HTMLElement>("#app")?.innerText to equal "Hello, World!"`, () => {
    expect(querySelector<HTMLElement>("#app")?.innerText).toEqual("Hello, World!");
  });
  test(`await querySelector<HTMLElement>("#app", true)?.innerText to equal "Hello, World!"`, async () => {
    expect((await querySelector<HTMLElement>("#app", true))?.innerText).toEqual("Hello, World!");
  });
  test(`await querySelector<HTMLElement>("#app", 10, 1000) to equal { timeDiff: true, innerText: "Hello, World!" }`, async () => {
    const startTime = Date.now();
    document.body.innerHTML = "";
    let updateTimeDiff = startTime;
    setTimeout(() => {
      updateTimeDiff = Date.now() - startTime;
      document.body.innerHTML = `<div id="app">Hello, World!</div>`;
    }, 2000);
    expect(
      await querySelector<HTMLElement>("#app", 10, 1000).then((res) => ({
        timeDiff: Date.now() - startTime - updateTimeDiff < 10,
        innerText: res.innerText,
      }))
    ).toEqual({ timeDiff: true, innerText: "Hello, World!" });
  });
});
