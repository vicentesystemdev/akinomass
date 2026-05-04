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
            colors: {
                olive: {
                    DEFAULT: '#3C473A',
                    dark: '#2A3329',
                },
                terracotta: {
                    DEFAULT: '#D77A61',
                    dark: '#C56952',
                },
                cream: {
                    DEFAULT: '#FDF6F0',
                    light: '#FFFFFF',
                },
                coffee: {
                    DEFAULT: '#2B221E',
                },
            },
            fontFamily: {
                sans: ['Figtree', 'Inter', ...defaultTheme.fontFamily.sans],
            },
        },
    },


    plugins: [forms],
};
