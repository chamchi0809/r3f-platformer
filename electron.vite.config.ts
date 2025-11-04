import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import * as path from "path";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  main: {
    publicDir: path.resolve(__dirname, "public"),
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "electron/main.ts"),
        },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    publicDir: path.resolve(__dirname, "public"),
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "electron/preload.ts"),
        },
        external: ["@electron-toolkit/preload"],
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: ".",
    publicDir: path.resolve(__dirname, "public"),
    build: {
      rollupOptions: {
        input: {
          renderer: path.resolve(__dirname, "index.html"),
        },
      },
    },
    plugins: [react(), wasm(), topLevelAwait()],
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
    },
    server: {
      port: 8080,
    },
  },
});
