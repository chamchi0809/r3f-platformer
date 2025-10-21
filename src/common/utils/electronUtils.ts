import type {ElectronAPI} from "@electron-toolkit/preload";

export const getSafePath = (path: string | null | undefined): string => {
    console.log(window.electron);
    const rootPath = window.electron ? "." : ""
    return `${rootPath}${path || ""}`;
}