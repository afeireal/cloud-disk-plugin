// @vitest-environment happy-dom

import type { Document } from "happy-dom";
import type { IReactFiberNode } from "@/utils/reactFiber";

import { test, expect, describe, beforeEach } from "vitest";
import { Window as HappyWindow } from "happy-dom";
import { findReactFiberNode, getRootReactContainer } from "@/utils/reactFiber";

class ReactFiberNode implements IReactFiberNode {
  child?: IReactFiberNode;
  return?: IReactFiberNode;
  sibling?: IReactFiberNode;
  pendingProps: any = {};
  constructor(options: {
    child?: IReactFiberNode;
    return?: IReactFiberNode;
    sibling?: IReactFiberNode;
    pendingProps?: any;
  }) {
    this.child = options.child;
    this.return = options.return;
    this.sibling = options.sibling;
    this.pendingProps = options.pendingProps || this.pendingProps;
  }
}

class ReactFiberNodeList {
  head: ReactFiberNode;
  current: ReactFiberNode;
  constructor({ list, pendingProps }: { list?: { t?: 0 | 1 | 2; p?: any }[]; pendingProps?: any }) {
    this.head = new ReactFiberNode({ pendingProps });
    this.current = this.head;
    if (list) {
      this.createList(list);
    }
  }
  addChild(pendingProps: any) {
    while (this.current.child) {
      this.current = this.current.child;
    }
    this.current.child = new ReactFiberNode({ return: this.current, pendingProps });
  }
  addSibling(pendingProps: any) {
    while (this.current.sibling) {
      this.current = this.current.sibling;
    }
    this.current.sibling = new ReactFiberNode({ return: this.current, pendingProps });
  }
  createList(list: { t?: 0 | 1 | 2; p?: any }[] = []) {
    list.forEach((item) => {
      if (item.t === 0) {
        if (this.current.return) {
          this.current = this.current.return;
        }
      } else if (item.t === 1) {
        this.addChild(item.p);
      } else if (item.t === 2) {
        this.addSibling(item.p);
      }
    });
  }
}

describe("findReactFiberNode", () => {
  test(`findReactFiberNode(node, (item: IReactFiberNode) => item.pendingProps.id === 5)?.pendingProps  to equal "{ id: 5 }"`, () => {
    const node = new ReactFiberNodeList({
      list: [
        { t: 1, p: { id: 1 } },
        { t: 1, p: { id: 2 } },
        { t: 2, p: { id: 3 } },
        { t: 1, p: { id: 4 } },
        { t: 0 },
        { t: 1, p: { id: 5 } },
      ],
      pendingProps: { id: 0 },
    }).head;

    expect(
      findReactFiberNode(node, (item: IReactFiberNode) => item.pendingProps.id === 5)?.pendingProps
    ).toEqual({ id: 5 });
  });

  test(`findReactFiberNode(node, (item: IReactFiberNode) => item.pendingProps.id === -1) to be undefined`, () => {
    const node = new ReactFiberNodeList({
      list: [
        { t: 1, p: { id: 1 } },
        { t: 1, p: { id: 2 } },
        { t: 2, p: { id: 3 } },
        { t: 1, p: { id: 4 } },
        { t: 0 },
        { t: 1, p: { id: 5 } },
      ],
      pendingProps: { id: 0 },
    }).head;

    expect(
      findReactFiberNode(node, (item: IReactFiberNode) => item.pendingProps.id === -1)
    ).toBeUndefined();
  });
});

describe("getRootReactContainer", () => {
  let window;
  let document: Document;
  const rootReactContainer = { pendingProps: { id: "root" } };

  beforeEach(() => {
    // 创建一个 Happy DOM 的 Window 实例
    window = new HappyWindow();
    document = window.document;

    const root = document.createElement("div");
    Object.assign(root, {
      id: "root",
      __reactContainer: rootReactContainer,
    });

    // 设置 HTML 结构
    document.body.append(root);

    // 将全局的 document 和 window 对象设置为 Happy DOM 的实例
    global.document = document as unknown as globalThis.Document;
    global.window = window as unknown as Window & typeof globalThis;
  });

  test(`getRootReactContainer("#react", false) to be undefined`, () => {
    expect(getRootReactContainer("#react", false)).toBeUndefined();
  });

  test(`await getRootReactContainer("#root") to equal { pendingProps: { id: "root" } }`, async () => {
    expect(await getRootReactContainer("#root")).toEqual(rootReactContainer);
  });
});
