import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Header({ user, onMenuClick, safeRoute }) {
    const [open, setOpen] = useState(false);
    const initials = getInitials(user?.name || user?.email || 'A');

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-500">Panel principal</p>
                        <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                            Dashboard multicanal
                        </h1>
                    </div>
                </div>

                <div className="hidden min-w-0 flex-1 justify-center px-6 md:flex">
                    <div className="relative w-full max-w-md">
                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Buscar cliente, pedido o producto"
                            className="h-11 w-full rounded-lg border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:bg-slate-50"
                    >
                        <span className="hidden text-right sm:block">
                            <span className="block text-sm font-semibold text-slate-900">
                                {user?.name || 'Usuario'}
                            </span>
                            <span className="block max-w-44 truncate text-xs text-slate-500">
                                {user?.email || 'Sin correo'}
                            </span>
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                            {initials}
                        </span>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                            <Link
                                href={safeRoute('profile.edit', '/profile')}
                                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            >
                                Perfil
                            </Link>
                            <Link
                                href={safeRoute('logout', '/logout')}
                                method="post"
                                as="button"
                                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                                Cerrar sesion
                            </Link>
                        </div>
                    )}
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
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function SearchIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m20 20-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}
