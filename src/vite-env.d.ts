/// <reference types="vite/client" />
import type { ElectronAPI } from "@electron-toolkit/preload";
import type { IpcApiType } from "../electron/preload.ts";

declare global {
  interface Window {
    electron?: ElectronAPI
    api?: IpcApiType
  }
}
