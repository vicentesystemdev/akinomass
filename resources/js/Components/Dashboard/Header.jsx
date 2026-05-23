import ThemeToggle from '@/Components/UI/ThemeToggle';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Header({ user, onMenuClick, safeRoute }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const initials = getInitials(user?.name || user?.email || 'A');

    // Close dropdown on click outside
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // Close dropdown on Escape key
    useEffect(() => {
        if (!open) return;

        const handleEscape = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open]);

    return (
        <header className="sticky top-0 z-20 border-b border-akin-border bg-akin-bg/80 backdrop-blur-xl transition-colors">
            <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="akin-btn-secondary h-11 w-11 shadow-sm lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-akin-accent">
                            Dashboard Comercial
                        </p>
                        <h1 className="truncate text-xl font-black text-akin-text sm:text-2xl">
                            Control multicanal AKINOMASS
                        </h1>
                    </div>
                </div>

                <div className="hidden min-w-0 flex-1 justify-center px-6 md:flex">
                    <div className="relative w-full max-w-md group">
                        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-akin-muted transition-colors group-focus-within:text-akin-accent" />
                        <input
                            type="search"
                            placeholder="Buscar cliente, pedido, producto..."
                            className="akin-input h-11 w-full pl-11 pr-4 text-sm shadow-sm transition-shadow focus:shadow-md"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    <button
                        type="button"
                        className="akin-btn-secondary relative hidden h-11 w-11 shadow-sm sm:flex"
                        aria-label="Notificaciones"
                    >
                        <BellIcon className="h-5 w-5" />
                        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-akin-accent ring-2 ring-akin-surface akin-pulse-glow" />
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            className="akin-btn-secondary flex items-center gap-3 px-2 py-2 shadow-sm"
                        >
                            <span className="hidden text-right sm:block">
                                <span className="block text-sm font-black text-akin-text">
                                    {user?.name || 'Usuario'}
                                </span>
                                <span className="akin-muted block max-w-44 truncate text-xs">
                                    {user?.email || user?.role || 'Panel comercial'}
                                </span>
                            </span>
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-akin-primary text-sm font-black text-white shadow-sm dark:text-akin-bg">
                                {initials}
                            </span>
                        </button>

                        {open && (
                            <div className="akin-card absolute right-0 mt-2 w-60 p-2 shadow-xl dark:shadow-black/30 akin-dropdown-enter">
                                <div className="akin-divider border-b px-3 py-3">
                                    <p className="truncate text-sm font-black text-akin-text">
                                        {user?.name || 'Usuario AKINOMASS'}
                                    </p>
                                    <p className="akin-muted truncate text-xs">
                                        {user?.email || 'Sesion activa'}
                                    </p>
                                </div>
                                <Link
                                    href={safeRoute('profile.edit', '/profile')}
                                    className="mt-2 block rounded-xl px-3 py-2 text-sm font-bold text-akin-muted transition hover:bg-akin-surfaceSoft hover:text-akin-text"
                                    onClick={() => setOpen(false)}
                                >
                                    Perfil
                                </Link>
                                <Link
                                    href={safeRoute('logout', '/logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                                    onClick={() => setOpen(false)}
                                >
                                    Cerrar sesion
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

function getInitials(value) {
    return value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('');
}

function MenuIcon({ className = '' }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function SearchIcon({ className = '' }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m20 20-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function BellIcon({ className = '' }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7ZM14 20a2 2 0 0 1-4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
