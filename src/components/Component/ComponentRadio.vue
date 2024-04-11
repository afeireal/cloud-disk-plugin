<template>
  <label
    class="component-radio"
    :class="{
      'is-checked': isChecked,
      'is-disabled': disabled,
      'is-readonly': readonly,
      [type]: true,
    }"
    @change="onChange"
  >
    <span class="component-radio-input">
      <input
        class="component-radio-input-original"
        type="radio"
        :value="label"
        :checked="isChecked"
      />
    </span>
    <span v-if="label || $slots.default" class="component-radio-label">
      <template v-if="!$slots.default && label">{{ label }}</template>
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "ComponentRadio",
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: false,
    },
    label: {
      type: [String, Number, Boolean],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "radio",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isChecked = computed(() => props.modelValue === props.label);

    const onChange = () => {
      if (!props.disabled && !props.readonly) {
        emit("update:modelValue", props.label);
      }
    };

    return {
      isChecked,
      onChange,
    };
  },
});
</script>

<style scoped>
.component-radio {
  --cdp-component-radio-color: var(--cdp-color-blue);
  cursor: pointer;
  font-size: inherit;
}
.component-radio.radio {
  display: inline-flex;
  min-width: 1em;
  min-height: 1em;
  white-space: nowrap;
  align-items: center;
}
.component-radio.is-disabled {
  --cdp-component-radio-color: var(--cdp-color-gray);
}
.component-radio.is-disabled .component-radio-label {
  color: var(--cdp-color-gray-300);
}
.component-checkbox + .component-radio,
.component-radio.radio + .component-radio.radio {
  margin-left: 0.5em;
}
.component-radio.radio .component-radio-input {
  width: 1em;
  height: 1em;
  display: inline-block;
  position: relative;
}
.component-radio.radio .component-radio-input::before {
  width: 100%;
  height: 100%;
  border: 2px solid var(--cdp-component-radio-color);
  content: "";
  display: block;
  box-sizing: border-box;
  transition: var(--cdp-transition-all);
  border-radius: 50%;
  background-color: transparent;
}
.component-radio.radio .component-radio-input::after {
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  content: "";
  display: block;
  position: absolute;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  transition: var(--cdp-transition-all);
  border-radius: 50%;
  background-color: var(--cdp-component-radio-color);
}
.component-radio.radio.is-checked .component-radio-input::after {
  width: 50%;
  height: 50%;
}
.component-radio.radio .component-radio-input-original {
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  margin: 0;
  z-index: -1;
  opacity: 0;
  outline: none;
  position: absolute;
}
.component-radio.radio .component-radio-label {
  margin-left: 0.5em;
}

.component-radio.button {
  color: var(--cdp-color-gray-900);
  height: auto;
  border: 1px solid var(--cdp-color-gray-300);
  padding: 0.5em 1em;
  transition: var(--cdp-transition-all);
  line-height: 1;
  border-radius: var(--cdp-gutter);
  background-color: var(--cdp-color-white);
}
.component-radio.button:has(+ .component-radio.button) {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.component-radio.button + .component-radio.button {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.component-radio.button.is-checked {
  color: var(--cdp-color-gray-50);
  border-color: var(--cdp-component-radio-color);
  background-color: var(--cdp-component-radio-color);
}
.component-radio.button .component-radio-input-original {
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  margin: 0;
  z-index: -1;
  opacity: 0;
  outline: none;
  position: absolute;
}
</style>
