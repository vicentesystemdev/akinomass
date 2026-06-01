import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const permissions = auth?.permissions ?? [];
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const hasPermission = (permission) => permissions.includes(permission);

    const navigationSections = useMemo(() => [
        {
            label: 'Principal',
            items: [
                {
                    label: 'Dashboard',
                    routeName: 'dashboard',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    ),
                    canView: hasPermission('dashboard.ver'),
                },
            ],
        },
        {
            label: 'Comercial',
            items: [
                {
                    label: 'Clientes',
                    routeName: 'clientes.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    ),
                    canView: hasPermission('clientes.ver'),
                },
                {
                    label: 'Leads',
                    routeName: 'leads.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    ),
                    canView: hasPermission('leads.ver'),
                },
                {
                    label: 'Plantillas',
                    routeName: 'plantillas-mensaje.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    ),
                    canView: hasPermission('leads.ver'),
                },
            ],
        },
        {
            label: 'Catálogo',
            items: [
                {
                    label: 'Categorías',
                    routeName: 'categorias-producto.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    ),
                    canView: hasPermission('productos.ver'),
                },
                {
                    label: 'Productos',
                    routeName: 'productos.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    ),
                    canView: hasPermission('productos.ver'),
                },
            ],
        },
        {
            label: 'Operaciones',
            items: [
                {
                    label: 'Inventario',
                    routeName: 'inventario.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    ),
                    canView: hasPermission('inventario.ver'),
                },
                {
                    label: 'Movimientos',
                    routeName: 'inventario.movimientos',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    ),
                    canView: hasPermission('inventario.movimientos'),
                },
                {
                    label: 'Pedidos',
                    routeName: 'pedidos.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    ),
                    canView: hasPermission('pedidos.ver'),
                },
                {
                    label: 'Pagos',
                    routeName: 'pagos.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    ),
                    canView: hasPermission('pagos.ver'),
                },
            ],
        },
        {
            label: 'Ventas en Vivo',
            items: [
                {
                    label: 'Live Sales',
                    routeName: 'live-sales.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    ),
                    canView: hasPermission('pedidos.ver') || hasPermission('leads.ver'),
                },
            ],
        },
        {
            label: 'Análisis',
            items: [
                {
                    label: 'Reportes',
                    routeName: 'reportes.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    ),
                    canView: hasPermission('reportes.ver'),
                },
                {
                    label: 'Logs',
                    routeName: 'logs.index',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A2 2 0 0120 8.414V19a2 2 0 01-2 2z" />
                        </svg>
                    ),
                    canView: hasPermission('reportes.ver'),
                },
            ],
        },
    ], [permissions]);

    const sidebarContent = (isMobile = false) => (
        <div className="flex grow flex-col" style={{ background: 'linear-gradient(180deg, #1a1f19 0%, #3C473A 100%)' }}>
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)' }}
                    >
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div className="min-w-0">
                        <span className="text-white font-bold text-lg tracking-tight">AKINOMASS</span>
                        <p className="text-oliva-300 text-[11px] leading-tight">Plataforma Comercial</p>
                    </div>
                </Link>
                {isMobile && (
                    <button
                        type="button"
                        className="ml-auto p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navegación */}
            <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-6">
                {navigationSections.map((section) => {
                    const visibleItems = section.items.filter((item) => item.canView);
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={section.label}>
                            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-oliva-400">
                                {section.label}
                            </p>
                            <div className="space-y-0.5">
                                {visibleItems.map((item) => {
                                    const isActive = route().current(item.routeName) || route().current(item.routeName + '*');
                                    return (
                                        <NavLink
                                            key={item.routeName}
                                            href={route(item.routeName)}
                                            active={isActive}
                                            sidebar={true}
                                            onClick={isMobile ? () => setSidebarOpen(false) : undefined}
                                        >
                                            {item.icon}
                                            <span className="flex-1 truncate">{item.label}</span>
                                            {item.badge && (
                                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-terracota-500 text-white">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Footer: Usuario + Logout */}
            <div className="border-t border-white/10 p-3 space-y-2">
                {/* User profile */}
                {user && (
                    <div
                        className="flex items-center gap-3 px-2 py-2 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', fontSize: 13 }}
                        >
                            {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                            <p className="text-oliva-300 text-[10px] truncate">{user.email}</p>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-oliva-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar Sesión</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-crema-100">
            {/* Sidebar para desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:overflow-y-auto sidebar-scroll">
                {sidebarContent(false)}
            </aside>

            {/* Sidebar móvil (overlay) */}
            {sidebarOpen && (
                <div className="relative z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-cafe-950/50 transition-opacity duration-300"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-full max-w-xs overflow-y-auto sidebar-scroll">
                        {sidebarContent(true)}
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="lg:pl-64">
                {/* Topbar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    {/* Botón hamburguesa móvil */}
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-cafe-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Separador */}
                    <div className="h-6 w-px bg-gray-200 lg:hidden" />

                    {/* Barra de búsqueda */}
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="relative flex flex-1 items-center">
                            <svg className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar en el sistema..."
                                className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-sm text-cafe-700 bg-gray-50 placeholder:text-gray-400 focus:ring-2 focus:ring-terracota-500 focus:bg-white transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Perfil dropdown */}
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-gray-50">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)' }}
                                    >
                                        <span className="text-white font-medium text-sm">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden lg:block font-medium text-cafe-700">{user?.name}</span>
                                    <svg className="hidden lg:block h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link
                                    href={route('profile.edit')}
                                    className="flex items-center gap-2 text-cafe-700 hover:bg-gray-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Mi Perfil
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-2 text-cafe-700 hover:bg-gray-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                {/* Header de página */}
                {header && (
                    <header className="border-b border-gray-200 bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Contenido */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
