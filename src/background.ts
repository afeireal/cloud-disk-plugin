import browser from "webextension-polyfill";

const urlSchemes = [
  "https://pan.quark.cn/*",
  "https://pan.baidu.com/*",
  "https://www.alipan.com/*",
  "https://www.aliyundrive.com/*",
];

const urlRegExp =
  /^https:\/\/pan.quark.cn|^https:\/\/pan\.baidu\.com|^https:\/\/www\.ali(pan|yundrive)\.com/;

const iconPath = chrome.runtime.getURL("logo.png");
const iconDisabledPath = chrome.runtime.getURL("logo_grey.png");

const updateIcon = (tabId: number) => {
  browser.tabs.get(tabId).then((tab) => {
    const isMatched = tab.url && urlRegExp.test(tab.url);
    if (isMatched) {
      browser.action.setIcon({ path: iconPath });
    } else {
      browser.action.setIcon({ path: iconDisabledPath });
    }
  });
};

browser.tabs.onActivated.addListener(function (event: any) {
  updateIcon(event.tabId);
});

browser.tabs.onUpdated.addListener(function (tabId: number) {
  updateIcon(tabId);
});

browser.webNavigation.onDOMContentLoaded.addListener(
  function (event) {
    if (event.frameId === 0) {
      chrome.scripting.executeScript({
        world: "MAIN",
        files: ["src/main.js"],
        target: { tabId: event.tabId },
      });
    }
  },
  {
    url: urlSchemes.map((item) => ({ urlMatches: item })),
  }
);

browser.action.onClicked.addListener(function (event: any) {
  const isMatched = event.url && urlRegExp.test(event.url);
  if (isMatched) {
    chrome.scripting.executeScript({
      func: () => {
        new Function(`window._toggleCloudDiskPlugin()`)();
      },
      world: "MAIN",
      target: { tabId: event.id },
    });
  }
});

browser.runtime.onInstalled.addListener(function () {
  console.log("onInstalled");
});
