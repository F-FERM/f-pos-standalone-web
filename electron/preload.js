const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,

  isElectron: true,

  getAppVersion: () => {
    return process.env.npm_package_version;
  },
});
