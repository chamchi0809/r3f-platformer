import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { chamQueryClient } from "@/common/queries/ChamQuery.ts";
import { WorldProvider } from "koota/react";
import { world } from "@/common/world.ts";
import { AppProvider } from "@/store/useAppStore.ts";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <QueryClientProvider client={chamQueryClient}>
      <WorldProvider world={world}>
        <App />
      </WorldProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </AppProvider>,
);
