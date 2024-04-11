import type { VNode, AppContext } from "vue";

import "@/style/message.css";
import { render, createVNode } from "vue";
import ComponentMessage from "@/components/Component/ComponentMessage.vue";

type TMessageOptionsType = "info" | "error" | "success" | "warning" | "loading";

const MESSAGE_TYPE_INFO: TMessageOptionsType = "info";
const MESSAGE_TYPE_ERROR: TMessageOptionsType = "error";
const MESSAGE_TYPE_SUCCESS: TMessageOptionsType = "success";
const MESSAGE_TYPE_WARNING: TMessageOptionsType = "warning";
const MESSAGE_TYPE_LOADING: TMessageOptionsType = "loading";

type TMessageOptionsMessage = string | VNode | (() => VNode);

type TMessageOptionsPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface IMessageComponentOptions {
  type?: TMessageOptionsType;
  icon?: string;
  width?: string;
  message?: TMessageOptionsMessage;
  duration?: number;
  showClose?: boolean;
  customClass?: string;
  dangerouslyUseHTMLString?: boolean;
  onClose?: () => void;
  onDestroy?: () => void;
}

interface IMessageFunctionSpecialOptions {
  ctx?: AppContext;
  zIndex?: number;
  hasMask?: boolean;
  position?: TMessageOptionsPosition;
}

type TMessageFunctionOptions = IMessageComponentOptions &
  IMessageFunctionSpecialOptions;

type TMessageTypeFunctionOptions = Omit<
  TMessageFunctionOptions,
  "type" | "message"
>;

type TDefaultMessageFunctionOptions = TMessageFunctionOptions &
  Required<Pick<TMessageFunctionOptions, "position">>;

interface IMessageInstance {
  id: string;
  type?: TMessageOptionsType;
  message?: TMessageOptionsMessage;
  close: () => void;
}

interface IMessageTypeFunction {
  (
    message: TMessageOptionsMessage,
    options?: TMessageFunctionOptions
  ): IMessageInstance;
}

interface IMessage {
  (options: TMessageFunctionOptions): IMessageInstance;
  info: IMessageTypeFunction;
  error: IMessageTypeFunction;
  success: IMessageTypeFunction;
  warning: IMessageTypeFunction;
  loading: IMessageTypeFunction;
  closeAll: () => void;
  setDefault: (options: TMessageFunctionOptions) => void;
  _context?: AppContext | null;
}

const instances: IMessageInstance[] = [];

interface iPositionMaskContainer {
  el: HTMLElement;
  count: number;
}

interface iPositionContainer {
  noMask?: iPositionMaskContainer;
  hasMask?: iPositionMaskContainer;
}

const containers: { [key in TMessageOptionsPosition]?: iPositionContainer } =
  {};

const defaultOptions: TDefaultMessageFunctionOptions = {
  zIndex: 2000,
  position: "top-center",
};

let globalOptions: TMessageFunctionOptions = {};

let seed = 0;

const message: IMessage = (options: TMessageFunctionOptions) => {
  const id = "component-message-" + seed++;
  const {
    zIndex,
    hasMask,
    position,
    ...props
  }: TDefaultMessageFunctionOptions = {
    ...defaultOptions,
    ...globalOptions,
    ...options,
  };

  const maskKey = hasMask ? "hasMask" : "noMask";

  if (!containers[position]) {
    containers[position] = {};
  }

  const positionContainer = containers[position] as iPositionContainer;

  const hsaPositionMaskContainer = !!positionContainer[maskKey];

  if (!hsaPositionMaskContainer) {
    const customClass = ["component-message-area", "is-" + position];
    if (hasMask) {
      customClass.push("has-mask");
    }
    const el = document.createElement("div");

    el.className = customClass.join(" ");

    document.body.appendChild(el);

    positionContainer[maskKey] = { el, count: 1 };
  }

  const positionMaskContainer = positionContainer[
    maskKey
  ] as iPositionMaskContainer;

  if (hsaPositionMaskContainer) {
    positionMaskContainer.count++;
  }

  if (zIndex) {
    positionMaskContainer.el.style.zIndex = String(options.zIndex);
  }

  const onDestroy = props.onDestroy;
  props.onDestroy = () => {
    positionMaskContainer.count--;
    if (positionMaskContainer.count === 0) {
      delete positionContainer[maskKey];
      positionMaskContainer.el.remove();
    }
    if (onDestroy) {
      onDestroy();
    }
    render(null, div);
  };

  const vm = createVNode(ComponentMessage, props);
  const div = document.createElement("div");

  vm.appContext = options.ctx || message._context || null;

  render(vm, div);

  // for position of bottom-*
  if (position.startsWith("bottom") && positionMaskContainer.el.firstChild) {
    positionMaskContainer.el.insertBefore(
      div.firstElementChild!,
      positionMaskContainer.el.firstChild
    );
  } else {
    positionMaskContainer.el.appendChild(div.firstElementChild!);
  }

  const instance = {
    id,
    type: props.type,
    message: props.message,
    close() {
      vm?.component?.exposed?.close();
    },
  };

  instances.push(instance);
  return instance;
};

const messageFunction = message;

message.info = (
  message: TMessageOptionsMessage,
  options?: TMessageTypeFunctionOptions
) => messageFunction({ ...options, type: MESSAGE_TYPE_INFO, message });
message.error = (
  message: TMessageOptionsMessage,
  options?: TMessageTypeFunctionOptions
) => messageFunction({ ...options, type: MESSAGE_TYPE_ERROR, message });
message.success = (
  message: TMessageOptionsMessage,
  options?: TMessageTypeFunctionOptions
) => messageFunction({ ...options, type: MESSAGE_TYPE_SUCCESS, message });
message.warning = (
  message: TMessageOptionsMessage,
  options?: TMessageTypeFunctionOptions
) => messageFunction({ ...options, type: MESSAGE_TYPE_WARNING, message });
message.loading = (
  message: TMessageOptionsMessage,
  options?: TMessageTypeFunctionOptions
) => messageFunction({ ...options, type: MESSAGE_TYPE_LOADING, message });

message.closeAll = () => {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

// global options
message.setDefault = (options: TMessageFunctionOptions) => {
  globalOptions = { ...options };
};

export default message;
