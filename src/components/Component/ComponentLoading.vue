<template>
  <div class="component-loading">
    <component-icon
      class="component-loading-icon"
      name="loading"
    ></component-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ComponentIcon from "@/components/Component/ComponentIcon.vue";

export default defineComponent({
  name: "ComponentLoading",
  components: {
    ComponentIcon,
  },
});
</script>

<style>
*:has(> .component-loading) {
  position: relative;
}
</style>
<style scoped>
.component-loading {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  z-index: 2000;
  display: flex;
  position: absolute;
  transition: opacity var(--cdp-el-transition-default);
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
}
.component-loading-icon {
  font-size: calc(var(--cdp-font-size) * 2);
}
</style>
