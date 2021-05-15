console.log("Script ready!");
let ifc = "";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse("Event success!");
  if(request.type == "chunk"){
    ifc += request.ifcData;
  }
  else if(request.type == "last"){
    if (document.body.firstChild) document.body.firstChild.remove();
    storeWasmUrl();
    storeIfcData(request.ifcData);
    createThreeScene();
  }
});

function storeWasmUrl() {
  document.body.setAttribute(
    "wasmURL",
    chrome.runtime.getURL("web-ifc.wasm")
  );
}

function storeIfcData(ifcData){
  ifc += ifcData;
  document.body.setAttribute("ifc", ifc);
  ifc = "";
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
  script.setAttribute("src", chrome.extension.getURL("bundle.js"));
  const head = getHead();
  head.insertBefore(script, head.lastChild);
}
