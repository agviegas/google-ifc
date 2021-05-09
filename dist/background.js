let tab = {};
const DELAY = 1000;

function messageCallback(response) {
  console.log(response);
}

function triggerSceneLoad(ifcData) {
  chrome.tabs.sendMessage(tab.id, { ifc: ifcData }, messageCallback);
}

function reqListener() {
  triggerSceneLoad(this.responseText);
}

function openIfc() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", tab.url);
  oReq.send();
}

function start() {
  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0]) return;
      tab = tabs[0];
      openIfc();
    });
  }, DELAY);
}

chrome.webRequest.onBeforeRequest.addListener(
  (event) => {
    if (event.type === "main_frame") start();
  },
  { urls: ["file://*"] }
);
