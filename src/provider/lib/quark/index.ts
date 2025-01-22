import type { IListItem, IOriginListItem } from "@/provider/interface";

import {
  Provider,
  LIST_ITEM_STATUS_READY,
  LIST_ITEM_STATUS_PENDING,
  LIST_ITEM_STATUS_SUCCESS,
  LIST_ITEM_STATUS_FAIL,
} from "@/provider/interface";
import EnterComponent from "./EnterComponent.vue";
import fileNameParse from "@/utils/fileNameParse";
import { ROOT_ELEMENT_INSERT_METHOD_PREPEND } from "@/provider/interface";
import sleep from "@/utils/sleep";
import { findReactFiberNode, getRootReactContainer } from "@/utils/reactFiber";

export default class ProviderQuark extends Provider {
  static test = () => /^https:\/\/pan.quark.cn\/list#\/list\//.test(location.href);

  type = "quark";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget =
    "#ice-container .section-main > .section-header.list-header > .btn-operate > .btn-main";

  rootElementInsertMethod = ROOT_ELEMENT_INSERT_METHOD_PREPEND;

  EnterComponent = () => EnterComponent;

  private _rootReactContainerSelectors = "#ice-container";

  async getOriginList() {
    const rootReactContainer = await getRootReactContainer(this._rootReactContainerSelectors, true);

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.store?.getState?.()?.file?.listType
    );

    if (!reactFiberNode) {
      return Promise.reject();
    }

    let state = reactFiberNode.pendingProps.store.getState();

    const hasMore =
      state.file[state.file.listType].list.length !== state.file[state.file.listType].total;
    if (hasMore) {
      await reactFiberNode.pendingProps.store.dispatch.file.loadAllFiles({
        params: {
          needTotalNum: 1,
          page: 1,
          size: state.file[state.file.listType].total,
          sort: state.file[state.file.listType].sort,
        },
        fid: state.file[state.file.listType].list[0].pdir_fid,
        listType: state.file.listType,
      });

      do {
        await sleep(300);
        state = reactFiberNode.pendingProps.store.getState();
      } while (
        state.file[state.file.listType].list.length !== state.file[state.file.listType].total
      );
    }
    const originList = state.file[state.file.listType].list;
    if (!originList) {
      return Promise.reject();
    }

    const result: IOriginListItem[] = [];
    let index = 0;
    originList.forEach((item: any) => {
      if (item.file) {
        result.push({
          id: item.fid,
          index: index++,
          fullFileName: item.file_name,
          ...fileNameParse(item.file_name),
        });
      }
    });

    return result;
  }

  async renameRequest(data: IListItem[]) {
    const rootReactContainer = await getRootReactContainer(this._rootReactContainerSelectors, true);

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.rename
    );

    if (!reactFiberNode) {
      return Promise.reject();
    }

    const taskList: IListItem[] = [];

    data.forEach((item) => {
      item.status = LIST_ITEM_STATUS_READY;
      taskList.push(item);
    });

    while (taskList.length) {
      const item = taskList.shift() as IListItem;

      item.status = LIST_ITEM_STATUS_PENDING;
      this._updateStatus();
      try {
        const res = await reactFiberNode.pendingProps.rename({
          fid: item.id,
          fileName: item.newFileName,
        });
        if (res.status === 200 && res.code === 0) {
          item.status = LIST_ITEM_STATUS_SUCCESS;
        } else {
          item.status = LIST_ITEM_STATUS_FAIL;
        }
      } catch (error) {
        item.status = LIST_ITEM_STATUS_FAIL;
      }
      this._updateStatus();
    }

    return this.refresh();
  }

  async refresh() {
    const rootReactContainer = await getRootReactContainer(this._rootReactContainerSelectors, true);

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.onRefresh
    );

    if (!reactFiberNode) {
      location.reload();
      return Promise.resolve();
    }

    const reload = reactFiberNode.pendingProps.onRefresh;

    return reload();
  }
}
