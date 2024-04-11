<template>
  <label
    class="component-checkbox"
    :class="{
      'is-checked': modelValue,
      'is-disabled': disabled,
      'is-readonly': readonly,
      'is-indeterminate': indeterminate,
    }"
    @change="onChange"
  >
    <span class="component-checkbox-input">
      <input class="component-checkbox-input-original" type="checkbox" :checked="modelValue" />
    </span>
    <span v-if="label || $slots.default" class="component-checkbox-label">
      <template v-if="!$slots.default && label">{{ label }}</template>
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ComponentCheckbox",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
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
    indeterminate: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const onChange = () => {
      if (!props.disabled && !props.readonly) {
        emit("update:modelValue", !props.modelValue);
      }
    };

    return {
      onChange,
    };
  },
});
</script>

<style scoped>
.component-checkbox {
  --cdp-component-checkbox-color: var(--cdp-color-blue);
  cursor: pointer;
  display: inline-flex;
  font-size: inherit;
  min-width: 1em;
  min-height: 1em;
  white-space: nowrap;
  align-items: center;
}
.component-checkbox.is-disabled {
  --cdp-component-checkbox-color: var(--cdp-color-gray);
}
.component-checkbox.is-disabled .component-checkbox-label {
  color: var(--cdp-color-gray-300);
}
.component-radio + .component-checkbox,
.component-checkbox + .component-checkbox {
  margin-left: 0.5em;
}
.component-checkbox-input {
  width: 1em;
  height: 1em;
  display: inline-block;
  position: relative;
}
.component-checkbox-input::before {
  width: 100%;
  height: 100%;
  content: "";
  display: block;
  box-sizing: border-box;
  transition: var(--cdp-transition-all);
  border-top: 2px solid var(--cdp-component-checkbox-color);
  border-left: 2px solid var(--cdp-component-checkbox-color);
  border-right: 2px solid var(--cdp-component-checkbox-color);
  border-bottom: 2px solid var(--cdp-component-checkbox-color);
  border-radius: 2px;
  background-color: transparent;
}
.component-checkbox .component-checkbox-input::after {
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  content: "";
  display: block;
  position: absolute;
}
.component-checkbox:not(.is-indeterminate) .component-checkbox-input::after {
  top: 30%;
  left: 50%;
  width: 40%;
  height: 75%;
  content: "";
  display: block;
  position: absolute;
  transform: rotate(45deg);
  box-sizing: border-box;
  transition: var(--cdp-transition-all);
  border-right: 2px solid transparent;
  border-bottom: 2px solid transparent;
  transform-origin: 100% 0;
}
.component-checkbox.is-checked .component-checkbox-input::before {
  background-color: var(--cdp-component-checkbox-color);
}
.component-checkbox.is-checked:not(.is-indeterminate) .component-checkbox-input::after {
  border-right-color: #fff;
  border-bottom-color: #fff;
}

.component-checkbox.is-indeterminate .component-checkbox-input::before {
  background-color: var(--cdp-component-checkbox-color);
}

.component-checkbox.is-indeterminate .component-checkbox-input::after {
  top: 50%;
  left: 50%;
  width: 60%;
  height: 2px;
  content: "";
  display: block;
  position: absolute;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  transition: var(--cdp-transition-all);
  background-color: var(--cdp-color-white);
}
.component-checkbox-input-original {
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  margin: 0;
  z-index: -1;
  outline: none;
  opacity: 0;
  position: absolute;
}
.component-checkbox-label {
  margin-left: 0.5em;
}
</style>
