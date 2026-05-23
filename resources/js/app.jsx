import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const initializeTheme = () => {
    try {
        const savedTheme = localStorage.getItem('akinomass-theme');

        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            return;
        }

        document.documentElement.classList.remove('dark');
    } catch (error) {
        document.documentElement.classList.remove('dark');
    }
};

initializeTheme();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: 'var(--color-accent)',
    },
});
