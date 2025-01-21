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
      <table class="rename-preview-content-table">
        <thead class="rename-preview-content-table-header">
          <tr
            class="rename-preview-content-table-item"
            :class="{
              'is-error': providerRef.hasError,
              'is-change': providerRef.hasChange,
              'is-checked': !providerRef.hasUncheckedAll,
            }"
          >
            <th class="rename-preview-content-table-item-checkbox">
              <component-checkbox
                :model-value="providerRef.hasCheckedAll"
                :indeterminate="!providerRef.hasCheckedAll && !providerRef.hasUncheckedAll"
                @update:model-value="onCheckedAllUpdate"
              ></component-checkbox>
            </th>
            <th class="rename-preview-content-table-item-index">
              <span
                class="rename-preview-content-table-item-index-reset-sort"
                title="重置排序"
                @click="onResetSort"
              >
                <component-icon
                  name="dCaret"
                  class="rename-preview-content-table-item-index-reset-sort-static"
                ></component-icon>
                <component-icon
                  name="sort"
                  class="rename-preview-content-table-item-index-reset-sort-hover"
                ></component-icon>
              </span>
              排序
            </th>
            <th class="rename-preview-content-table-item-old-file-name">原文件名</th>
            <th class="rename-preview-content-table-item-right-arrow">⮕</th>
            <th class="rename-preview-content-table-item-new-file-name">新文件名</th>
            <th class="rename-preview-content-table-item-new-file-status">
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
            </th>
          </tr>
        </thead>
        <tbody class="rename-preview-content-table-body">
          <tr
            v-for="item in currentList"
            :key="item.id"
            class="rename-preview-content-table-item"
            :class="{
              'is-error': item.isError,
              'is-change': item.isChange,
              'is-checked': item.isChecked,
              'allow-drop':
                item.status === 'none' &&
                (!providerRef.replaceParams.sortChecked || item.isChecked),
              'block-drop':
                item.status !== 'none' ||
                (providerRef.replaceParams.sortChecked && !item.isChecked),
            }"
          >
            <td class="rename-preview-content-table-item-checkbox">
              <component-checkbox
                :model-value="item.isChecked"
                :readonly="item.status !== 'none'"
                @update:model-value="onItemIsCheckedUpdate(item, $event)"
              ></component-checkbox>
            </td>
            <td class="rename-preview-content-table-item-index">
              <component-icon
                name="rank"
                class="rename-preview-content-table-item-index-handler"
              ></component-icon>
              <span class="rename-preview-content-table-item-index-content">
                {{ item.displayIndex }}
              </span>
            </td>

            <td class="rename-preview-content-table-item-old-file-name" :title="item.oldFileName">
              <component
                v-if="item.diffList"
                :is="oldFileNameDiffRender(item.diffList)"
              ></component>
              <template v-else>
                {{ item.oldFileName }}
              </template>
            </td>
            <td class="rename-preview-content-table-item-right-arrow">⮕</td>
            <td class="rename-preview-content-table-item-new-file-name" :title="item.newFileName">
              <component
                v-if="item.diffList"
                :is="newFileNameDiffRender(item.diffList)"
              ></component>
              <template v-else>
                {{ item.newFileName }}
              </template>
            </td>
            <td class="rename-preview-content-table-item-new-file-status">
              <component-icon :name="getStatusIcon(item.status)"></component-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <component-loading v-if="providerRef.isPreviewLoading"></component-loading>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type { Change } from "diff";
import type { Provider, IListItem, TListItemStatus } from "@/provider/interface";

import { h, ref, inject, onMounted, onUnmounted, defineComponent } from "vue";
import {
  LIST_ITEM_STATUS_READY,
  LIST_ITEM_STATUS_PENDING,
  LIST_ITEM_STATUS_SUCCESS,
  LIST_ITEM_STATUS_FAIL,
} from "@/provider/interface";
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

    const onResetSort = () => {
      providerRef?.value.resetSort();
    };

    const onCheckedAllUpdate = (val: boolean) => {
      providerRef?.value.updateCheckedAll(val);
    };

    const onItemIsCheckedUpdate = (item: IListItem, val: boolean) => {
      providerRef?.value.updateItemIsChecked(item, val);
    };

    const oldFileNameDiffRender = (diffList: Change[]) => {
      // same: !item.added && !item.removed,
      return () =>
        diffList
          .filter((item) => !item.added)
          .map((item) => h("span", { class: { removed: item.removed } }, item.value));
    };
    const newFileNameDiffRender = (diffList: Change[]) => {
      return () =>
        diffList
          .filter((item) => !item.removed)
          .map((item) => h("span", { class: { added: item.added } }, item.value));
    };

    const getStatusIcon = (status: TListItemStatus) => {
      switch (status) {
        // LIST_ITEM_STATUS_NONE
        case LIST_ITEM_STATUS_READY:
          return "timeCircle";
        case LIST_ITEM_STATUS_PENDING:
          return "loading";
        case LIST_ITEM_STATUS_SUCCESS:
          return "checkCircle";
        case LIST_ITEM_STATUS_FAIL:
          return "close";
        default:
          return "";
      }
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
      onResetSort,
      onCheckedAllUpdate,
      onItemIsCheckedUpdate,
      oldFileNameDiffRender,
      newFileNameDiffRender,
      getStatusIcon,
    };
  },
});
</script>

