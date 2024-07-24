import { isBoolean, isUndefined } from "@/utils/is";

function querySelector<T = Element>(selectors: string): T | null;
function querySelector<T = Element>(selectors: string, isPromise: boolean): Promise<T>;
function querySelector<T = Element>(
  selectors: string,
  isPromise: number,
  timeout?: number
): Promise<T>;
function querySelector<T = Element>(
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

export default querySelector;
