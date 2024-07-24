import { test, expect, describe } from "vitest";

import fileNameParse from "@/utils/fileNameParse";

describe("fileNameParse", () => {
  test(`fileNameParse("test") to equal "{ ext: "", fileName: "test" }"`, () => {
    expect(fileNameParse("test")).toEqual({ ext: "", fileName: "test" });
  });
  test(`fileNameParse("Hello, World!.mp4") to equal "{ ext: "mp4", fileName: "Hello, World!" }"`, () => {
    expect(fileNameParse("Hello, World!.mp4")).toEqual({ ext: "mp4", fileName: "Hello, World!" });
  });
});
