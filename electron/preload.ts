import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

type IpcApiResponse<T = void> = Promise<{
    success: boolean;
    data: T;
    message?: string;
}>;
// Custom APIs for renderer
const IpcApi = {
    readJson: (filePath: string): IpcApiResponse<string> => {
        return ipcRenderer.invoke("read:json", filePath);
    },
    exists: (filePath: string): IpcApiResponse<boolean> => {
        return ipcRenderer.invoke("exists", filePath);
    },
    writeJson: (filePath: string, data: string): IpcApiResponse<void> => {
        return ipcRenderer.invoke("write:json", filePath, data);
    },
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