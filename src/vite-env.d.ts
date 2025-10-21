/// <reference types="vite/client" />
import type {ElectronAPI} from "@electron-toolkit/preload";

declare global {
    interface Window {
        electron: ElectronAPI
    }
}