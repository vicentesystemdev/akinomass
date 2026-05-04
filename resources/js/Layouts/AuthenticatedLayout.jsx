import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const user = page.props?.auth?.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const permissions = useMemo(() => {
        return (
            page.props?.auth?.permissions ||
            page.props?.permissions ||
            user?.permissions ||
            []
        );
    }, [page.props, user]);

    const hasPermission = (permission) => {
        if (!permission) return true;

        /*
         * Si el backend todavía no comparte permisos hacia Inertia,
         * no bloqueamos la vista del menú para evitar que desaparezca todo.
         */
        if (!Array.isArray(permissions) || permissions.length === 0) {
            return true;
        }

        return permissions.includes(permission);
    };

    const safeRoute = (routeName, fallback) => {
        try {
            if (typeof route === 'function') {
                const router = route();

                if (router?.has && router.has(routeName)) {
                    return route(routeName);
                }

                return route(routeName);
            }
        } catch (error) {
            return fallback;
        }

        return fallback;
    };

    const isActive = (routeName, path) => {
        try {
            if (typeof route === 'function') {
                const router = route();

                if (router?.current && router.current(routeName)) {
                    return true;
                }
            }
        } catch (error) {
            // Se usa fallback por pathname.
        }

        if (typeof window === 'undefined') {
            return false;
        }

        return window.location.pathname.startsWith(path);
    };

    const navigationGroups = [
        {
            label: 'Principal',
            items: [
                {
                    label: 'Dashboard',
                    routeName: 'dashboard',
                    path: '/dashboard',
                    permission: 'dashboard.ver',
                    icon: DashboardIcon,
                },
            ],
        },
        {
            label: 'CRM',
            items: [
                {
                    label: 'Clientes',
                    routeName: 'clientes.index',
                    path: '/clientes',
                    permission: 'clientes.ver',
                    icon: UsersIcon,
                },
                {
                    label: 'Leads',
                    routeName: 'leads.index',
                    path: '/leads',
                    permission: 'leads.ver',
                    icon: LeadIcon,
                },
            ],
        },
        {
            label: 'Catálogo',
            items: [
                {
                    label: 'Categorías',
                    routeName: 'categorias-producto.index',
                    path: '/categorias-producto',
                    permission: 'productos.ver',
                    icon: TagIcon,
                },
                {
                    label: 'Productos',
                    routeName: 'productos.index',
                    path: '/productos',
                    permission: 'productos.ver',
                    icon: ProductIcon,
                },
                {
                    label: 'Inventario',
                    routeName: 'inventario.index',
                    path: '/inventario',
                    permission: 'inventario.ver',
                    icon: InventoryIcon,
                },
                {
                    label: 'Movimientos',
                    routeName: 'inventario.movimientos',
                    path: '/inventario/movimientos',
                    permission: 'inventario.movimientos',
                    icon: MovementIcon,
                },
            ],
        },
        {
            label: 'Comercial',
            items: [
                {
                    label: 'Pedidos',
                    routeName: 'pedidos.index',
                    path: '/pedidos',
                    permission: 'pedidos.ver',
                    icon: OrderIcon,
                },
                {
                    label: 'Pagos',
                    routeName: 'pagos.index',
                    path: '/pagos',
                    permission: 'pagos.ver',
                    icon: PaymentIcon,
                },
                {
                    label: 'Reportes',
                    routeName: 'reportes.index',
                    path: '/reportes',
                    permission: 'reportes.ver',
                    icon: ReportIcon,
                },
            ],
        },
        {
            label: 'Administración',
            items: [
                {
                    label: 'Usuarios',
                    routeName: 'usuarios.index',
                    path: '/usuarios',
                    permission: 'usuarios.ver',
                    icon: UserGearIcon,
                },
                {
                    label: 'Roles',
                    routeName: 'roles.index',
                    path: '/roles',
                    permission: 'roles.ver',
                    icon: ShieldIcon,
                },
            ],
        },
    ];

    const visibleGroups = navigationGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => hasPermission(item.permission)),
        }))
        .filter((group) => group.items.length > 0);

    const userInitials = getInitials(user?.name || user?.email || 'A');

    const logoutHref = safeRoute('logout', '/logout');
    const profileHref = safeRoute('profile.edit', '/profile');

    return (
        <div className="min-h-screen bg-[#FDF6F0] text-[#2B221E]">
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menú lateral"
                    className="fixed inset-0 z-30 bg-[#2B221E]/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={[
                    'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#3C473A] text-white shadow-2xl transition-transform duration-300 ease-in-out',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                ].join(' ')}
            >
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                    <Link
                        href={safeRoute('dashboard', '/dashboard')}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D77A61] text-lg font-black text-white shadow-lg shadow-black/10 transition group-hover:scale-105">
                            AK
                        </div>

                        <div>
                            <p className="text-lg font-black tracking-[0.2em]">
                                AKINOMASS
                            </p>
                            <p className="text-xs font-medium text-white/60">
                                Gestión comercial
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Cerrar menú"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5">
                    {visibleGroups.map((group) => (
                        <div key={group.label} className="mb-6">
                            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white/40">
                                {group.label}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.routeName, item.path);

                                    return (
                                        <Link
                                            key={item.label}
                                            href={safeRoute(item.routeName, item.path)}
                                            onClick={() => setSidebarOpen(false)}
                                            className={[
                                                'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition',
                                                active
                                                    ? 'bg-[#D77A61] text-white shadow-lg shadow-[#2B221E]/20'
                                                    : 'text-white/75 hover:bg-white/10 hover:text-white',
                                            ].join(' ')}
                                        >
                                            <span
                                                className={[
                                                    'flex h-9 w-9 items-center justify-center rounded-xl transition',
                                                    active
                                                        ? 'bg-white/20'
                                                        : 'bg-white/5 group-hover:bg-white/10',
                                                ].join(' ')}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </span>

                                            <span className="truncate">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 p-4">
                    <div className="rounded-3xl bg-white/8 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDF6F0] text-sm font-black text-[#3C473A]">
                                {userInitials}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-white">
                                    {user?.name || 'Usuario'}
                                </p>
                                <p className="truncate text-xs text-white/55">
                                    {user?.email || 'sin correo'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <Link
                                href={profileHref}
                                className="rounded-xl bg-white/10 px-3 py-2 text-center text-xs font-bold text-white/80 transition hover:bg-white/15 hover:text-white"
                            >
                                Perfil
                            </Link>

                            <Link
                                href={logoutHref}
                                method="post"
                                as="button"
                                className="rounded-xl bg-[#D77A61] px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-[#c96f58]"
                            >
                                Salir
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="min-h-screen lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-[#eadfd6] bg-[#FDF6F0]/85 backdrop-blur-xl">
                    <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-4">
                            <button
                                type="button"
                                className="rounded-2xl border border-[#eadfd6] bg-white p-2.5 text-[#3C473A] shadow-sm transition hover:border-[#D77A61]/40 hover:text-[#D77A61] lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Abrir menú"
                            >
                                <MenuIcon className="h-5 w-5" />
                            </button>

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D77A61]">
                                    Panel administrativo
                                </p>
                                <h1 className="truncate text-xl font-black text-[#2B221E] sm:text-2xl">
                                    AKINOMASS
                                </h1>
                            </div>
                        </div>

                        <div className="hidden min-w-0 flex-1 justify-center px-8 md:flex">
                            <div className="relative w-full max-w-xl">
                                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2B221E]/35" />
                                <input
                                    type="text"
                                    placeholder="Buscar módulo, producto, cliente..."
                                    className="w-full rounded-2xl border border-[#eadfd6] bg-white px-12 py-3 text-sm text-[#2B221E] shadow-sm outline-none transition placeholder:text-[#2B221E]/35 focus:border-[#D77A61] focus:ring-4 focus:ring-[#D77A61]/15"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-bold text-[#2B221E]">
                                    {user?.name || 'Usuario'}
                                </p>
                                <p className="text-xs text-[#2B221E]/55">
                                    {user?.email || 'sin correo'}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3C473A] text-sm font-black text-white shadow-sm">
                                {userInitials}
                            </div>
                        </div>
                    </div>

                    {header && (
                        <div className="border-t border-[#eadfd6]/70 px-4 py-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    )}
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
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

function DashboardIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function UsersIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M16 19c0-2.21-2.69-4-6-4s-6 1.79-6 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M20 18c0-1.66-1.57-3.08-3.8-3.7M15 4.35a3.5 3.5 0 0 1 0 6.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function LeadIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M5 5h14v14H5V5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M8 9h8M8 13h5M8 17h3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function TagIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M4 11.5V5h6.5l9 9a2.12 2.12 0 0 1 0 3l-2.5 2.5a2.12 2.12 0 0 1-3 0l-10-8Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M8 8h.01"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ProductIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M6 7.5 12 4l6 3.5v9L12 20l-6-3.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="m6 7.5 6 3.5 6-3.5M12 11v9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function InventoryIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M4 8h16M6 8v11h12V8M8 5h8l2 3H6l2-3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M9 12h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MovementIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M7 7h10l-3-3M17 17H7l3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6 12h12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function OrderIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M9 8h6M9 12h6M9 16h3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function PaymentIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M4 7h16v10H4V7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M4 10h16M7 15h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ReportIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M5 19V5h14v14H5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M9 16v-4M12 16V8M15 16v-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function UserGearIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M15 19c0-2.21-2.46-4-5.5-4S4 16.79 4 19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M9.5 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M18 14.5v5M15.5 17h5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ShieldIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M12 21s7-3.5 7-10V5l-7-2-7 2v6c0 6.5 7 10 7 10Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="m9 12 2 2 4-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SearchIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="m20 20-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MenuIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CloseIcon({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}