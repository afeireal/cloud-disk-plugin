import { test, expect, describe } from "vitest";

import sleep from "@/utils/sleep";

describe("sleep", () => {
  test("should resolve after specified timeout", async () => {
    const timeout = 1000; // 1 second
    const start = Date.now();
    await sleep(timeout);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(timeout);
  });

  test("should resolve immediately if timeout is 0", async () => {
    const timeout = 0;
    const start = Date.now();
    await sleep(timeout);
    const elapsed = Date.now() - start;
    expect(elapsed).toEqual(timeout);
  });
});
