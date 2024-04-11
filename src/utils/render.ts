import type { VNode } from "vue";

import { h } from "vue";
import { isArray } from "@/utils/is";

export interface IRenderOptions {
  type: string;
  props: any;
  children?: IRenderOptions | IRenderOptions[];
}

const render = (
  option: IRenderOptions | IRenderOptions[],
  props?: any
): VNode | VNode[] => {
  if (isArray(option)) {
    const result: VNode[] = [];
    option.forEach((item: IRenderOptions) => {
      const res = render(item);
      return isArray(res) ? result.push(...res) : result.push(res);
    });
    return result;
  }

  return h(
    option.type,
    { ...option.props, ...props },
    option.children ? render(option.children) : undefined
  );
};

export default render;
