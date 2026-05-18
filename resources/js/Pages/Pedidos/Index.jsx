import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const formatBOB = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric' });
};

const estadoOptions = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'preparando', label: 'Preparando' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregado', label: 'Entregado' },
    { value: 'cancelado', label: 'Cancelado' },
    { value: 'devuelto', label: 'Devuelto' },
];

export default function Index({ pedidos }) {
    const [filterEstado, setFilterEstado] = useState('');

    const filteredPedidos = useMemo(() => {
        if (!filterEstado) return pedidos;
        return pedidos.filter((p) => p.estado_ped === filterEstado);
    }, [pedidos, filterEstado]);

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Pedidos"
                    subtitle="Gestiona los pedidos de tus clientes"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Pedidos' },
                    ]}
                    actions={
                        <Link href={route('pedidos.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                            >
                                Nuevo Pedido
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Pedidos" />

            <div className="space-y-6">
                {/* Filtro por estado */}
                <SectionCard>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-cafe-700">Filtrar por estado:</span>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200 w-48"
                        >
                            <option value="">Todos los estados</option>
                            {estadoOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-500">
                            {filteredPedidos.length} {filteredPedidos.length === 1 ? 'pedido' : 'pedidos'}
                        </span>
                    </div>
                </SectionCard>

                {/* Tabla de pedidos */}
                <SectionCard noPadding>
                    {filteredPedidos.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Número</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Cliente</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Canal</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Fecha</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Total</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {filteredPedidos.map((pedido) => (
                                    <TableWrapper.Row key={pedido.cod_pedido}>
                                        <TableWrapper.Cell>
                                            <p className="font-mono font-medium text-cafe-900">
                                                {pedido.numero_pedido_ped}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="font-medium text-cafe-900">
                                                {pedido.cliente?.nombre_cli || '-'}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-cafe-700">
                                                {pedido.canal_venta?.nombre_can || '-'}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <StatusBadge status={pedido.estado_ped} />
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-cafe-700">
                                                {formatDate(pedido.fecha_pedido_ped)}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <p className="font-bold text-terracota-600">
                                                {formatBOB(pedido.total_ped)}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('pedidos.show', pedido.cod_pedido)}
                                                    className="inline-flex items-center gap-1 text-sm font-medium text-oliva-600 hover:text-oliva-700 transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Ver
                                                </Link>
                                                {pedido.estado_ped === 'borrador' && (
                                                    <Link
                                                        href={route('pedidos.edit', pedido.cod_pedido)}
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-terracota-600 hover:text-terracota-700 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </Link>
                                                )}
                                            </div>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title={filterEstado ? 'No hay pedidos con este estado' : 'No hay pedidos registrados'}
                            description={
                                filterEstado
                                    ? 'Intenta cambiar el filtro para ver otros pedidos.'
                                    : 'Comienza creando tu primer pedido para gestionar las ventas.'
                            }
                            action={
                                !filterEstado ? (
                                    <Link href={route('pedidos.create')}>
                                        <PrimaryActionButton
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            }
                                        >
                                            Crear Pedido
                                        </PrimaryActionButton>
                                    </Link>
                                ) : null
                            }
                        />
                    )}
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
