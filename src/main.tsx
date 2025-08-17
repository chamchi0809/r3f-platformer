import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {chamQueryClient} from "@/common/queries/ChamQuery.ts";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={chamQueryClient}>
            <App/>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    </StrictMode>,
)
