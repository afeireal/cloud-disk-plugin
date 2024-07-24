import type { IListItem, IOriginListItem } from "@/provider/interface";

import EnterComponent from "./EnterComponent.vue";
import Provider from "@/provider/interface";
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
    originList.forEach((item: any) => {
      if (item.type === "file") {
        result.push({
          id: item.fileId,
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
        item.status = "ready";
        return taskList.push({ item, originItem });
      } else {
        item.status = "fail";
      }
    });

    while (taskList.length) {
      const { item, originItem } = taskList.shift() as {
        item: IListItem;
        originItem: any;
      };

      item.status = "pending";
      this._updateStatus();
      try {
        await originItem.rename(item.newFileName);
        if (originItem.name === item.newFileName) {
          item.status = "success";
        } else {
          item.status = "fail";
        }
      } catch (error) {
        item.status = "fail";
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
