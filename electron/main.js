const { app, BrowserWindow } = require("electron");

const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let nextServer;

const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,

    minWidth: 1100,
    minHeight: 700,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");

    mainWindow.webContents.openDevTools();
  } else {
    startNextServer();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startNextServer() {
  const nextPath = path.join(process.resourcesPath, ".next");

  nextServer = spawn(
    process.platform === "win32" ? "node.exe" : "node",
    [
      path.join(
        process.resourcesPath,
        "node_modules",
        "next",
        "dist",
        "bin",
        "next",
      ),
      "start",
      "-p",
      "3000",
    ],
    {
      cwd: process.resourcesPath,
      windowsHide: true,
    },
  );

  nextServer.stdout.on("data", (data) => {
    console.log(`Next.js: ${data}`);
  });

  nextServer.stderr.on("data", (data) => {
    console.error(`Next.js error: ${data}`);
  });

  setTimeout(() => {
    mainWindow.loadURL("http://localhost:3000");
  }, 1500);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextServer) {
    nextServer.kill();
  }
});
