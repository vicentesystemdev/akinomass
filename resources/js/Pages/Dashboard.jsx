import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const NumberCard = ({ title, value }) => (
    <div className="rounded border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
);

const ListBlock = ({ title, items }) => (
    <div className="rounded border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {items?.length ? (
                items.map((item) => (
                    <li key={item.etiqueta} className="flex items-center justify-between">
                        <span>{item.etiqueta}</span>
                        <span className="font-semibold">{item.total}</span>
                    </li>
                ))
            ) : (
                <li className="text-gray-400">Sin datos</li>
            )}
        </ul>
    </div>
);

export default function Dashboard({ metricas }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions ?? [];
    const hasPermission = (permission) => permissions.includes(permission);

    const quickLinks = [
        { label: 'Clientes', routeName: 'clientes.index', canView: hasPermission('clientes.ver') },
        { label: 'Leads', routeName: 'leads.index', canView: hasPermission('leads.ver') },
        { label: 'Plantillas', routeName: 'plantillas-mensaje.index', canView: hasPermission('leads.ver') },
        { label: 'Productos', routeName: 'productos.index', canView: hasPermission('productos.ver') },
        { label: 'Inventario', routeName: 'inventario.index', canView: hasPermission('inventario.ver') },
        { label: 'Pedidos', routeName: 'pedidos.index', canView: hasPermission('pedidos.ver') },
        { label: 'Pagos', routeName: 'pagos.index', canView: hasPermission('pagos.ver') },
        { label: 'LiveSales', routeName: 'live-sales.index', canView: hasPermission('pedidos.ver') || hasPermission('leads.ver') },
        { label: 'Reportes', routeName: 'reportes.index', canView: hasPermission('reportes.ver') },
    ].filter((item) => item.canView);

    const amountFormatter = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
    });

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard comercial</h2>}
        >
            <Head title="Dashboard comercial" />

            <div className="py-8">
                <div className="mx-auto mb-4 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded border bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700">Accesos rápidos</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {quickLinks.length ? (
                                quickLinks.map((item) => (
                                    <Link
                                        key={item.routeName}
                                        href={route(item.routeName)}
                                        className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        {item.label}
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">Sin accesos disponibles</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 xl:grid-cols-4">
                    <NumberCard title="Clientes" value={metricas.clientes.total} />
                    <NumberCard title="Leads" value={metricas.leads.total} />
                    <NumberCard title="Leads nuevos" value={metricas.leads.nuevos} />
                    <NumberCard title="Leads convertidos" value={metricas.leads.convertidos} />

                    <NumberCard title="Productos" value={metricas.productos.total} />
                    <NumberCard title="Productos activos" value={metricas.productos.activos} />
                    <NumberCard title="Stock bajo" value={metricas.productos.stock_bajo} />

                    <NumberCard title="Pedidos" value={metricas.pedidos.total} />
                    <NumberCard title="Pedidos borrador" value={metricas.pedidos.borrador} />
                    <NumberCard title="Pedidos confirmados" value={metricas.pedidos.confirmado} />
                    <NumberCard title="Pedidos cancelados" value={metricas.pedidos.cancelado} />

                    <NumberCard title="Pagos" value={metricas.pagos.total} />
                    <NumberCard title="Pagos pendientes" value={metricas.pagos.pendiente} />
                    <NumberCard title="Pagos pagados" value={metricas.pagos.pagado} />
                    <NumberCard title="Monto pagado" value={amountFormatter.format(metricas.pagos.monto_total_pagado)} />

                    <NumberCard title="Sesiones live" value={metricas.live_sales.sesiones_totales} />
                    <NumberCard title="Live en vivo/programadas" value={metricas.live_sales.sesiones_en_vivo_o_programadas} />
                    <NumberCard title="Interacciones live" value={metricas.live_sales.interacciones_totales} />
                </div>

                <div className="mx-auto mt-4 grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <ListBlock title="Ventas por canal" items={metricas.ventas_por_canal} />
                    <ListBlock title="Ventas por tipo de flujo" items={metricas.ventas_por_tipo_flujo} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
