import {contextBridge, ipcRenderer} from "electron";
import {electronAPI} from "@electron-toolkit/preload";
import * as process from "node:process";

type IpcApiResponse<T = void> = Promise<{
    success: boolean;
    data: T;
    message?: string;
}>;
// Custom APIs for renderer
const IpcApi = {
    readUserData: (filePath: string): IpcApiResponse<string> => {
        return ipcRenderer.invoke("read:userData", filePath);
    },
    existsUserData: (filePath: string): IpcApiResponse<boolean> => {
        return ipcRenderer.invoke("exists:userData", filePath);
    },
    writeUserData: (filePath: string, data: string): IpcApiResponse<void> => {
        return ipcRenderer.invoke("write:userData", filePath, data);
    },
    readPublic: (filePath: string): IpcApiResponse<string> => {
        return ipcRenderer.invoke("read:public", filePath);
    },
    existsPublic: (filePath: string): IpcApiResponse<boolean> => {
        return ipcRenderer.invoke("exists:public", filePath);
    },
    writePublic: (filePath: string, data: string): IpcApiResponse<void> => {
        return ipcRenderer.invoke("write:public", filePath, data);
    },
    readAbs: (filePath: string): IpcApiResponse<string> => {
        return ipcRenderer.invoke("read:abs", filePath);
    },
    existsAbs: (filePath: string): IpcApiResponse<boolean> => {
        return ipcRenderer.invoke("exists:abs", filePath);
    },
    writeAbs: (filePath: string, data: string): IpcApiResponse<void> => {
        return ipcRenderer.invoke("write:abs", filePath, data);
    },
    openPublic: (filePath: string): IpcApiResponse<void> => {
        return ipcRenderer.invoke("open:public", filePath);
    },
    isDev: () => {
        return process.env["NODE_ENV"] === "development"
    }
} as const;

export type IpcApiType = typeof IpcApi;
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("electron", {
            ...electronAPI,
        });
        contextBridge.exposeInMainWorld("api", IpcApi);
    } catch (error) {
        console.error("Failed to expose Electron API in the renderer:", error);
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = IpcApi;
    // @ts-ignore (define in dts)
}