<style scoped>
.rename-preview {
  height: 100%;
  display: grid;
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

.rename-preview-content {
  width: 100%;
  height: 100%;
  margin: 0 calc(0px - var(--cdp-gutter) / 2);
  overflow: auto;
  max-height: 50vh;
}
.rename-preview-content-table {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: var(--cdp-font-size-sm);
  line-height: var(--cdp-font-size-sm);
}
.rename-preview-content-table-header {
  top: 0;
  z-index: 1;
  position: sticky;
  margin-bottom: var(--cdp-gutter);
  background-color: var(--cdp-color-white);
}
.rename-preview-content-table-header th {
  padding: var(--cdp-gutter) calc(var(--cdp-gutter) / 2);
  text-align: left;
  box-sizing: border-box;
}
.rename-preview-content-table-body td {
  padding: calc(var(--cdp-gutter) / 4) calc(var(--cdp-gutter) / 2);
  box-sizing: border-box;
}
.rename-preview-content-table-item {
  color: var(--cdp-color-gray-300);
  transition: color var(--cdp-transition-default);
  background-color: var(--cdp-color-white);
}
.rename-preview-content-table-item.is-checked {
  color: var(--cdp-color-gray-600);
}
.rename-preview-content-table-item.is-checked.is-change {
  color: var(--cdp-color-gray-900);
}
.rename-preview-content-table-item.is-checked.is-error {
  color: var(--cdp-color-red);
}
.rename-preview-content-table-item-placeholder {
  background-color: var(--cdp-color-blue-400);
}
.rename-preview-content-table-item-dragged {
  display: flex;
}
.rename-preview-content-table-item-checkbox {
  width: calc(var(--cdp-gutter) + 1em);
}
.rename-preview-content-table-item-index {
  width: 5rem;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* 标准语法 */
}
.rename-preview-content-table-item-index-reset-sort {
  cursor: pointer;
}
.rename-preview-content-table-item-index-reset-sort:hover
  .rename-preview-content-table-item-index-reset-sort-static {
  display: none;
}
.rename-preview-content-table-item-index-reset-sort-hover {
  display: none;
}
.rename-preview-content-table-item-index-reset-sort:hover
  .rename-preview-content-table-item-index-reset-sort-hover {
  display: inline-block;
}
.rename-preview-content-table-item.allow-drop .rename-preview-content-table-item-index-handler {
  cursor: grab;
}
.rename-preview-content-table-item.block-drop .rename-preview-content-table-item-index-handler {
  /* cursor: no-drop; */
  display: none;
}
.rename-preview-content-table-item-index-content {
  display: inline-block;
}
.rename-preview-content-table-item-old-file-name,
.rename-preview-content-table-item-new-file-name,
.rename-preview-content-table-item-new-file-status {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.rename-preview-content-table-item.is-checked
  .rename-preview-content-table-item-old-file-name:deep(.removed) {
  color: var(--cdp-color-red);
}
.rename-preview-content-table-item-old-file-name:deep(.removed) {
  background-color: var(--cdp-color-red-100);
}
.rename-preview-content-table-item.is-checked
  .rename-preview-content-table-item-new-file-name:deep(.added) {
  color: var(--cdp-color-green);
}
.rename-preview-content-table-item-new-file-name:deep(.added) {
  background-color: var(--cdp-color-green-100);
}

.rename-preview-content-table-item-right-arrow {
  width: calc(var(--cdp-gutter) + 1em);
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* 标准语法 */
}
.rename-preview-content-table-item-new-file-status {
  width: calc(var(--cdp-gutter) + 1em);
  text-align: right;
}
</style>
