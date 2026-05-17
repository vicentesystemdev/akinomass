import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import { Head, Link, usePage } from '@inertiajs/react';

const StatCard = ({ title, value, icon, trend, variant = 'blue' }) => {
    const variants = {
        blue: {
            bg: 'bg-primary-50',
            iconBg: 'bg-primary-100',
            iconColor: 'text-primary-600',
            trendUp: 'text-success',
            trendDown: 'text-danger',
        },
        green: {
            bg: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-success',
            trendUp: 'text-success',
            trendDown: 'text-danger',
        },
        amber: {
            bg: 'bg-amber-50',
            iconBg: 'bg-amber-100',
            iconColor: 'text-warning',
            trendUp: 'text-success',
            trendDown: 'text-danger',
        },
        red: {
            bg: 'bg-red-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-danger',
            trendUp: 'text-success',
            trendDown: 'text-danger',
        },
        cyan: {
            bg: 'bg-cyan-50',
            iconBg: 'bg-cyan-100',
            iconColor: 'text-info',
            trendUp: 'text-success',
            trendDown: 'text-danger',
        },
    };

    const style = variants[variant] || variants.blue;

    return (
        <div className={`relative overflow-hidden rounded-xl ${style.bg} p-5 border border-gray-100`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                    {trend !== undefined && (
                        <div className={`mt-2 flex items-center text-sm ${trend >= 0 ? style.trendUp : style.trendDown}`}>
                            <span className="flex items-center">
                                {trend >= 0 ? (
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                )}
                                {Math.abs(trend)}%
                            </span>
                            <span className="text-gray-500 ml-1">vs mes anterior</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${style.iconBg}`}>
                    <span className={`w-6 h-6 block ${style.iconColor}`}>{icon}</span>
                </div>
            </div>
        </div>
    );
};

const QuickLinkCard = ({ links }) => {
    if (!links || links.length === 0) return null;

    return (
        <Card title="Accesos Rápidos" className="mb-6">
            <div className="flex flex-wrap gap-3">
                {links.map((item) => (
                    <Link
                        key={item.routeName}
                        href={route(item.routeName)}
                        className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors border border-primary-200"
                    >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                    </Link>
                ))}
            </div>
        </Card>
    );
};

const ListWidget = ({ title, items, colorClass = 'primary' }) => {
    const colors = {
        primary: 'bg-primary-500',
        green: 'bg-success',
        amber: 'bg-warning',
        cyan: 'bg-info',
    };

    return (
        <Card title={title}>
            <div className="space-y-3">
                {items?.length ? (
                    items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full ${colors[colorClass] || colors.primary} me-3`}></div>
                                <span className="text-sm text-gray-700">{item.etiqueta}</span>
                            </div>
                            <Badge variant={colorClass === 'green' ? 'success' : colorClass === 'amber' ? 'warning' : 'primary'}>
                                {item.total}
                            </Badge>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Sin datos disponibles</p>
                )}
            </div>
        </Card>
    );
};

const SectionTitle = ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="w-1 h-6 bg-primary-600 rounded-full me-3"></span>
        {children}
    </h3>
);

export default function Dashboard({ metricas }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions ?? [];
    const hasPermission = (perm) => permissions.includes(perm);

    const quickLinks = [
        { label: 'Clientes', routeName: 'clientes.index', icon: '👥', canView: hasPermission('clientes.ver') },
        { label: 'Leads', routeName: 'leads.index', icon: '📈', canView: hasPermission('leads.ver') },
        { label: 'Productos', routeName: 'productos.index', icon: '📦', canView: hasPermission('productos.ver') },
        { label: 'Inventario', routeName: 'inventario.index', icon: '🏭', canView: hasPermission('inventario.ver') },
        { label: 'Pedidos', routeName: 'pedidos.index', icon: '🛒', canView: hasPermission('pedidos.ver') },
        { label: 'Pagos', routeName: 'pagos.index', icon: '💳', canView: hasPermission('pagos.ver') },
        { label: 'Live Sales', routeName: 'live-sales.index', icon: '📱', canView: hasPermission('pedidos.ver') || hasPermission('leads.ver') },
        { label: 'Reportes', routeName: 'reportes.index', icon: '📊', canView: hasPermission('reportes.ver') },
    ].filter((item) => item.canView);

    const amountFormatter = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Dashboard Comercial</h2>
                        <p className="text-sm text-gray-500 mt-1">Resumen general de tu negocio</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="primary">
                            {new Date().toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Badge>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Comercial" />

            <div className="space-y-6">
                <QuickLinkCard links={quickLinks} />

                <div>
                    <SectionTitle>Clientes y Leads</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Clientes"
                            value={metricas?.clientes?.total ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            variant="blue"
                        />
                        <StatCard
                            title="Total Leads"
                            value={metricas?.leads?.total ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                            variant="cyan"
                        />
                        <StatCard
                            title="Leads Nuevos"
                            value={metricas?.leads?.nuevos ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
                            variant="green"
                        />
                        <StatCard
                            title="Leads Convertidos"
                            value={metricas?.leads?.convertidos ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            variant="green"
                        />
                    </div>
                </div>

                <div>
                    <SectionTitle>Productos e Inventario</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Productos"
                            value={metricas?.productos?.total ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                            variant="blue"
                        />
                        <StatCard
                            title="Productos Activos"
                            value={metricas?.productos?.activos ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            variant="green"
                        />
                        <StatCard
                            title="Stock Bajo"
                            value={metricas?.productos?.stock_bajo ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                            variant="amber"
                        />
                        <StatCard
                            title="Movimientos"
                            value={metricas?.inventario?.movimientos ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                            variant="cyan"
                        />
                    </div>
                </div>

                <div>
                    <SectionTitle>Pedidos</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Pedidos"
                            value={metricas?.pedidos?.total ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                            variant="blue"
                        />
                        <StatCard
                            title="Borrador"
                            value={metricas?.pedidos?.borrador ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                            variant="amber"
                        />
                        <StatCard
                            title="Confirmados"
                            value={metricas?.pedidos?.confirmado ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            variant="green"
                        />
                        <StatCard
                            title="Cancelados"
                            value={metricas?.pedidos?.cancelado ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            variant="red"
                        />
                    </div>
                </div>

                <div>
                    <SectionTitle>Pagos</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Pagos"
                            value={metricas?.pagos?.total ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                            variant="blue"
                        />
                        <StatCard
                            title="Pendientes"
                            value={metricas?.pagos?.pendiente ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            variant="amber"
                        />
                        <StatCard
                            title="Pagados"
                            value={metricas?.pagos?.pagado ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            variant="green"
                        />
                        <StatCard
                            title="Monto Total"
                            value={amountFormatter.format(metricas?.pagos?.monto_total_pagado ?? 0)}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            variant="green"
                        />
                    </div>
                </div>

                <div>
                    <SectionTitle>Live Sales</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Sesiones Totales"
                            value={metricas?.live_sales?.sesiones_totales ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                            variant="cyan"
                        />
                        <StatCard
                            title="En Vivo/Programadas"
                            value={metricas?.live_sales?.sesiones_en_vivo_o_programadas ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                            variant="green"
                        />
                        <StatCard
                            title="Interacciones"
                            value={metricas?.live_sales?.interacciones_totales ?? 0}
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                            variant="blue"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ListWidget
                        title="Ventas por Canal"
                        items={metricas?.ventas_por_canal}
                        colorClass="primary"
                    />
                    <ListWidget
                        title="Ventas por Tipo de Flujo"
                        items={metricas?.ventas_por_tipo_flujo}
                        colorClass="green"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}