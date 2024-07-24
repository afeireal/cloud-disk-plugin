import type { Ref, ComputedRef } from "vue";

import { ref, computed, onMounted } from "vue";
import message from "@/utils/message";

const oneDay = 86400000;
const regexp = /@version\s+(.+)\n/;

const pluginMode: "tamper-monkey" | "web-extension" = import.meta.env.VITE_PLUGIN_MODE;
const updateHref: string = import.meta.env.VITE_PLUGIN_UPDATE_URL;
const localVersion: string = import.meta.env.VITE_VERSION;

const useVersion = () => {
  if (pluginMode === "web-extension") {
    return {
      versionVisible: false,
    };
  }
  // const remoteVersion = ref(
  //   pluginMode === "web-extension" ? localVersion : localStorage.getItem("cdp_remoteVersion") || ""
  // );
  const remoteVersion = ref(localStorage.getItem("cdp_remoteVersion"));
  const compareVersions = computed(() => {
    if (!remoteVersion.value || !localVersion) {
      return 0;
    }
    const localVersionList = localVersion.split(".").map((item) => parseInt(item) || 0);
    const remoteVersionList = remoteVersion.value.split(".").map((item) => parseInt(item) || 0);
    const len = Math.max(localVersionList.length, remoteVersionList.length);
    for (let index = 0; index < len; index++) {
      if (localVersionList[index] < remoteVersionList[index]) {
        return 1;
      } else if (localVersionList[index] > remoteVersionList[index]) {
        return -1;
      }
    }
    return 0;
  });
  const hasNewVersion = computed(() => compareVersions.value === 1);
  const versionLoading = ref(false);

  let checkVersionTime: number = parseInt(localStorage.getItem("cdp_checkVersionTime") || "0");

  let getRemoteVersionInstance: Promise<void>;
  const getRemoteVersion = () => {
    // if (pluginMode === "web-extension") {
    //   checkVersionTime = Date.now();
    //   localStorage.setItem("cdp_checkVersionTime", checkVersionTime + "");
    //   remoteVersion.value = localVersion;
    //   localStorage.setItem("cdp_remoteVersion", remoteVersion.value);
    //   return Promise.resolve();
    // }
    if (versionLoading.value) {
      return getRemoteVersionInstance;
    }

    versionLoading.value = true;

    const now = Date.now();

    getRemoteVersionInstance = fetch(`${import.meta.env.VITE_PLUGIN_META_URL}?t=${now}`)
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
        versionLoading.value = false;
      });

    return getRemoteVersionInstance;
  };

  let checkVersionInstance: Promise<void>;
  const checkVersion = () => {
    if (versionLoading.value) {
      return checkVersionInstance;
    }
    checkVersionInstance = getRemoteVersion()
      .then(() => {
        message.success(
          compareVersions.value === 1
            ? `发现新版本：${remoteVersion.value}`
            : compareVersions.value === -1
              ? "当前版本已超过最新版本"
              : "当前版本已是最新版本"
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
    versionLoading,
    versionVisible: true,
    checkVersion,
  };
};

export interface IVersion {
  updateHref?: string;
  localVersion?: string;
  remoteVersion?: Ref<string>;
  hasNewVersion?: ComputedRef<boolean>;
  versionLoading?: Ref<boolean>;
  versionVisible: boolean;
  checkVersion?: () => Promise<void>;
}

export default useVersion;
