<template>
  <transition
    name="component-message"
    appear
    @after-leave="onAfterLeave"
    @before-leave="onBeforeLeave"
  >
    <div
      v-if="visible"
      :id="id"
      class="component-message"
      :class="customClass"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
    >
      <div v-if="visible" class="component-message-content">
        <component-icon
          v-if="computedIcon"
          :name="computedIcon"
          class="component-message-content-icon"
        ></component-icon>
        <div v-if="computedMessageType === 'message'" class="component-message-content-message">
          {{ message }}
        </div>
        <div v-else-if="computedMessageType === 'vnode'" class="component-message-content-message">
          <component :is="message"></component>
        </div>
        <div
          v-else-if="computedMessageType === 'html'"
          v-html="message"
          class="component-message-content-message"
        ></div>
        <div v-else-if="computedMessageType === 'slot'" class="component-message-content-message">
          <slot></slot>
        </div>
        <component-icon
          v-if="showClose"
          name="close"
          fill="currentColor"
          class="component-message-content-close"
          @click="onClose"
        ></component-icon>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  ref,
  isVNode,
  computed,
  onMounted,
  onUnmounted,
  onBeforeMount,
  defineComponent,
} from "vue";
import ComponentIcon from "@/components/Component/ComponentIcon.vue";
import { isFunction } from "@/utils/is";

export default defineComponent({
  name: "ComponentMessage",
  components: {
    ComponentIcon,
  },
  props: {
    id: {
      type: String,
    },
    type: {
      type: String,
      validator(value: string) {
        return ["info", "success", "warning", "error", "loading"].includes(value);
      },
    },
    icon: {
      type: String,
    },
    message: {
      type: [String, Object, Function],
    },
    duration: {
      type: Number,
      default: 3000,
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
    },
    dangerouslyUseHTMLString: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "destroy"],
  setup(props, { emit, slots, expose }) {
    const timer = ref<undefined | NodeJS.Timeout>();
    const visible = ref(true);

    const computedIcon = computed(() => {
      if (props.icon) {
        return props.icon;
      }
      switch (props.type) {
        case "info":
          return "infoCircleFilled";
        case "success":
          return "checkCircleFilled";
        case "warning":
          return "warningCircleFilled";
        case "error":
          return "errorFilled";
        case "loading":
          return "loading";
        default:
          return "";
      }
    });

    const computedMessageType = computed(() => {
      if (props.dangerouslyUseHTMLString) {
        return "html";
      } else if (isVNode(props.message) || isFunction(props.message)) {
        return "vnode";
      } else if (slots.default) {
        return "slot";
      }
      return "message";
    });

    const onClose = () => {
      clearTimer();
      visible.value = false;
    };

    const startTimer = () => {
      if (props.duration > 0) {
        timer.value = setTimeout(onClose, props.duration);
      }
    };

    const clearTimer = () => {
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = undefined;
      }
    };

    const onMouseenter = () => {
      if (props.duration > 0) {
        clearTimer();
      }
    };

    const onMouseleave = () => {
      if (props.duration > 0) {
        startTimer();
      }
    };

    const onAfterLeave = () => {
      emit("destroy");
    };

    const onBeforeLeave = () => {
      emit("close");
    };

    onBeforeMount(() => {
      clearTimer();
    });

    onMounted(() => {
      startTimer();
    });

    onUnmounted(() => {
      clearTimer();
    });

    expose({
      close: onClose,
    });

    return {
      visible,
      computedIcon,
      computedMessageType,
      onClose,
      onMouseenter,
      onMouseleave,
      onAfterLeave,
      onBeforeLeave,
    };
  },
});
</script>
<style scoped>
.component-message {
  margin: calc(var(--cdp-gutter) / 2);
  transition: var(--cdp-transition-all);
  flex-shrink: 0;
}
.component-message-content {
  display: flex;
  padding: var(--cdp-gutter);
  min-width: 150px;
  max-width: 500px;
  font-size: var(--cdp-font-size);
  box-sizing: border-box;
  box-shadow: var(--cdp-box-shadow);
  transition: var(--cdp-transition-all);
  align-items: center;
  border-radius: calc(var(--cdp-gutter) / 2);
  pointer-events: all;
  justify-content: space-between;
  background-color: var(--cdp-color-white);
}
.component-message-content:hover {
  box-shadow: var(--cdp-box-shadow-md);
}
.component-message-content-icon {
  font-size: var(--cdp-font-size);
  flex-shrink: 0;
  margin-right: var(--cdp-gutter);
}
.component-message-content-message {
  flex-grow: 1;
  line-height: var(--cdp-line-height);
}
.component-message-content-close {
  color: var(--cdp-color-gray);
  cursor: pointer;
  transition: var(--cdp-transition-all);
  margin-left: var(--cdp-gutter);
  flex-shrink: 0;
}
.component-message-content-close:hover {
  color: var(--cdp-color-red);
}
/* transition */
.component-message-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.component-message-enter-to {
  opacity: 1;
  transform: translateY(0px);
}
.component-message-leave-from {
  opacity: 1;
  margin-top: 0;
}
.component-message-leave-to {
  opacity: 0;
  margin-top: calc(0px - (var(--cdp-gutter) * 2) - var(--cdp-line-height));
}
/* .component-message-animation-enter-active {
  animation: component-message-animation-enter-active 0.3s;
}
.component-message-animation-leave-active {
  animation: component-message-animation-leave-active 0.3s;
}
@keyframes component-message-animation-enter-active {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
@keyframes component-message-animation-leave-active {
  0% {
    opacity: 1;
    margin-top: 0;
  }
  100% {
    opacity: 0;
    margin-top: -45px;
  }
} */
</style>
