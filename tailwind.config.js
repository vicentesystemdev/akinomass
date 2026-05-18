import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Paleta Modern Earth - Identidad de marca
                oliva: {
                    50: '#f4f5f4',
                    100: '#e5e7e4',
                    200: '#cbd0c9',
                    300: '#a5ada3',
                    400: '#7f8b7c',
                    500: '#636e60',
                    600: '#4e5849',
                    700: '#3C473A', // Color principal
                    800: '#333b31',
                    900: '#2b3229',
                    950: '#1a1f19',
                },
                terracota: {
                    50: '#fdf5f2',
                    100: '#fbe8e1',
                    200: '#f7d0c3',
                    300: '#f0b09e',
                    400: '#e68d74',
                    500: '#D77A61', // Acción principal
                    600: '#c56950',
                    700: '#a6543e',
                    800: '#894636',
                    900: '#713d31',
                    950: '#3d1d18',
                },
                crema: {
                    DEFAULT: '#FDF6F0',
                    50: '#FFFCFA',
                    100: '#FDF6F0', // Fondo principal
                    200: '#FBEee3',
                    300: '#F7E0CC',
                },
                cafe: {
                    DEFAULT: '#2B221E',
                    50: '#f5f3f2',
                    100: '#e8e4e2',
                    200: '#d4cdc9',
                    300: '#b5aaa3',
                    400: '#968880',
                    500: '#7b6e66',
                    600: '#665a53',
                    700: '#544a45',
                    800: '#473f3b',
                    900: '#3d3633',
                    950: '#2B221E', // Texto principal
                },
                // Colores semánticos de estado
                'estado-exito': '#059669',
                'estado-advertencia': '#D97706',
                'estado-info': '#0891B2',
                'estado-error': '#DC2626',
                'estado-inactivo': '#9CA3AF',
                // Mantener compatibilidad
                primary: {
                    50: '#f4f5f4',
                    100: '#e5e7e4',
                    200: '#cbd0c9',
                    300: '#a5ada3',
                    400: '#7f8b7c',
                    500: '#636e60',
                    600: '#4e5849',
                    700: '#3C473A',
                    800: '#333b31',
                    900: '#2b3229',
                    950: '#1a1f19',
                },
                success: '#059669',
                warning: '#D97706',
                danger: '#DC2626',
                info: '#0891B2',
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'sidebar': '4px 0 6px -1px rgb(0 0 0 / 0.1)',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
            },
        },
    },

    plugins: [forms],
};
