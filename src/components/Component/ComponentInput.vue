<template>
  <label
    class="component-input"
    :class="{
      'is-focus': isFocus,
      'is-active': isActive,
      'is-disabled': disabled,
    }"
  >
    <div v-if="label" class="component-input-label">{{ label }}</div>
    <input
      v-if="type !== 'textarea'"
      v-model="computedValue"
      ref="inputRef"
      class="component-input-input"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="computedPlaceholder"
      @blur="onInputBlur"
      @focus="onInputFocus"
    />
    <textarea
      v-else
      v-model="computedValue"
      ref="textareaRef"
      rows="1"
      class="component-input-textarea"
      :style="textareaStyle"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="computedPlaceholder"
      @blur="onTextareaBlur"
      @focus="onTextareaFocus"
    ></textarea>
  </label>
</template>

<script lang="ts">
import { ref, watch, computed, nextTick, onMounted, defineComponent } from "vue";
import { isEmpty } from "@/utils/is";

export default defineComponent({
  name: "ComponentInput",
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "textarea",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const computedValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        if (!props.disabled && !props.readonly) {
          emit("update:modelValue", val);
        }
      },
    });
    const computedPlaceholder = computed(() => (props.label ? "" : props.placeholder));

    const isFocus = ref(false);
    const isActive = computed(() => !isEmpty(props.modelValue) || isFocus.value);

    const inputRef = ref<HTMLInputElement>();
    const textareaRef = ref<HTMLTextAreaElement>();
    const textareaStyle = ref<{ height?: string }>({});

    const onInputBlur = () => {
      isFocus.value = false;
    };
    const onInputFocus = () => {
      isFocus.value = true;
    };

    const onTextareaBlur = () => {
      isFocus.value = false;
      calcTextareaStyle();
    };
    const onTextareaFocus = () => {
      isFocus.value = true;
      calcTextareaStyle();
    };
    const calcTextareaStyle = () => {
      textareaStyle.value.height = "auto";
      nextTick(() => {
        textareaStyle.value.height = textareaRef.value?.value
          ? textareaRef.value.scrollHeight + "px"
          : "auto";
      });
    };

    watch(
      () => [props.type, props.modelValue],
      ([_type]) => {
        if (_type === "textarea") {
          calcTextareaStyle();
        }
      }
    );

    onMounted(() => {
      if (props.type === "textarea") {
        calcTextareaStyle();
      }
    });

    return {
      computedValue,
      computedPlaceholder,
      isFocus,
      isActive,
      inputRef,
      textareaRef,
      textareaStyle,
      onInputBlur,
      onInputFocus,
      onTextareaBlur,
      onTextareaFocus,
    };
  },
});
</script>

<style scoped>
.component-input {
  /* --cdp-component-input-size: 0.4em;
  --cdp-component-label-size: 0.8em; */
  --cdp-component-input-size: 6px;
  --cdp-component-label-size: 12px;
  color: var(--cdp-color-gray);
  display: flex;
  position: relative;
  font-size: inherit;
  box-sizing: border-box;
  margin-top: var(--cdp-component-input-size);
  padding-top: calc(var(--cdp-component-input-size) + var(--cdp-component-label-size));
  margin-bottom: var(--cdp-component-input-size);
  border-bottom: 1px solid var(--cdp-color-gray);
  padding-bottom: var(--cdp-component-input-size);
  background-color: transparent;
}
.component-input.is-focus {
  border-bottom-color: var(--cdp-color-blue);
}
.component-input-input,
.component-input-textarea {
  color: var(--cdp-color-gray-700);
  width: 100%;
  padding: 0;
  outline: none;
  font-size: inherit;
  vertical-align: middle;
  /* min-height: calc(var(--cdp-component-input-size) + 1em); */
  transition: border-bottom-color var(--cdp-transition-default);
  box-sizing: content-box;
  line-height: calc(var(--cdp-component-input-size) + 1em);
  background-color: transparent;
  border-block-end-width: 0;
  border-inline-end-width: 0;
  border-block-start-width: 0;
  border-inline-start-width: 0;
}
.component-input.is-focus .component-input-input,
.component-input.is-focus .component-input-textarea {
  border-bottom-color: var(--cdp-color-blue);
  border-block-end-color: var(--cdp-color-blue);
}
.component-input.is-disabled .component-input-input,
.component-input.is-disabled .component-input-textarea {
  color: var(--cdp-color-gray);
}
.component-input-label {
  top: calc(var(--cdp-component-label-size) + var(--cdp-component-input-size) * 1.5);
  left: calc(var(--cdp-component-input-size) * 2);
  color: var(--cdp-color-gray-700);
  position: absolute;
  transition:
    top var(--cdp-transition-default),
    left var(--cdp-transition-default),
    color var(--cdp-transition-default),
    font-size var(--cdp-transition-default);
  line-height: 1;
  background-color: transparent;
}
.component-input.is-active .component-input-label {
  top: 0;
  left: 0;
  color: var(--cdp-color-gray-900);
  font-size: var(--cdp-component-label-size);
}
.component-input.is-focus .component-input-label {
  color: var(--cdp-color-blue);
}
.component-input.is-disabled .component-input-label {
  color: var(--cdp-color-gray-300);
}
</style>
