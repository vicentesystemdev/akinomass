import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import { Head, Link } from '@inertiajs/react';

const tipoMovimientoConfig = {
    entrada: {
        label: 'Entrada',
        bg: 'bg-green-100',
        text: 'text-green-800',
        dot: 'bg-green-500',
    },
    salida: {
        label: 'Salida',
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
    },
    ajuste: {
        label: 'Ajuste',
        bg: 'bg-terracota-100',
        text: 'text-terracota-800',
        dot: 'bg-terracota-500',
    },
    devolucion: {
        label: 'Devolución',
        bg: 'bg-green-100',
        text: 'text-green-800',
        dot: 'bg-green-500',
    },
    reserva: {
        label: 'Reserva',
        bg: 'bg-cyan-100',
        text: 'text-cyan-800',
        dot: 'bg-cyan-500',
    },
    cancelacion: {
        label: 'Cancelación',
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
    },
};

const TipoMovimientoBadge = ({ tipo }) => {
    const config = tipoMovimientoConfig[tipo] || {
        label: tipo,
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dot: 'bg-gray-500',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full px-2.5 py-1 text-xs ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function Movimientos({ movimientos = { data: [] } }) {
    const movimientosData = movimientos.data || [];
    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Movimientos de Inventario"
                    subtitle="Historial de entradas, salidas y ajustes"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Inventario', href: route('inventario.index') },
                        { label: 'Movimientos' },
                    ]}
                />
            }
        >
            <Head title="Movimientos de Inventario" />

            <div className="space-y-6">
                {/* Leyenda de tipos */}
                <SectionCard>
                    <div className="flex flex-wrap gap-3">
                        <span className="text-sm font-medium text-cafe-700">Tipos de movimiento:</span>
                        {Object.entries(tipoMovimientoConfig).map(([key, config]) => (
                            <TipoMovimientoBadge key={key} tipo={key} />
                        ))}
                    </div>
                </SectionCard>

                {/* Tabla de movimientos */}
                <SectionCard noPadding>
                    {movimientosData.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Fecha</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Tipo</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Cantidad</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Stock Anterior</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Stock Nuevo</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Responsable</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {movimientosData.map((mov) => (
                                    <TableWrapper.Row key={mov.cod_movimiento_inventario}>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-cafe-700 whitespace-nowrap">
                                                {formatDate(mov.created_at)}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <div>
                                                <p className="font-medium text-cafe-900">
                                                    {mov.producto?.nombre_pro || 'Producto eliminado'}
                                                </p>
                                                {mov.producto?.sku_pro && (
                                                    <p className="text-xs text-gray-400 font-mono">
                                                        SKU: {mov.producto.sku_pro}
                                                    </p>
                                                )}
                                            </div>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <TipoMovimientoBadge tipo={mov.tipo_movimiento_mov} />
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <span className={`font-bold ${
                                                mov.tipo_movimiento_mov === 'salida' || mov.tipo_movimiento_mov === 'cancelacion'
                                                    ? 'text-red-600'
                                                    : mov.tipo_movimiento_mov === 'entrada' || mov.tipo_movimiento_mov === 'devolucion'
                                                    ? 'text-green-600'
                                                    : 'text-terracota-600'
                                            }`}>
                                                {mov.tipo_movimiento_mov === 'salida' || mov.tipo_movimiento_mov === 'cancelacion'
                                                    ? `-${mov.cantidad_mov}`
                                                    : mov.tipo_movimiento_mov === 'ajuste'
                                                    ? '-'
                                                    : `+${mov.cantidad_mov}`}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <span className="text-sm text-gray-500">
                                                {mov.stock_anterior_mov ?? '-'}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <span className="text-sm font-medium text-cafe-700">
                                                {mov.stock_nuevo_mov ?? '-'}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <span className="text-sm text-cafe-700">
                                                {mov.usuario_responsable?.name || 'Sistema'}
                                            </span>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title="No hay movimientos registrados"
                            description="Los movimientos de inventario aparecerán aquí cuando registres entradas, salidas o ajustes."
                            action={
                                <Link href={route('inventario.entrada.form')}>
                                    <span className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-terracota-500 rounded-xl hover:bg-terracota-600 transition-all duration-200">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Registrar Primera Entrada
                                    </span>
                                </Link>
                            }
                        />
                    )}

                    <Pagination links={movimientos.links} meta={movimientos.meta} />
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
