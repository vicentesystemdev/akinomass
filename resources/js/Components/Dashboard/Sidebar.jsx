import { Link } from '@inertiajs/react';

const items = [
    { label: 'Dashboard', routeName: 'dashboard', path: '/dashboard', icon: HomeIcon },
    { label: 'Clientes', routeName: 'clientes.index', path: '/clientes', icon: UsersIcon },
    { label: 'Leads', routeName: 'leads.index', path: '/leads', icon: SparkIcon },
    { label: 'Pedidos', routeName: 'pedidos.index', path: '#', icon: ReceiptIcon },
    { label: 'Productos', routeName: 'productos.index', path: '/productos', icon: BoxIcon },
    { label: 'Inventario', routeName: 'inventario.index', path: '#', icon: InventoryIcon },
    { label: 'Canales', routeName: 'canales.index', path: '#', icon: ChannelIcon },
    { label: 'Reportes', routeName: 'reportes.index', path: '#', icon: ChartIcon },
    { label: 'Configuracion', routeName: 'configuracion.index', path: '#', icon: SettingsIcon },
];

export default function Sidebar({ open, onClose, safeRoute, isActive }) {
    return (
        <>
            {open && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
                    onClick={onClose}
                    aria-label="Cerrar menu"
                />
            )}

            <aside
                className={[
                    'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
                    <Link href={safeRoute('dashboard', '/dashboard')} className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                            AK
                        </span>
                        <span>
                            <span className="block text-lg font-bold text-slate-900">AKINOMASS</span>
                            <span className="block text-xs font-medium text-slate-500">CRM multicanal</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-5">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase text-slate-400">
                        Menu
                    </p>

                    <div className="space-y-1">
                        {items.map((item) => {
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
                                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                                        active
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                                        pending ? 'cursor-default opacity-70' : '',
                                    ].join(' ')}
                                >
                                    <span
                                        className={[
                                            'flex h-9 w-9 items-center justify-center rounded-lg',
                                            active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-slate-700',
                                        ].join(' ')}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {pending && (
                                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                            pronto
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="border-t border-slate-200 p-4">
                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Demo comercial</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Ventas, leads y pedidos desde redes sociales en un solo panel.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}

function IconBase({ className, children }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {children}
        </svg>
    );
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

function ReceiptIcon({ className = '' }) {
    return <IconBase className={className}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function BoxIcon({ className = '' }) {
    return <IconBase className={className}><path d="m6 7.5 6-3.5 6 3.5v9L12 20l-6-3.5v-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m6 7.5 6 3.5 6-3.5M12 11v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function InventoryIcon({ className = '' }) {
    return <IconBase className={className}><path d="M4 8h16M6 8v11h12V8M8 5h8l2 3H6l2-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function ChannelIcon({ className = '' }) {
    return <IconBase className={className}><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 6.7l6.8 4.6M15.4 12.7l-6.8 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function ChartIcon({ className = '' }) {
    return <IconBase className={className}><path d="M5 19V5h14v14H5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 16v-4M12 16V8M15 16v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></IconBase>;
}

function SettingsIcon({ className = '' }) {
    return <IconBase className={className}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" /><path d="M19 12a7 7 0 0 0-.1-1.1l2-1.5-2-3.4-2.4 1a7.7 7.7 0 0 0-1.9-1.1L14.3 3h-4.6l-.3 2.9A7.7 7.7 0 0 0 7.5 7l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.1l-2 1.5 2 3.4 2.4-1c.6.5 1.2.8 1.9 1.1l.3 2.9h4.6l.3-2.9c.7-.3 1.3-.6 1.9-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></IconBase>;
}
