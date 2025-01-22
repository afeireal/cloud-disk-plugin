import type { IListItem, IOriginListItem } from "@/provider/interface";

import {
  Provider,
  LIST_ITEM_STATUS_READY,
  LIST_ITEM_STATUS_SUCCESS,
  LIST_ITEM_STATUS_FAIL,
  ROOT_ELEMENT_INSERT_METHOD_APPEND,
} from "@/provider/interface";
import EnterComponent from "./EnterComponent.vue";
import fileNameParse from "@/utils/fileNameParse";
import querySelector from "@/utils/querySelector";

interface renameFetchHeaders {
  Authorization?: string;
  "X-Device-Id"?: string;
  "X-Captcha-Token"?: string;
}

export default class ProviderQuark extends Provider {
  static test = () => /^https:\/\/mypikpak.com\/drive\/all/.test(location.href);

  type = "pikpak";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget = "#app .sidebar .overflow-middle-bar .nav";

  rootElementInsertMethod = ROOT_ELEMENT_INSERT_METHOD_APPEND;

  EnterComponent = () => EnterComponent;

  async getOriginList() {
    const vue = this._getVue();

    const originList = vue?.config?.globalProperties?.$pinia?.state?.value?.file?.dbFiles;

    if (!originList) {
      return Promise.reject();
    }

    const result: IOriginListItem[] = [];
    let index = 0;
    originList.forEach((item: any) => {
      if (item.kind === "drive#file") {
        result.push({
          id: item.id,
          index: index++,
          fullFileName: item.name,
          ...fileNameParse(item.name),
        });
      }
    });
    return result;
  }

  async renameRequest(data: IListItem[]) {
    const tasks = data.map((item) => {
      item.status = LIST_ITEM_STATUS_READY;
      return item;
    });
    const captchaKey = Object.keys(localStorage).find((item) => item.startsWith("captcha_"));
    const credentialsKey = Object.keys(localStorage).find((item) =>
      item.startsWith("credentials_")
    );
    if (!captchaKey || !credentialsKey) {
      return Promise.reject();
    }
    try {
      const headers: renameFetchHeaders = {};
      const captcha = JSON.parse(localStorage[captchaKey]);
      headers["X-Captcha-Token"] = captcha.captcha_token;
      const credentials = JSON.parse(localStorage[credentialsKey]);
      headers.Authorization = `${credentials.token_type} ${credentials.access_token}`;
      if (localStorage.deviceid) {
        const deviceid = localStorage.deviceid.match(/^.+\.(.{32})/)?.[1];
        if (deviceid) {
          headers["X-Device-Id"] = deviceid;
        }
      }

      while (tasks.length) {
        const task = tasks.shift() as IListItem;
        await this.renameFetch(task, headers);
      }
      this.refresh();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  renameFetch(data: IListItem, headers: renameFetchHeaders) {
    this._updateStatus();
    return fetch(`https://api-drive.mypikpak.com/drive/v1/files/${data.id}`, {
      body: JSON.stringify({ name: data.newFileName }),
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(res);
        }
      })
      .then((res) => {
        if (res.error_code || res.error_description) {
          return Promise.reject(res);
        }
        data.status = LIST_ITEM_STATUS_SUCCESS;
      })
      .catch(() => {
        data.status = LIST_ITEM_STATUS_FAIL;
      })
      .finally(() => {
        this._updateStatus();
      });
  }

  async refresh() {
    const vue = this._getVue();
    const router = vue.config.globalProperties.$router;
    if (!router.hasRoute("cdp_refresh")) {
      const routeAll = router.options.routes.find((item: any) => item.name === "all");
      router.addRoute({
        path: "/cdp_refresh",
        name: "cdp_refresh",
        meta: { ...routeAll.meta, noAuth: true },
        component: () =>
          Promise.resolve({
            render() {
              return "";
            },
            beforeRouteEnter(to: any, from: any, next: any) {
              next((vm: any) => {
                vm.$router.replace(from.fullPath);
              });
            },
          }),
      });
    }
    router.push("/cdp_refresh");
  }

  private _vueInstance?: any;
  private _getVue(): any | undefined {
    if (this._vueInstance) {
      return this._vueInstance;
    }

    const element: any = querySelector("#app");

    if (!element?.__vue_app__) {
      return;
    }

    this._vueInstance = element.__vue_app__;

    return this._vueInstance;
  }
}
