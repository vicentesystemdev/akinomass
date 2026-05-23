import { Link } from '@inertiajs/react';

const navigationGroups = [
    {
        label: 'Principal',
        items: [
            { label: 'Dashboard', routeName: 'dashboard', path: '/dashboard', icon: HomeIcon },
        ],
    },
    {
        label: 'CRM',
        items: [
            { label: 'Clientes', routeName: 'clientes.index', path: '/clientes', icon: UsersIcon },
            { label: 'Leads', routeName: 'leads.index', path: '/leads', icon: SparkIcon },
            { label: 'Plantillas', routeName: 'plantillas-mensaje.index', path: '/plantillas-mensaje', icon: TemplateIcon },
        ],
    },
    {
        label: 'Catalogo',
        items: [
            { label: 'Categorias', routeName: 'categorias-producto.index', path: '/categorias-producto', icon: TagIcon },
            { label: 'Productos', routeName: 'productos.index', path: '/productos', icon: BoxIcon },
        ],
    },
    {
        label: 'Inventario',
        items: [
            { label: 'Stock', routeName: 'inventario.index', path: '/inventario', icon: InventoryIcon },
            { label: 'Movimientos', routeName: 'inventario.movimientos', path: '/inventario/movimientos', icon: MovementIcon },
        ],
    },
    {
        label: 'Comercial',
        items: [
            { label: 'Pedidos', routeName: 'pedidos.index', path: '/pedidos', icon: ReceiptIcon },
            { label: 'Pagos', routeName: 'pagos.index', path: '/pagos', icon: PaymentIcon },
            { label: 'LiveSales', routeName: 'live-sales.index', path: '/live-sales', icon: LiveIcon },
        ],
    },
    {
        label: 'Analisis',
        items: [
            { label: 'Reportes', routeName: 'reportes.index', path: '/reportes', icon: ChartIcon },
        ],
    },
];

export default function Sidebar({ open, onClose, safeRoute, isActive }) {
    return (
        <>
            {open && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden akin-fade-in"
                    onClick={onClose}
                    aria-label="Cerrar menu"
                />
            )}

            <aside
                className={[
                    'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-akin-primary text-white shadow-2xl shadow-black/20 transition-transform duration-300 dark:bg-akin-surfaceSoft dark:text-akin-text',
                    open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                ].join(' ')}
            >
                <div className="flex h-24 items-center border-b border-white/10 px-5">
                    <Link href={safeRoute('dashboard', '/dashboard')} className="group flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-akin-accent text-sm font-black text-white shadow-lg shadow-black/15 transition group-hover:scale-105 dark:text-akin-bg">
                            AK
                        </span>
                        <span>
                            <span className="block text-xl font-black tracking-wide">AKINOMASS</span>
                            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/60 dark:text-akin-muted">
                                Panel Comercial
                            </span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
                    <div className="space-y-6">
                        {navigationGroups.map((group) => (
                            <div key={group.label}>
                                <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/45 dark:text-akin-muted">
                                    {group.label}
                                </p>

                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const href = safeRoute(item.routeName, item.path);
                                        const active = isActive(item.routeName, item.path);
                                        const pending = href === '#';

                                        return (
                                            <Link
                                                key={item.label}
                                                href={href}
                                                onClick={onClose}
                                                className={[
                                                    'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all duration-200',
                                                    active
                                                        ? 'bg-akin-accent text-white shadow-lg shadow-black/15 dark:text-akin-bg'
                                                        : 'text-white/75 hover:bg-white/10 hover:text-white dark:text-akin-muted dark:hover:text-akin-text',
                                                    pending ? 'cursor-default opacity-60' : '',
                                                ].join(' ')}
                                            >
                                                <span
                                                    className={[
                                                        'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200',
                                                        active ? 'bg-white/20 scale-105' : 'bg-white/10 group-hover:bg-white/15 group-hover:scale-105',
                                                    ].join(' ')}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </span>
                                                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                                {active && (
                                                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                                )}
                                                {pending && (
                                                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white/60 dark:text-akin-muted">
                                                        Pronto
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </nav>

                <div className="border-t border-white/10 p-4">
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 dark:bg-white/5">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-akin-bg text-sm font-black text-akin-primary">
                                CRM
                            </span>
                            <div>
                                <p className="text-sm font-black text-white">Multicanal activo</p>
                                <p className="text-xs text-white/60 dark:text-akin-muted">TikTok, WhatsApp, Instagram</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

function IconBase({ className, children }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">{children}</svg>;
}

function HomeIcon({ className = '' }) {
    return <IconBase className={className}><path d="M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4v-8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></IconBase>;
}

function UsersIcon({ className = '' }) {
    return <IconBase className={className}><path d="M16 19c0-2.2-2.7-4-6-4s-6 1.8-6 4M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 18c0-1.6-1.5-3-3.6-3.6M15 4.5a3.5 3.5 0 0 1 0 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function SparkIcon({ className = '' }) {
    return <IconBase className={className}><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM6 15l.9 2.1L9 18l-2.1.9L6 21l-.9-2.1L3 18l2.1-.9L6 15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></IconBase>;
}

function TemplateIcon({ className = '' }) {
    return <IconBase className={className}><path d="M5 5h14v14H5V5Z" stroke="currentColor" strokeWidth="1.8" /><path d="M8 9h8M8 13h5M8 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function TagIcon({ className = '' }) {
    return <IconBase className={className}><path d="M4 11.5V5h6.5l9 9a2.1 2.1 0 0 1 0 3l-2.5 2.5a2.1 2.1 0 0 1-3 0l-10-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M8 8h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></IconBase>;
}

function BoxIcon({ className = '' }) {
    return <IconBase className={className}><path d="m6 7.5 6-3.5 6 3.5v9L12 20l-6-3.5v-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m6 7.5 6 3.5 6-3.5M12 11v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function InventoryIcon({ className = '' }) {
    return <IconBase className={className}><path d="M4 8h16M6 8v11h12V8M8 5h8l2 3H6l2-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function MovementIcon({ className = '' }) {
    return <IconBase className={className}><path d="M7 7h10l-3-3M17 17H7l3 3M6 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></IconBase>;
}

function ReceiptIcon({ className = '' }) {
    return <IconBase className={className}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function PaymentIcon({ className = '' }) {
    return <IconBase className={className}><path d="M4 7h16v10H4V7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M4 10h16M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function LiveIcon({ className = '' }) {
    return <IconBase className={className}><path d="M7 18h10M8 6h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="1.8" /><path d="m11 9 4 2-4 2V9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></IconBase>;
}

function ChartIcon({ className = '' }) {
    return <IconBase className={className}><path d="M5 19V5h14v14H5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 16v-4M12 16V8M15 16v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}
