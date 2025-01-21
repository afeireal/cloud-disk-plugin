<template>
  <div class="enter-component" @click="onClick">
    <button type="button" class="enter-component-button">
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
  name: "EnterComponentBaidu",
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
  padding-top: 2px;
  margin-bottom: 1px;
}
.enter-component-button {
  width: 58px;
  /* color: #636d7e; */
  color: var(--cdp-color-blue);
  cursor: pointer;
  display: inline-block;
  position: relative;
  font-size: 11px;
  margin-top: 0;
  min-height: 60px;
  border-radius: 8px;
  background-color: transparent;
}
.enter-component-button:hover {
  background-color: #f1f3f8;
}
.enter-component-button-icon {
  display: flex;
  font-size: 24px;
  margin-top: 6px;
  justify-content: center;
}
.enter-component-button-text {
  display: block;
  overflow: hidden;
  max-width: 80px;
  margin-top: 4px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
