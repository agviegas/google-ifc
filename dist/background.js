let tab = {};
//Makes sure that the content could be loaded before sending the message
const DELAY = 3000;
//Messages between background and content have a max capacity; larger IFC must be trimmed and sent in chunks
const CHUNK_SIZE = 50000000;

function response(response) {
  console.log(response);
}

function sendIfcChunks(allIfcData) {
  let i = 0;
  let j = CHUNK_SIZE;
  let ifcData = "";
  while (j < allIfcData.length) {
    ifcData = allIfcData.slice(i, j);
    chrome.tabs.sendMessage(tab.id, { type: "chunk", ifcData }, response);
    i += CHUNK_SIZE;
    j += CHUNK_SIZE;
  }
  return i;
}

function reqListener() {
  const i = sendIfcChunks(this.responseText);
  const ifcData = this.responseText.slice(i, this.responseText.length);
  chrome.tabs.sendMessage(tab.id, { type: "last", ifcData }, response);
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
  { urls: ["file://*.ifc"] }
);
