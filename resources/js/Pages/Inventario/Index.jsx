import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import { Head, Link } from '@inertiajs/react';

const KpiCard = ({ title, value, icon, variant = 'oliva', subtitle = '' }) => {
    const variants = {
        oliva: {
            bg: 'bg-oliva-50',
            iconBg: 'bg-oliva-100',
            iconColor: 'text-oliva-600',
            valueColor: 'text-oliva-800',
        },
        terracota: {
            bg: 'bg-terracota-50',
            iconBg: 'bg-terracota-100',
            iconColor: 'text-terracota-600',
            valueColor: 'text-terracota-800',
        },
        green: {
            bg: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            valueColor: 'text-green-800',
        },
        cyan: {
            bg: 'bg-cyan-50',
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-600',
            valueColor: 'text-cyan-800',
        },
    };

    const style = variants[variant] || variants.oliva;

    return (
        <div className={`relative overflow-hidden rounded-xl ${style.bg} p-5 border border-gray-100`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`mt-2 text-3xl font-bold ${style.valueColor}`}>{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${style.iconBg}`}>
                    <span className={`w-6 h-6 block ${style.iconColor}`}>{icon}</span>
                </div>
            </div>
        </div>
    );
};

const QuickAccessCard = ({ links }) => {
    if (!links || links.length === 0) return null;

    return (
        <SectionCard title="Acciones de Inventario">
            <div className="flex flex-wrap gap-3">
                {links.map((item) => (
                    <Link
                        key={item.routeName}
                        href={route(item.routeName)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                            item.variant === 'terracota'
                                ? 'bg-terracota-50 text-terracota-700 border-terracota-200 hover:bg-terracota-100'
                                : item.variant === 'green'
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : item.variant === 'cyan'
                                ? 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
                                : 'bg-oliva-50 text-oliva-700 border-oliva-200 hover:bg-oliva-100'
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </div>
        </SectionCard>
    );
};

export default function Index({ inventarios, stockBajo }) {
    const totalStock = inventarios.reduce((sum, inv) => sum + (parseInt(inv.stock_actual_inv) || 0), 0);
    const totalProductos = inventarios.length;
    const inventariosActivos = inventarios.filter((inv) => inv.activo_inv !== false);

    const quickLinks = [
        {
            label: 'Registrar Entrada',
            routeName: 'inventario.entrada.form',
            variant: 'green',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
        },
        {
            label: 'Registrar Salida',
            routeName: 'inventario.salida.form',
            variant: 'terracota',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
            ),
        },
        {
            label: 'Ajustar Stock',
            routeName: 'inventario.ajuste.form',
            variant: 'cyan',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            ),
        },
        {
            label: 'Ver Movimientos',
            routeName: 'inventario.movimientos',
            variant: 'oliva',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Inventario"
                    subtitle="Control de existencias y movimientos de stock"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Inventario' },
                    ]}
                />
            }
        >
            <Head title="Inventario" />

            <div className="space-y-6">
                {/* Accesos rápidos */}
                <QuickAccessCard links={quickLinks} />

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Total Productos"
                        value={totalProductos}
                        variant="oliva"
                        subtitle="Con inventario registrado"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        }
                    />
                    <KpiCard
                        title="Stock Total"
                        value={totalStock}
                        variant="green"
                        subtitle="Unidades en inventario"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                    />
                    <KpiCard
                        title="Stock Bajo"
                        value={stockBajo.length}
                        variant="terracota"
                        subtitle="Por debajo del mínimo"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                    />
                    <KpiCard
                        title="Inventarios Activos"
                        value={inventariosActivos.length}
                        variant="cyan"
                        subtitle="Actualmente en seguimiento"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                </div>

                {/* Alertas de stock bajo */}
                {stockBajo.length > 0 && (
                    <SectionCard
                        title="Alertas de Stock Bajo"
                        subtitle="Productos que requieren reposición"
                        headerActions={
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-terracota-100 text-terracota-700 rounded-full">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
                                </svg>
                                {stockBajo.length} {stockBajo.length === 1 ? 'producto' : 'productos'}
                            </span>
                        }
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {stockBajo.map((inv) => (
                                <div
                                    key={inv.cod_inventario}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-terracota-200 bg-terracota-50/50"
                                >
                                    <div className="flex-shrink-0 p-2 bg-terracota-100 rounded-lg">
                                        <svg className="w-5 h-5 text-terracota-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-cafe-900 truncate">
                                            {inv.producto?.nombre_pro || 'Producto sin nombre'}
                                        </p>
                                        <p className="text-xs text-terracota-600 mt-0.5">
                                            Stock: {inv.stock_actual_inv} / Mínimo: {inv.stock_minimo_inv}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}

                {/* Tabla principal de inventario */}
                <SectionCard noPadding>
                    {inventarios.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Stock Actual</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Stock Mínimo</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Ubicación</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {inventarios.map((inv) => {
                                    const stockBajoItem = inv.stock_actual_inv <= inv.stock_minimo_inv;
                                    return (
                                        <TableWrapper.Row
                                            key={inv.cod_inventario}
                                            className={stockBajoItem ? 'bg-terracota-50/30' : ''}
                                        >
                                            <TableWrapper.Cell>
                                                <div className="flex items-center gap-3">
                                                    {stockBajoItem && (
                                                        <div className="flex-shrink-0">
                                                            <svg className="w-4 h-4 text-terracota-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-cafe-900">
                                                            {inv.producto?.nombre_pro || 'Producto sin nombre'}
                                                        </p>
                                                        {inv.producto?.sku_pro && (
                                                            <p className="text-xs text-gray-400 font-mono">
                                                                SKU: {inv.producto.sku_pro}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell align="center">
                                                <span className={`text-lg font-bold ${stockBajoItem ? 'text-terracota-600' : 'text-cafe-900'}`}>
                                                    {inv.stock_actual_inv}
                                                </span>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell align="center">
                                                <span className="text-sm text-gray-500">
                                                    {inv.stock_minimo_inv ?? '-'}
                                                </span>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell>
                                                <span className="text-sm text-cafe-700">
                                                    {inv.ubicacion_inv || '-'}
                                                </span>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell>
                                                {stockBajoItem ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-terracota-100 text-terracota-700 rounded-full">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
                                                        </svg>
                                                        Stock bajo
                                                    </span>
                                                ) : (
                                                    <StatusBadge status={inv.activo_inv !== false ? 'activo' : 'inactivo'} />
                                                )}
                                            </TableWrapper.Cell>
                                        </TableWrapper.Row>
                                    );
                                })}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title="No hay inventarios registrados"
                            description="Comienza registrando tu primer producto en inventario para hacer seguimiento de las existencias."
                            action={
                                <Link href={route('inventario.entrada.form')}>
                                    <PrimaryActionButton
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        }
                                    >
                                        Registrar Entrada
                                    </PrimaryActionButton>
                                </Link>
                            }
                        />
                    )}
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
