// @vitest-environment happy-dom

import type { Document } from "happy-dom";

import { test, expect, describe, beforeEach } from "vitest";
import { Window as HappyWindow } from "happy-dom";
import message from "@/utils/message";

describe("message", () => {
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

  test(`message.loading("Hello, World!")`, () => {
    message.loading("Hello, World!");
    expect(
      document.querySelector(
        ".component-message-area.is-top-center .component-message .component-message-content-message"
      )?.innerHTML
    ).toEqual("Hello, World!");
  });

  test(`message.success("Hello, World!")`, () => {
    message.success("Hello, World!", { position: "bottom-right" });
    expect(
      document.querySelector(
        ".component-message-area.is-bottom-right .component-message .component-message-content-message"
      )?.innerHTML
    ).toEqual("Hello, World!");
  });
});
