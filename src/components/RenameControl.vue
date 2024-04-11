<template>
  <div v-if="providerRef" class="rename-control">
    <div class="rename-control-header">
      <span class="rename-control-header-content">
        批量重命名当前目录下所有文件
      </span>
      <a
        v-if="hasNewVersion"
        :href="updateHref"
        target="_blank"
        class="rename-control-header-remote-version"
      >
        发现新版本：{{ remoteVersion }} 点击更新
      </a>
      <span
        v-else
        class="rename-control-header-local-version"
        title="点击检查更新"
        @click="checkVersion"
      >
        <component-icon
          v-if="getRemoteVersionLoading"
          name="loading"
        ></component-icon>
        当前版本：{{ localVersion }}
      </span>
    </div>
    <div v-if="providerRef.replaceParams" class="rename-control-body">
      <template v-if="providerRef.replaceParams.renameMode === 'series'">
        <div class="rename-control-body-item">
          <component-input
            v-model="providerRef.replaceParams.title"
            label="剧名"
            :disabled="isDisabled"
          ></component-input>
        </div>
        <div class="rename-control-body-item">
          <component-input
            v-model="providerRef.replaceParams.season"
            label="季数"
            type="number"
            :disabled="isDisabled"
          ></component-input>
        </div>
      </template>
      <template v-if="providerRef.replaceParams.renameMode === 'pattern'">
        <div class="rename-control-body-item">
          <component-input
            v-model="providerRef.replaceParams.pattern"
            label="正则"
            :disabled="isDisabled"
          ></component-input>
        </div>
        <div class="rename-control-body-item">
          <component-input
            v-model="providerRef.replaceParams.replace"
            label="替换文本"
            :disabled="isDisabled"
          ></component-input>
        </div>
      </template>
    </div>
    <div class="rename-control-footer">
      <div class="rename-control-footer-option">
        <component-radio
          v-model="providerRef.replaceParams.renameMode"
          label="series"
          :disabled="isDisabled"
        >
          剧集模式
        </component-radio>
        <component-radio
          v-model="providerRef.replaceParams.renameMode"
          label="pattern"
          :disabled="isDisabled"
        >
          正则模式
        </component-radio>
        <component-checkbox
          v-model="providerRef.replaceParams.autoEpisode"
          :disabled="isDisabled"
        >
          自动集数
        </component-checkbox>
      </div>
      <button
        class="rename-control-footer-button reset"
        :disabled="isDisabled"
        @click="onResetClick"
      >
        重置
      </button>
      <button
        class="rename-control-footer-button confirm"
        :disabled="!providerRef.shouldContinue || isDisabled"
        @click="onConfirmClick"
      >
        应用
      </button>
    </div>

    <component-loading v-if="providerRef.isControlLoading"></component-loading>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type { Provider } from "@/provider/interface";

import { inject, computed, defineComponent } from "vue";
import useVersion from "@/utils/useVersion";
import ComponentIcon from "@/components/Component/ComponentIcon.vue";
import ComponentInput from "@/components/Component/ComponentInput.vue";
import ComponentRadio from "@/components/Component/ComponentRadio.vue";
import ComponentLoading from "@/components/Component/ComponentLoading.vue";
import ComponentCheckbox from "@/components/Component/ComponentCheckbox.vue";

export default defineComponent({
  name: "RenameControl",
  components: {
    ComponentIcon,
    ComponentInput,
    ComponentRadio,
    ComponentLoading,
    ComponentCheckbox,
  },
  setup() {
    const version = useVersion();

    const providerRef = inject<Ref<Provider>>("providerRef");

    const isDisabled = computed(
      () =>
        providerRef?.value.replaceParamsDisabled || providerRef?.value.isLoading
    );
    const onResetClick = () => {
      providerRef?.value.reset();
    };

    const onConfirmClick = () => {
      providerRef?.value.batchRename();
    };

    return {
      ...version,
      providerRef,
      isDisabled,
      onResetClick,
      onConfirmClick,
    };
  },
});
</script>

<style scoped>
.rename-control {
  padding: var(--cdp-gutter);
  background: linear-gradient(
    180deg,
    var(--cdp-color-gray-50) 0%,
    var(--cdp-color-gray-100) 100%
  );
  box-shadow: var(--cdp-box-shadow-md);
  transition: box-shadow var(--cdp-transition-default);
  border-radius: var(--cdp-gutter);
}
.rename-control:hover {
  box-shadow: var(--cdp-box-shadow-xl);
}
.rename-control-header {
  display: flex;
  align-items: top;
  justify-content: space-between;
}
.rename-control-header-content {
  font-size: var(--cdp-font-size-lg);
}
.rename-control-header-local-version,
.rename-control-header-remote-version {
  cursor: pointer;
  font-size: var(--cdp-font-size-xs);
}
.rename-control-header-local-version:hover,
.rename-control-header-remote-version:hover {
  text-decoration: underline;
}
.rename-control-header-remote-version {
  color: var(--cdp-color-red);
}
.rename-control-body {
  display: grid;
  grid-gap: var(--cdp-gutter);
  align-items: end;
  grid-template-columns: 1fr 1fr;
}
.rename-control-footer {
  display: grid;
  grid-gap: var(--cdp-gutter);
  margin-top: var(--cdp-gutter);
  grid-template-columns: 1fr auto auto;
}
.rename-control-footer-option {
  display: flex;
  align-items: center;
}
.rename-control-footer-button {
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: var(--cdp-font-size);
  transition: var(--cdp-transition-all);
  line-height: 1;
  background-color: transparent;
}
.rename-control-footer-button.reset {
  color: var(--cdp-color-gray-900);
}
.rename-control-footer-button.reset:hover {
  color: var(--cdp-color-gray-700);
}
.rename-control-footer-button.confirm {
  color: var(--cdp-color-blue);
}
.rename-control-footer-button.confirm:hover {
  color: var(--cdp-color-blue-700);
}
.rename-control-footer-button[disabled] {
  color: var(--cdp-color-gray-300);
  cursor: not-allowed;
}
.rename-control-footer-button[disabled]:hover {
  color: var(--cdp-color-gray-400);
}
</style>
