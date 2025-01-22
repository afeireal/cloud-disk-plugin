import type { IListItem, IOriginListItem } from "@/provider/interface";

import {
  Provider,
  LIST_ITEM_STATUS_READY,
  LIST_ITEM_STATUS_PENDING,
  LIST_ITEM_STATUS_SUCCESS,
  LIST_ITEM_STATUS_FAIL,
  ROOT_ELEMENT_INSERT_METHOD_APPEND,
} from "@/provider/interface";
import EnterComponent from "./EnterComponent.vue";
import sleep from "@/utils/sleep";
import querySelector from "@/utils/querySelector";
import fileNameParse from "@/utils/fileNameParse";

export default class ProviderBaidu extends Provider {
  static test = () =>
    /^https:\/\/pan\.baidu\.com\/disk\/main(.+)?#\/index\?category=all/.test(location.href);

  type = "baidu";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget = ".wp-s-aside-nav__main-top";
  rootElementInsertMethod = ROOT_ELEMENT_INSERT_METHOD_APPEND;
  maxTask = 50;

  EnterComponent = () => EnterComponent;

  async getOriginList() {
    const vue = this._getVue();

    while (vue.listConf.hasMore) {
      vue?.getNextData();
      while (vue?.listLoading) {
        await sleep(100);
      }
    }

    const originList = vue?.fileList;

    if (!originList) {
      return Promise.reject();
    }

    const result: IOriginListItem[] = [];
    let index = 0;
    originList.forEach((item: any) => {
      if (item.isdir === 0) {
        result.push({
          id: item.fs_id,
          path: item.path,
          index: index++,
          fullFileName: item.formatName,
          ...fileNameParse(item.formatName),
        });
      }
    });

    return result;
  }

  async renameRequest(data: IListItem[]) {
    const token = this._vueInstance?.yunData?.bdstoken;
    if (!token) {
      return Promise.reject();
    }
    // 任务切片
    const tasks: IListItem[][] = [];
    data.forEach((item, index) => {
      const key = Math.floor(index / this.maxTask);
      if (!tasks[key]) {
        tasks[key] = [];
      }
      item.status = LIST_ITEM_STATUS_READY;
      tasks[key].push(item);
    });

    try {
      while (tasks.length) {
        const task = tasks.shift() as IListItem[];
        await this.renameTask(task, token);
      }
      this.refresh();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async renameTask(data: IListItem[], token: string) {
    const body = new FormData();
    const filelist = data.map((item) => {
      item.status = LIST_ITEM_STATUS_PENDING;
      return {
        id: item.id,
        path: item.path,
        newname: item.newFileName,
      };
    });
    this._updateStatus();
    body.append("filelist", JSON.stringify(filelist));
    this._vueInstance.editLoading = true;
    return fetch(
      `https://pan.baidu.com/api/filemanager?async=2&onnest=fail&opera=rename&bdstoken=${token}&clienttype=0&app_id=250528&web=1`,
      {
        body,
        method: "POST",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          data.forEach((item) => {
            item.status = LIST_ITEM_STATUS_FAIL;
          });
          return Promise.reject(res);
        }
      })
      .then(async (res: any) => {
        if (res.errno !== 0) {
          data.forEach((item) => {
            item.status = LIST_ITEM_STATUS_FAIL;
          });
          return Promise.reject(res);
        }
        this._vueInstance.renameFileList = filelist;
        const result = res.taskid ? await this.waitPollTaskResult(res) : res;

        data.forEach((item) => {
          item.status = LIST_ITEM_STATUS_SUCCESS;
        });
        return result;
      });
  }

  async refresh() {
    const vue = this._getVue();

    if (!vue?.reloadList) {
      location.reload();
      return Promise.resolve();
    }

    vue.reloadList();

    return new Promise<void>((resolve) => {
      let count = 20;
      const timer = setInterval(() => {
        if (vue.$store.state.fileList.loadingList === false || --count < 0) {
          resolve();
          clearInterval(timer);
        }
      }, 500);
    });
  }

  async waitPollTaskResult(res: any): Promise<any> {
    this._vueInstance?.pollTask(res.taskid);
    // 延迟时间，等待百度网盘更新，对比更新结果
    while (this._vueInstance?.editLoading) {
      await sleep(100);
    }

    // let count = 10;
    // const timeout = Math.max(data.length * 50, 1000);

    // while (count-- > 0) {
    //   await this.refresh();
    //   const originList: IOriginListItem[] = await this.getOriginList();
    //   const originListMap = new Map(
    //     originList.map((item) => [item.id, item.fullFileName])
    //   );
    //   let isMatched = true;
    //   data.forEach((item) => {
    //     if (
    //       originListMap.has(item.id) &&
    //       originListMap.get(item.id) === item.newFileName
    //     ) {
    //       item.status = LIST_ITEM_STATUS_SUCCESS;
    //     } else {
    //       isMatched = false;
    //     }
    //   });
    //   if (!isMatched) {
    //     await sleep(timeout);
    //   } else {
    //     return res;
    //   }
    // }
  }

  private _vueInstance?: any;
  private _getVue(): any | undefined {
    if (this._vueInstance) {
      return this._vueInstance;
    }

    const element: any = querySelector(".nd-main-list, .nd-new-main-list");

    if (!element?.__vue__) {
      return;
    }

    this._vueInstance = element.__vue__;

    return this._vueInstance;
  }
}
