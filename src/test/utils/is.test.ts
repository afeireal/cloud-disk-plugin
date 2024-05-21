// @vitest-environment happy-dom

import { test, expect, describe } from "vitest";
import {
  is,
  isSet,
  isMap,
  isDate,
  isArray,
  isString,
  isNumber,
  isWindow,
  isRegExp,
  isObject,
  isBoolean,
  isPromise,
  isFunction,
  isNull,
  isUndefined,
  isVoid,
  isEmpty,
  isEmptyValue,
  isImage,
  isMobile,
  isDark,
  isLight,
} from "@/utils/is";

describe("is", () => {
  test(`is(Symbol("is"), "Symbol") to equal true`, () => {
    expect(is(Symbol("is"), "Symbol")).toEqual(true);
  });
  test(`isSet(new Set()) to equal true`, () => {
    expect(isSet(new Set())).toEqual(true);
  });
  test(`isMap(new Map()) to equal true`, () => {
    expect(isMap(new Map())).toEqual(true);
  });
  test(`isDate(new Date()) to equal true`, () => {
    expect(isDate(new Date())).toEqual(true);
  });
  test(`isArray([]) to equal true`, () => {
    expect(isArray([])).toEqual(true);
  });
  test(`isString("string") to equal true`, () => {
    expect(isString("string")).toEqual(true);
  });
  test(`isNumber(0) to equal true`, () => {
    expect(isNumber(0)).toEqual(true);
  });
  test(`isWindow(window) to equal false`, () => {
    expect(isWindow(window)).toEqual(false);
  });
  test(`isRegExp(/regexp/) to equal true`, () => {
    expect(isRegExp(/regexp/)).toEqual(true);
  });
  test(`isObject({}) to equal true`, () => {
    expect(isObject({})).toEqual(true);
  });
  test(`isBoolean(false) to equal true`, () => {
    expect(isBoolean(false)).toEqual(true);
  });
  test(`isPromise(Promise.resolve()) to equal true`, () => {
    expect(isPromise(Promise.resolve())).toEqual(true);
  });
  test(`isFunction(() => {}) to equal true`, () => {
    expect(isFunction(() => {})).toEqual(true);
  });
  test(`isNull(null) to equal true`, () => {
    expect(isNull(null)).toEqual(true);
  });
  test(`isUndefined(undefined) to equal true`, () => {
    expect(isUndefined(undefined)).toEqual(true);
  });
  test(`isVoid(null) to equal true`, () => {
    expect(isVoid(null)).toEqual(true);
  });
  test(`isEmpty("") to equal true`, () => {
    expect(isEmpty("")).toEqual(true);
  });
  test(`isEmptyValue([]) to equal true`, () => {
    expect(isEmptyValue([])).toEqual(true);
  });
  test(`isImage("img.png") to equal true`, () => {
    expect(isImage("img.png")).toEqual(true);
  });
  test(`isMobile() to equal true`, () => {
    expect(isMobile()).toEqual(true);
  });
  test(`isDark() to equal false`, () => {
    expect(isDark()).toEqual(false);
  });
  test(`isLight() to equal true`, () => {
    expect(isLight()).toEqual(true);
  });
});
