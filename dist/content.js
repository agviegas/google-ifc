console.log("Script ready!");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse("Event received!");
  console.log(request);
  if (document.body.firstChild) document.body.firstChild.remove();
  storeWasmUrl();
  document.body.setAttribute("ifc", request.ifc);
  createThreeScene();
});

function storeWasmUrl() {
  document.body.setAttribute(
    "wasmURL",
    chrome.runtime.getURL("dist/web-ifc.wasm")
  );
}

function createThreeScene() {
  const canvas = document.createElement("canvas");
  canvas.id = "three-canvas";
  document.body.appendChild(canvas);
  addThreeScript();
}

function getHead() {
  return (
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement
  );
}

function addThreeScript() {
  const script = document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL("dist/bundle.js"));
  const head = getHead();
  head.insertBefore(script, head.lastChild);
}
