import ThemeToggle from '@/Components/UI/ThemeToggle';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Header({ user, onMenuClick, safeRoute }) {
    const [open, setOpen] = useState(false);
    const initials = getInitials(user?.name || user?.email || 'A');

    return (
        <header className="sticky top-0 z-20 border-b border-[#EADFD6]/80 bg-[#FDF6F0]/90 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#171512]/90">
            <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#EADFD6] bg-white text-[#3C473A] shadow-sm transition hover:border-[#D77A61]/40 hover:text-[#D77A61] lg:hidden dark:border-white/10 dark:bg-[#24211D] dark:text-[#FDF6F0]"
                        aria-label="Abrir menu"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D77A61]">
                            Dashboard Comercial
                        </p>
                        <h1 className="truncate text-xl font-black text-[#2B221E] sm:text-2xl dark:text-[#FDF6F0]">
                            Control multicanal AKINOMASS
                        </h1>
                    </div>
                </div>

                <div className="hidden min-w-0 flex-1 justify-center px-6 md:flex">
                    <div className="relative w-full max-w-md">
                        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2B221E]/35 dark:text-[#FDF6F0]/35" />
                        <input
                            type="search"
                            placeholder="Buscar cliente, pedido, producto..."
                            className="h-11 w-full rounded-xl border-[#EADFD6] bg-white/80 pl-11 pr-4 text-sm text-[#2B221E] shadow-sm placeholder:text-[#2B221E]/35 focus:border-[#D77A61] focus:ring-[#D77A61]/25 dark:border-white/10 dark:bg-[#24211D] dark:text-[#FDF6F0] dark:placeholder:text-[#FDF6F0]/35"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    <button
                        type="button"
                        className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-[#EADFD6] bg-white text-[#3C473A] shadow-sm transition hover:border-[#D77A61]/40 hover:text-[#D77A61] sm:flex dark:border-white/10 dark:bg-[#24211D] dark:text-[#FDF6F0]"
                        aria-label="Notificaciones"
                    >
                        <BellIcon className="h-5 w-5" />
                        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#D77A61] ring-2 ring-white dark:ring-[#24211D]" />
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            className="flex items-center gap-3 rounded-xl border border-[#EADFD6] bg-white px-2 py-2 shadow-sm transition hover:border-[#D77A61]/40 dark:border-white/10 dark:bg-[#24211D]"
                        >
                            <span className="hidden text-right sm:block">
                                <span className="block text-sm font-black text-[#2B221E] dark:text-[#FDF6F0]">
                                    {user?.name || 'Usuario'}
                                </span>
                                <span className="block max-w-44 truncate text-xs text-[#2B221E]/55 dark:text-[#FDF6F0]/50">
                                    {user?.email || user?.role || 'Panel comercial'}
                                </span>
                            </span>
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3C473A] text-sm font-black text-white shadow-sm dark:bg-[#D77A61] dark:text-[#171512]">
                                {initials}
                            </span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-[#EADFD6] bg-white p-2 shadow-xl shadow-[#3C473A]/10 dark:border-white/10 dark:bg-[#211E1A] dark:shadow-black/30">
                                <div className="border-b border-[#EADFD6] px-3 py-3 dark:border-white/10">
                                    <p className="truncate text-sm font-black text-[#2B221E] dark:text-[#FDF6F0]">
                                        {user?.name || 'Usuario AKINOMASS'}
                                    </p>
                                    <p className="truncate text-xs text-[#2B221E]/55 dark:text-[#FDF6F0]/50">
                                        {user?.email || 'Sesion activa'}
                                    </p>
                                </div>
                                <Link
                                    href={safeRoute('profile.edit', '/profile')}
                                    className="mt-2 block rounded-xl px-3 py-2 text-sm font-bold text-[#2B221E]/70 transition hover:bg-[#FDF6F0] hover:text-[#2B221E] dark:text-[#FDF6F0]/70 dark:hover:bg-white/5 dark:hover:text-[#FDF6F0]"
                                >
                                    Perfil
                                </Link>
                                <Link
                                    href={safeRoute('logout', '/logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
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
