import type { Ref, ComputedRef } from "vue";

import { ref, computed, onMounted } from "vue";
import message from "@/utils/message";

const useVersion = () => {
  const oneDay = 86400000;
  const regexp = /@version\s+(.+)\n/;

  const updateHref = import.meta.env.VITE_PLUGIN_UPDATE_URL;
  const localVersion = import.meta.env.VITE_VERSION;
  const remoteVersion = ref(localStorage.getItem("cdp_remoteVersion") || "");
  const hasNewVersion = computed(
    () => remoteVersion.value && localVersion !== remoteVersion.value
  );
  const getRemoteVersionLoading = ref(false);

  let checkVersionTime: number = parseInt(
    localStorage.getItem("cdp_checkVersionTime") || "0"
  );

  let getRemoteVersionInstance: Promise<void>;
  const getRemoteVersion = () => {
    if (getRemoteVersionLoading.value) {
      return getRemoteVersionInstance;
    }

    getRemoteVersionLoading.value = true;

    const now = Date.now();

    getRemoteVersionInstance = fetch(
      `${import.meta.env.VITE_PLUGIN_META_URL}?t=${now}`
    )
      .then((res) => {
        if (res.ok) {
          return res.text();
        } else {
          return Promise.reject(new Error("getRemoteVersion error"));
        }
      })
      .then((res) => {
        checkVersionTime = now;
        localStorage.setItem("cdp_checkVersionTime", checkVersionTime + "");
        remoteVersion.value = regexp.exec(res)?.[1] || "";
        localStorage.setItem("cdp_remoteVersion", remoteVersion.value);
      })
      .finally(() => {
        getRemoteVersionLoading.value = false;
      });

    return getRemoteVersionInstance;
  };

  let checkVersionInstance: Promise<void>;
  const checkVersion = () => {
    if (getRemoteVersionLoading.value) {
      return checkVersionInstance;
    }
    checkVersionInstance = getRemoteVersion()
      .then(() => {
        message.success(
          hasNewVersion.value
            ? `发现新版本：${remoteVersion.value}`
            : "当前已是最新版本"
        );
      })
      .catch(() => {
        message.error("查询更新失败");
      });
    return checkVersionInstance;
  };

  onMounted(() => {
    if (
      !checkVersionTime ||
      Date.now() - new Date(checkVersionTime).setHours(0, 0, 0, 0) > oneDay
    ) {
      getRemoteVersion();
    }
  });

  return {
    updateHref,
    localVersion,
    remoteVersion,
    hasNewVersion,
    getRemoteVersionLoading,
    checkVersion,
  };
};

export interface IVersion {
  updateHref: string;
  localVersion: string;
  remoteVersion: Ref<string>;
  hasNewVersion: ComputedRef<boolean>;
  getRemoteVersionLoading: Ref<boolean>;
  checkVersion: () => Promise<void>;
}

export default useVersion;
