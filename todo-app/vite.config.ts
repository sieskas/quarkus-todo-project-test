/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
    base: loadEnv(mode, '.', 'VITE_').VITE_BASE_PATH || '/',
    plugins: [
        react(),
        tailwindcss(),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
    },
}))
