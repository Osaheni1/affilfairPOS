const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  ipcInvoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  ipcSend: (channel, ...args) => ipcRenderer.send(channel, ...args),
  ipcReceive: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(event, ...args)),
  ipcSendSync: (channel, ...args) => ipcRenderer.sendSync(channel, ...args),
});
