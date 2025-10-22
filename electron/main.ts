import {app, BrowserWindow, ipcMain, shell} from "electron";
import {electronApp, is, optimizer} from "@electron-toolkit/utils";
import * as fs from "node:fs";
import * as process from "node:process";

const path = require("node:path");

const isDev = !!(is.dev && process.env["ELECTRON_RENDERER_URL"]);
// appData Per-user application data directory, which by default points to:
// %APPDATA% on Windows
// $XDG_CONFIG_HOME or ~/.config on Linux
// ~/Library/Application Support on macOS
const userDataPath = app.getPath("userData");

function createWindow(): void {
    const preloadPath = path.join(__dirname, "../preload/index.mjs");
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 640,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? {} : {}), //app-icon
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return {action: "deny"};
    });

    if (isDev) {
        console.log("is development");
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]!);
    } else {
        console.log("is production");
        console.log(path.join(__dirname, "../renderer/index.html"))
        mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    }
}

app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    const getPublicPath = () => {
        if (isDev) {
            console.log("dev public path");
            return path.join(__dirname, "../../public");
        } else {
            console.log("prod public path");
            return path.join(__dirname, "../renderer");
        }
    }

    const safeReadFile = async (filePath: string): Promise<string> => {
        const exists = fs.existsSync(filePath);
        if (!exists) {
            fs.mkdirSync(filePath.substring(0, filePath.lastIndexOf("\\")), {recursive: true});
            await fs.promises.writeFile(filePath, "", {encoding: "utf-8"});
            return "";
        }
        return await fs.promises.readFile(filePath, {encoding: "utf-8"});
    }

    ipcMain.handle("read:json", async (_, filePath: string) => {
        const fullPath = path.join(userDataPath, filePath);
        const data = await safeReadFile(fullPath);
        return {data};
    })

    ipcMain.handle("exists", async (_, filePath: string) => {
        const fullPath = path.join(userDataPath, filePath);
        return fs.existsSync(fullPath);
    })

    ipcMain.handle("write:json", async (_, filePath: string, data: string) => {
        const fullPath = path.join(userDataPath, filePath);
        await safeReadFile(fullPath);
        await fs.promises.writeFile(fullPath, data, {encoding: "utf-8"});
        return data;
    })

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});