import { useEffect, useState } from 'react';

const storageKey = 'akinomass-theme';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        try {
            const savedTheme = window.localStorage.getItem(storageKey) || 'light';
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } catch (error) {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';

        setTheme(nextTheme);
        try {
            window.localStorage.setItem(storageKey, nextTheme);
        } catch (error) {
            // El tema visual puede cambiar aunque el navegador bloquee almacenamiento.
        }
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#EADFD6] bg-white text-[#3C473A] shadow-sm transition hover:border-[#D77A61]/40 hover:text-[#D77A61] dark:border-white/10 dark:bg-[#24211D] dark:text-[#FDF6F0] dark:hover:border-[#D77A61]/50 dark:hover:text-[#F2B39F]"
            aria-label={theme === 'dark' ? 'Activar modo dia' : 'Activar modo oscuro'}
            title={theme === 'dark' ? 'Modo dia' : 'Modo oscuro'}
        >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
    );
}

function SunIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4V2M12 22v-2M20 12h2M2 12h2M17.7 6.3l1.4-1.4M4.9 19.1l1.4-1.4M17.7 17.7l1.4 1.4M4.9 4.9l1.4 1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function MoonIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 15.7A8.5 8.5 0 0 1 8.3 4a8.5 8.5 0 1 0 11.7 11.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
    );
}
