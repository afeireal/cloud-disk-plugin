<template>
  <div class="enter-component">
    <button type="button" class="enter-component-button" @click="onClick">
      <span class="enter-component-button-icon">
        <component-icon name="editCircle"></component-icon>
      </span>
      <span class="enter-component-button-text">重命名</span>
    </button>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type Provider from "@/provider/interface";

import { inject, defineComponent } from "vue";
import ComponentIcon from "@/components/Component/ComponentIcon.vue";

export default defineComponent({
  name: "EnterComponentAli",
  components: {
    ComponentIcon,
  },
  setup() {
    const providerRef = inject<Ref<Provider>>("providerRef");
    const onClick = () => {
      providerRef?.value.setVisible(true);
    };

    return {
      onClick,
    };
  },
});
</script>

<style scoped>
.enter-component {
  margin-top: 8px;
}
.enter-component-button {
  color: var(--context_primary);
  width: 60px;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 2px 6px;
  position: relative;
  transition: all 0.3s ease;
  min-height: 61px;
  font-weight: 400;
  align-items: center;
  border-radius: 8px;
  flex-direction: column;
  justify-content: center;
  background-color: transparent;
}
.enter-component-button:hover {
  background-color: var(--divider_tertiary);
}
.enter-component-button:active {
  background-color: var(--divider_secondary);
}
.enter-component-button[disabled] {
  color: var(--cdp-color-blue-700);
  cursor: not-allowed;
}
.enter-component-button-icon {
  width: 28px;
  height: 28px;
  display: flex;
  font-size: 26px;
  align-items: center;
  justify-content: center;
}
.enter-component-button-text {
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
