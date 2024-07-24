import { isString } from "@/utils/is";

// 补零
export const complementZero = (payload: number | string, maxLength: number = 2): string => {
  if (isString(payload)) {
    payload = parseInt(payload);
    if (isNaN(payload)) {
      return "";
    }
  }
  return "0".repeat(maxLength - (payload + "").length) + payload;
};

export default complementZero;
