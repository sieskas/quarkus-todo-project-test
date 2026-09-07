import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { OpenAPI } from './api/generated'

OpenAPI.BASE = import.meta.env.VITE_TASK_MANAGER_API_URL || 'http://localhost:8080';
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5min
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
)