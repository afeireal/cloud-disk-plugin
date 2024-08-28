<template>
  <div v-if="providerRef" class="rename-preview">
    <div class="rename-preview-status">
      <span
        v-for="item in providerRef.statusList"
        :key="item.icon && item.title ? item.icon + item.title : item.message"
        class="rename-preview-status-item"
        :class="item.className"
        :title="item.title"
      >
        <component-icon
          v-if="item.icon"
          :name="item.icon"
          fill="currentColor"
          class="rename-preview-status-item-icon"
        ></component-icon>
        {{ item.message }}
      </span>
    </div>
    <div class="rename-preview-content">
      <div class="rename-preview-content-grid">
        <ul class="rename-preview-content-grid-header">
          <li
            class="rename-preview-content-grid-item"
            :class="{
              'is-error': providerRef.hasError,
              'is-change': providerRef.hasChange,
              'is-checked': !providerRef.hasUncheckedAll,
            }"
          >
            <div class="rename-preview-content-grid-item-checkbox">
              <component-checkbox
                :model-value="providerRef.hasCheckedAll"
                :indeterminate="!providerRef.hasCheckedAll && !providerRef.hasUncheckedAll"
                @update:model-value="onCheckedAllUpdate"
              ></component-checkbox>
            </div>
            <div class="rename-preview-content-grid-item-old-file-name">原文件名</div>
            <div class="rename-preview-content-grid-item-right-arrow">⮕</div>
            <div class="rename-preview-content-grid-item-new-file-name">新文件名</div>
            <div class="rename-preview-content-grid-item-new-file-status">
              <component-icon
                :name="
                  providerRef.hasError
                    ? 'frown'
                    : !providerRef.hasChange
                      ? 'meh'
                      : providerRef.shouldContinue
                        ? 'smile'
                        : ''
                "
              ></component-icon>
            </div>
          </li>
        </ul>
        <ul class="rename-preview-content-grid-body">
          <li
            v-for="item in currentList"
            :key="item.id"
            class="rename-preview-content-grid-item"
            :class="{
              'is-error': item.isError,
              'is-change': item.isChange,
              'is-checked': item.isChecked,
            }"
          >
            <div class="rename-preview-content-grid-item-checkbox">
              <component-checkbox
                :model-value="item.isChecked"
                :readonly="item.status !== 'none'"
                @update:model-value="onItemIsCheckedUpdate(item, $event)"
              ></component-checkbox>
            </div>
            <div class="rename-preview-content-grid-item-old-file-name" :title="item.oldFileName">
              {{ item.oldFileName }}
            </div>
            <div class="rename-preview-content-grid-item-right-arrow">⮕</div>
            <div class="rename-preview-content-grid-item-new-file-name" :title="item.newFileName">
              {{ item.newFileName }}
            </div>
            <div class="rename-preview-content-grid-item-new-file-status">
              <component-icon
                :name="
                  item.status === 'ready'
                    ? 'timeCircle'
                    : item.status === 'pending'
                      ? 'loading'
                      : item.status === 'success'
                        ? 'checkCircle'
                        : item.status === 'fail'
                          ? 'close'
                          : ''
                "
              ></component-icon>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <component-loading v-if="providerRef.isPreviewLoading"></component-loading>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type { Provider, IListItem } from "@/provider/interface";

import { ref, inject, onMounted, onUnmounted, defineComponent } from "vue";
import ComponentIcon from "@/components/Component/ComponentIcon.vue";
import ComponentLoading from "@/components/Component/ComponentLoading.vue";
import ComponentCheckbox from "@/components/Component/ComponentCheckbox.vue";

export default defineComponent({
  name: "RenamePreview",
  components: {
    ComponentIcon,
    ComponentLoading,
    ComponentCheckbox,
  },
  setup() {
    const providerRef = inject<Ref<Provider>>("providerRef");

    const currentList = ref<IListItem[]>(providerRef?.value.currentList || []);

    const onCurrentListUpdate = (val: IListItem[]) => {
      currentList.value = val;
    };

    const onCheckedAllUpdate = (val: boolean) => {
      providerRef?.value.updateCheckedAll(val);
    };

    const onItemIsCheckedUpdate = (item: IListItem, val: boolean) => {
      providerRef?.value.updateItemIsCheck(item, val);
    };

    onMounted(() => {
      providerRef?.value.onCurrentListUpdate(onCurrentListUpdate);
    });

    onUnmounted(() => {
      providerRef?.value.offCurrentListUpdate(onCurrentListUpdate);
    });

    return {
      providerRef,
      currentList,
      onCheckedAllUpdate,
      onItemIsCheckedUpdate,
    };
  },
});
</script>

<style scoped>
.rename-preview {
  display: grid;
  grid-gap: var(--cdp-gutter);
  grid-template-rows: auto minmax(200px, 1fr);
}
.rename-preview-status {
  margin: 0 calc(0px - var(--cdp-gutter) / 2);
  display: flex;
  flex-wrap: wrap;
  font-size: var(--cdp-font-size-sm);
  align-items: center;
  line-height: var(--cdp-line-height-sm);
}
.rename-preview-status-item {
  margin: calc(var(--cdp-gutter) / 2);
  display: flex;
  align-items: center;
}
.rename-preview-status-item.blue {
  color: var(--cdp-color-blue);
}
.rename-preview-status-item.red {
  color: var(--cdp-color-red);
}
.rename-preview-status-item.gray {
  color: var(--cdp-color-gray);
}
.rename-preview-status-item.green {
  color: var(--cdp-color-green);
}
.rename-preview-status-item.yellow {
  color: var(--cdp-color-yellow);
}
.rename-preview-status-item-icon {
  color: inherit;
  font-size: var(--cdp-font-size);
}
.rename-preview-content-grid {
  height: 100%;
  overflow: auto;
  position: relative;
  max-height: 50vh;
}
.rename-preview-content-grid-body,
.rename-preview-content-grid-header {
  display: grid;
  grid-gap: var(--cdp-gutter);
  font-size: var(--cdp-font-size-sm);
  line-height: 1;
  grid-auto-rows: 1em;
  grid-template-columns: auto minmax(200px, 1fr) auto minmax(200px, 1fr) 2em;
}
.rename-preview-content-grid-header {
  top: 0;
  z-index: 1;
  position: sticky;
  margin-bottom: var(--cdp-gutter);
  background-color: var(--cdp-color-white);
}
.rename-preview-content-grid-item {
  color: var(--cdp-color-gray-300);
  display: contents;
  transition: color var(--cdp-transition-default);
}
.rename-preview-content-grid-item.is-checked {
  color: var(--cdp-color-gray-600);
}
.rename-preview-content-grid-item.is-checked.is-change {
  color: var(--cdp-color-gray-900);
}
.rename-preview-content-grid-item.is-checked.is-error {
  color: var(--cdp-color-red);
}
.rename-preview-content-grid-item-old-file-name,
.rename-preview-content-grid-item-new-file-name,
.rename-preview-content-grid-item-new-file-status {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.rename-preview-content-grid-item-new-file-status {
  display: flex;
  text-align: right;
  align-items: center;
  padding-right: calc(var(--cdp-gutter) / 2);
  justify-content: flex-end;
}
</style>
