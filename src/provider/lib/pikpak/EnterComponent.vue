<template>
  <div class="enter-component">
    <button type="button" class="enter-component-button" @click="onClick">
      <span class="enter-component-content-icon">
        <component-icon name="editCircle"></component-icon>
      </span>
      <span class="enter-component-content-text">重命名</span>
    </button>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type Provider from "@/provider/interface";

import { inject, defineComponent } from "vue";
import ComponentIcon from "@/components/Component/ComponentIcon.vue";

export default defineComponent({
  name: "EnterComponentQuark",
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
.enter-component-button {
  width: 100%;
  /* color: var(--color-secondary-text); */
  color: var(--cdp-color-blue);
  height: 44px;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 0 8px 0 20px;
  transition: all var(--transition-delay) var(--transition-animation);
  align-items: center;
  border-radius: 4px;
  background-color: transparent;
}
.enter-component-button:hover {
  background-color: #ebebf0;
}
.enter-component-content-icon {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  display: flex;
  font-size: 24px;
}
.enter-component-content-text {
  line-height: 18px;
  margin-left: 12px;
}
</style>
