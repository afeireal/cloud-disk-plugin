import type { IListItem, IOriginListItem } from "@/provider/interface";

import {
  Provider,
  LIST_ITEM_STATUS_READY,
  LIST_ITEM_STATUS_PENDING,
  LIST_ITEM_STATUS_SUCCESS,
  LIST_ITEM_STATUS_FAIL,
} from "@/provider/interface";
import EnterComponent from "./EnterComponent.vue";
import querySelector from "@/utils/querySelector";
import fileNameParse from "@/utils/fileNameParse";
import { ROOT_ELEMENT_INSERT_METHOD_APPEND } from "@/provider/interface";
import { findReactFiberNode, getRootReactContainer } from "@/utils/reactFiber";

export default class ProviderAli extends Provider {
  static test = () =>
    /^https:\/\/www\.ali(pan|yundrive)\.com\/drive\/file\/(all|backup|resource)/.test(
      location.href
    );

  type = "ali";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget = "[class^=nav-tab-content--]";
  rootElementInsertMethod = ROOT_ELEMENT_INSERT_METHOD_APPEND;

  EnterComponent = () => EnterComponent;

  private _rootReactContainerSelectors = "#root";

  async getOriginList() {
    const rootReactContainer = await getRootReactContainer(this._rootReactContainerSelectors, true);

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.localStore?.listModel?.listModel
    );

    if (!reactFiberNode) {
      return Promise.reject();
    }

    const listModel = reactFiberNode.pendingProps.localStore.listModel.listModel;

    while (listModel.nextMarker) {
      await listModel.loadMoreData();
    }

    const originList = reactFiberNode.pendingProps.localStore.list;

    if (!originList) {
      return Promise.reject();
    }

    const result: IOriginListItem[] = [];
    let index = 0;
    originList.forEach((item: any) => {
      if (item.type === "file") {
        result.push({
          id: item.fileId,
          index: index++,
          fullFileName: item.name,
          ...fileNameParse(item.name),
        });
      }
    });

    return result;
  }

  async renameRequest(data: IListItem[]) {
    const rootReactContainer = await getRootReactContainer(this._rootReactContainerSelectors, true);

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.localStore?.list
    );

    if (!reactFiberNode) {
      return Promise.reject();
    }

    const originListMap = new Map(
      reactFiberNode.pendingProps.localStore.list.map((item: any) => [item.fileId, item])
    );

    const taskList: { item: IListItem; originItem: any }[] = [];

    data.forEach((item) => {
      const originItem: any = originListMap.get(item.id);
      if (originItem) {
        item.status = LIST_ITEM_STATUS_READY;
        return taskList.push({ item, originItem });
      } else {
        item.status = LIST_ITEM_STATUS_FAIL;
      }
    });

    while (taskList.length) {
      const { item, originItem } = taskList.shift() as {
        item: IListItem;
        originItem: any;
      };

      item.status = LIST_ITEM_STATUS_PENDING;
      this._updateStatus();
      try {
        await originItem.rename(item.newFileName);
        if (originItem.name === item.newFileName) {
          item.status = LIST_ITEM_STATUS_SUCCESS;
        } else {
          item.status = LIST_ITEM_STATUS_FAIL;
        }
      } catch (error) {
        item.status = LIST_ITEM_STATUS_FAIL;
      }
      this._updateStatus();
    }

    return Promise.resolve();
  }

  async refresh() {
    const rootReactContainer = await getRootReactContainer(this._rootReactContainerSelectors, true);

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.localStore?.listModel?.reload
    );

    if (!reactFiberNode) {
      location.reload();
      return Promise.resolve();
    }

    const tbodyScroller = querySelector(
      "[class^=node-list-table-view--]>[class^=tbody--]>div>[class^=scroller---]"
    );

    if (tbodyScroller) {
      tbodyScroller.scrollTop = 0;
    }

    const reload = reactFiberNode.pendingProps.localStore.listModel.reload;

    return reload();
  }
}
