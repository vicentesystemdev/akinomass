import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import Badge from '@/Components/Badge';
import LiveSyncBadge from '@/Components/UI/LiveSyncBadge';
import DashboardStatCard from '@/Components/Dashboard/DashboardStatCard';
import DashboardSection from '@/Components/Dashboard/DashboardSection';
import HorizontalBar from '@/Components/Charts/HorizontalBar';
import { Head, Link, usePage } from '@inertiajs/react';
import { useInertiaPoll } from '@/hooks/useInertiaPoll';
import { formatBOB, formatNumber } from '@/lib/formatters';

const QuickLinkCard = ({ links }) => {
    if (!links?.length) return null;

    return (
        <SectionCard title="Accesos rápidos" className="overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {links.map((item) => (
                    <Link
                        key={item.routeName}
                        href={route(item.routeName)}
                        className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-3 text-center transition-all hover:border-terracota-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                        <span className="text-2xl transition-transform group-hover:scale-110">{item.icon}</span>
                        <span className="text-xs font-semibold text-cafe-800 leading-tight">{item.label}</span>
                    </Link>
                ))}
            </div>
        </SectionCard>
    );
};

export default function Dashboard({ metricas }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions ?? [];
    const hasPermission = (perm) => permissions.includes(perm);

    const { lastUpdated, isRefreshing, refresh } = useInertiaPoll(['metricas'], 25000, true);

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

    const ventasCanal = (metricas?.ventas_por_canal || []).map((v) => ({
        name: v.etiqueta,
        value: v.total,
    }));
    const ventasFlujo = (metricas?.ventas_por_tipo_flujo || []).map((v) => ({
        name: v.etiqueta,
        value: v.total,
    }));

    const pedidosPendientes = (metricas?.pedidos?.borrador ?? 0) + (metricas?.pedidos?.confirmado ?? 0);
    const pagosPendientes = metricas?.pagos?.pendiente ?? 0;

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Dashboard comercial"
                    subtitle="Vista general de tu negocio — se actualiza automáticamente"
                    actions={
                        <div className="flex flex-wrap items-center gap-3">
                            <LiveSyncBadge isRefreshing={isRefreshing} lastUpdated={lastUpdated} onRefresh={refresh} />
                            <Badge variant="oliva">
                                {new Date().toLocaleDateString('es-BO', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </Badge>
                        </div>
                    }
                />
            }
        >
            <Head title="Dashboard Comercial" />

            <div className={`space-y-8 transition-opacity duration-300 ${isRefreshing ? 'opacity-95' : 'opacity-100'}`}>
                <QuickLinkCard links={quickLinks} />

                {(pedidosPendientes > 0 || pagosPendientes > 0 || (metricas?.productos?.stock_bajo ?? 0) > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {pedidosPendientes > 0 && (
                            <Link
                                href={route('pedidos.index')}
                                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 hover:bg-amber-100 transition-colors"
                            >
                                {pedidosPendientes} pedido(s) requieren seguimiento
                            </Link>
                        )}
                        {pagosPendientes > 0 && (
                            <Link
                                href={route('pagos.index')}
                                className="rounded-xl border border-terracota-200 bg-terracota-50 px-4 py-3 text-sm font-medium text-terracota-900 hover:bg-terracota-100 transition-colors"
                            >
                                {pagosPendientes} pago(s) pendientes de revisión
                            </Link>
                        )}
                        {(metricas?.productos?.stock_bajo ?? 0) > 0 && (
                            <Link
                                href={route('reportes.index')}
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900 hover:bg-red-100 transition-colors"
                            >
                                {metricas.productos.stock_bajo} producto(s) con stock bajo
                            </Link>
                        )}
                    </div>
                )}

                <DashboardSection title="Clientes y leads" accent="oliva">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <DashboardStatCard title="Total clientes" value={metricas?.clientes?.total ?? 0} variant="oliva" />
                        <DashboardStatCard title="Total leads" value={metricas?.leads?.total ?? 0} variant="cyan" />
                        <DashboardStatCard title="Leads nuevos" value={metricas?.leads?.nuevos ?? 0} variant="green" />
                        <DashboardStatCard title="Leads convertidos" value={metricas?.leads?.convertidos ?? 0} variant="green" />
                    </div>
                </DashboardSection>

                <DashboardSection title="Productos e inventario" accent="terracota">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <DashboardStatCard title="Total productos" value={metricas?.productos?.total ?? 0} variant="oliva" />
                        <DashboardStatCard title="Productos activos" value={metricas?.productos?.activos ?? 0} variant="green" />
                        <DashboardStatCard
                            title="Stock bajo"
                            value={metricas?.productos?.stock_bajo ?? 0}
                            variant="amber"
                            highlight={(metricas?.productos?.stock_bajo ?? 0) > 0}
                        />
                        <DashboardStatCard title="Movimientos" value={metricas?.inventario?.movimientos ?? 0} variant="cyan" />
                    </div>
                </DashboardSection>

                <DashboardSection title="Pedidos" accent="oliva">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <DashboardStatCard title="Total pedidos" value={metricas?.pedidos?.total ?? 0} variant="oliva" />
                        <DashboardStatCard title="Borrador" value={metricas?.pedidos?.borrador ?? 0} variant="amber" />
                        <DashboardStatCard title="Confirmados" value={metricas?.pedidos?.confirmado ?? 0} variant="green" />
                        <DashboardStatCard title="Cancelados" value={metricas?.pedidos?.cancelado ?? 0} variant="red" />
                    </div>
                </DashboardSection>

                <DashboardSection title="Pagos" accent="terracota">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <DashboardStatCard title="Total pagos" value={metricas?.pagos?.total ?? 0} variant="oliva" />
                        <DashboardStatCard
                            title="Pendientes"
                            value={metricas?.pagos?.pendiente ?? 0}
                            variant="amber"
                            highlight={(metricas?.pagos?.pendiente ?? 0) > 0}
                        />
                        <DashboardStatCard title="Pagados" value={metricas?.pagos?.pagado ?? 0} variant="green" />
                        <DashboardStatCard
                            title="Monto total"
                            value={formatBOB(metricas?.pagos?.monto_total_pagado ?? 0)}
                            variant="green"
                        />
                    </div>
                </DashboardSection>

                <DashboardSection title="Live Sales" accent="cyan">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DashboardStatCard title="Sesiones totales" value={metricas?.live_sales?.sesiones_totales ?? 0} variant="cyan" />
                        <DashboardStatCard
                            title="En vivo / programadas"
                            value={metricas?.live_sales?.sesiones_en_vivo_o_programadas ?? 0}
                            variant="green"
                        />
                        <DashboardStatCard title="Interacciones" value={metricas?.live_sales?.interacciones_totales ?? 0} variant="oliva" />
                    </div>
                </DashboardSection>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SectionCard title="Pedidos por canal" subtitle="Cantidad de pedidos por canal de venta">
                        <HorizontalBar data={ventasCanal} labelKey="name" valueKey="value" formatValue={formatNumber} />
                    </SectionCard>
                    <SectionCard title="Pedidos por tipo de flujo" subtitle="Distribución por flujo comercial">
                        <HorizontalBar data={ventasFlujo} labelKey="name" valueKey="value" formatValue={formatNumber} />
                    </SectionCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
