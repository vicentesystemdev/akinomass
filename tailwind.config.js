import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                akin: {
                    primary: 'var(--color-primary)',
                    primarySoft: 'var(--color-primary-soft)',
                    accent: 'var(--color-accent)',
                    accentSoft: 'var(--color-accent-soft)',
                    bg: 'var(--color-bg)',
                    surface: 'var(--color-surface)',
                    surfaceSoft: 'var(--color-surface-soft)',
                    text: 'var(--color-text)',
                    muted: 'var(--color-text-muted)',
                    border: 'var(--color-border)',
                },
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
