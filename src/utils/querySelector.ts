import { isArray, isBoolean, isUndefined } from "@/utils/is";

export function querySelector<T = HTMLElement>(selectors: string): T | null;
export function querySelector<T = HTMLElement>(selectors: string, isPromise: boolean): Promise<T>;
export function querySelector<T = HTMLElement>(
  selectors: string,
  isPromise: number,
  timeout?: number
): Promise<T>;
export function querySelector<T = HTMLElement>(
  selectors: string,
  isPromise?: boolean | number,
  timeout: number = 100
): Promise<T> | T | null {
  let element = document.querySelector(selectors) as T;
  if (isUndefined(isPromise)) {
    return element;
  } else if (isBoolean(isPromise)) {
    if (isPromise) {
      return element ? Promise.resolve(element) : Promise.reject(selectors + " is not found");
    }
    return element;
  } else if (element) {
    return Promise.resolve(element);
  } else if (isPromise > 0) {
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        element = document.querySelector(selectors) as T;
        if (element) {
          resolve(element);
          clearInterval(timer);
        } else if (--(isPromise as number) <= 0) {
          reject(selectors + " is not found");
          clearInterval(timer);
        }
      }, timeout);
    });
  } else {
    return Promise.reject(selectors + " is not found");
  }
}

export function querySelectorAll<T = Array<HTMLElement>>(selectors: string): T | null;
export function querySelectorAll<T = Array<HTMLElement>>(
  selectors: string,
  isPromise: boolean
): Promise<T>;
export function querySelectorAll<T = Array<HTMLElement>>(
  selectors: string,
  isPromise: number,
  timeout?: number
): Promise<T>;
export function querySelectorAll<T = Array<HTMLElement>>(
  selectors: string,
  isPromise?: boolean | number,
  timeout: number = 100
): Promise<T> | T | null {
  let element = Array.from(document.querySelectorAll(selectors)) as T;
  if (isUndefined(isPromise)) {
    return element;
  } else if (isBoolean(isPromise)) {
    if (isArray(element)) {
      if (isPromise) {
        return element.length
          ? Promise.resolve(element)
          : Promise.reject(selectors + " is not found");
      }
      return element.length ? element : null;
    }
    return null;
  } else if (isArray(element) && element.length) {
    return Promise.resolve(element);
  } else if (isPromise > 0) {
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        element = Array.from(document.querySelectorAll(selectors)) as T;
        console.dir("element", element);
        if (isArray(element) && element.length) {
          resolve(element);
          clearInterval(timer);
        } else if (--(isPromise as number) <= 0) {
          reject(selectors + " is not found");
          clearInterval(timer);
        }
      }, timeout);
    });
  } else {
    return Promise.reject(selectors + " is not found");
  }
}

export default querySelector;
