import type { Ref } from "vue";
import type Provider from "@/provider/interface";

import "@/style/index.css";
import { ref, createApp } from "vue";
import App from "@/App.vue";
import getProvider from "@/provider";
import sleep from "@/utils/sleep";
import querySelector from "@/utils/querySelector";

const providerRef: Ref<Provider | undefined> = ref();

const getProviderRef = (): Ref<Provider | undefined> => {
  const instance = getProvider();

  if (providerRef.value !== instance) {
    providerRef.value = instance;
    Object.assign(window, {
      _toggleCloudDiskPlugin: () => {
        if (providerRef.value) {
          providerRef.value.setVisible(!providerRef.value.visible);
        }
      },
    });
  }

  return providerRef;
};

const loop = () => {
  const providerRef = getProviderRef();
  if (!providerRef?.value) {
    return;
  }

  const target = querySelector(providerRef.value.rootElementInsertTarget);

  const rootElement = querySelector("#" + providerRef.value.rootElementId);

  if (target && !rootElement) {
    const app = createApp(App);
    app.provide("providerRef", providerRef);
    app.mount(
      (() => {
        const root = document.createElement("div");
        root.setAttribute("id", providerRef.value.rootElementId);
        target[providerRef.value.rootElementInsertMethod](root);
        return root;
      })()
    );
  }
};

const main = async () => {
  while (window?.parent === window) {
    loop();
    await sleep(300);
  }
};

main();
