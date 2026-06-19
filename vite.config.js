import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Carga las variables del .env de Laravel
    const env = loadEnv(mode, process.cwd(), ['APP_', 'VITE_']);

    // Extrae el host del APP_URL (ej: "http://akinomass.test" → "akinomass.test")
    const appUrl = env.APP_URL || 'http://localhost';
    const appHost = new URL(appUrl).hostname;
    const vitePort = 5173; // Puerto Vite de akinomass

    return {
        server: {
            host: '0.0.0.0',
            port: vitePort,
            strictPort: true,
            origin: `http://${appHost}:${vitePort}`,
            cors: true,
            hmr: {
                host: appHost,
                clientPort: vitePort,
                protocol: 'ws',
            },
        },
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
    };
});