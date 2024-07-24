import { test, expect, describe } from "vitest";

import complementZero from "@/utils/complementZero";

describe("complementZero", () => {
  test(`complementZero("test") to equal ""`, () => {
    expect(complementZero("test")).toEqual("");
  });
  test(`complementZero(0) to equal "00"`, () => {
    expect(complementZero(0)).toEqual("00");
  });
  test(`complementZero(1) to equal "01"`, () => {
    expect(complementZero(1)).toEqual("01");
  });
  test(`complementZero("1") to equal "01"`, () => {
    expect(complementZero("1")).toEqual("01");
  });
  test(`complementZero(10) to equal "10"`, () => {
    expect(complementZero(10)).toEqual("10");
  });
  test(`complementZero("10") to equal "10"`, () => {
    expect(complementZero("10")).toEqual("10");
  });
  test(`complementZero(99, 4) to equal "0099"`, () => {
    expect(complementZero(99, 4)).toEqual("0099");
  });
  test(`complementZero("99", 4) to equal "0099"`, () => {
    expect(complementZero("99", 4)).toEqual("0099");
  });
});
