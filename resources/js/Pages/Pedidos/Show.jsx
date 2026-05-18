import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const formatBOB = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function Show({ pedido }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleConfirmar = () => {
        router.post(route('pedidos.confirmar', pedido.cod_pedido), {}, {
            onSuccess: () => setShowConfirmModal(false),
        });
    };

    const handleCancelar = () => {
        router.post(route('pedidos.cancelar', pedido.cod_pedido), {}, {
            onSuccess: () => setShowCancelModal(false),
        });
    };

    const canConfirm = pedido.estado_ped === 'borrador';
    const canCancel = pedido.estado_ped !== 'cancelado';
    const canEdit = pedido.estado_ped === 'borrador';

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={`Pedido ${pedido.numero_pedido_ped}`}
                    subtitle={`Creado el ${formatDate(pedido.fecha_pedido_ped)}`}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Pedidos', href: route('pedidos.index') },
                        { label: pedido.numero_pedido_ped },
                    ]}
                    actions={
                        <div className="flex items-center gap-3">
                            <StatusBadge status={pedido.estado_ped} size="lg" />
                            {canEdit && (
                                <Link href={route('pedidos.edit', pedido.cod_pedido)}>
                                    <SecondaryButton>
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar
                                    </SecondaryButton>
                                </Link>
                            )}
                        </div>
                    }
                />
            }
        >
            <Head title={`Pedido ${pedido.numero_pedido_ped}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SectionCard title="Cliente">
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Nombre</p>
                                <p className="text-sm font-medium text-cafe-900 mt-0.5">
                                    {pedido.cliente?.nombre_cli || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Canal de Venta</p>
                                <p className="text-sm text-cafe-700 mt-0.5">
                                    {pedido.canal_venta?.nombre_can || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Tipo de Flujo</p>
                                <p className="text-sm text-cafe-700 mt-0.5">
                                    {pedido.tipo_flujo_comercial?.nombre_tip || '-'}
                                </p>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Resumen del Pedido">
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Número</p>
                                <p className="text-sm font-mono font-medium text-cafe-900 mt-0.5">
                                    {pedido.numero_pedido_ped}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Fecha</p>
                                <p className="text-sm text-cafe-700 mt-0.5">
                                    {formatDate(pedido.fecha_pedido_ped)}
                                </p>
                            </div>
                            {pedido.observacion_ped && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Observaciones</p>
                                    <p className="text-sm text-cafe-700 mt-0.5">
                                        {pedido.observacion_ped}
                                    </p>
                                </div>
                            )}
                        </div>
                    </SectionCard>
                </div>

                {/* Detalle de productos */}
                <SectionCard title="Productos" noPadding>
                    {pedido.detalles && pedido.detalles.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Cantidad</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Precio Unitario</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Subtotal</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {pedido.detalles.map((detalle, index) => (
                                    <TableWrapper.Row key={index}>
                                        <TableWrapper.Cell>
                                            <p className="font-medium text-cafe-900">
                                                {detalle.producto?.nombre_pro || 'Producto eliminado'}
                                            </p>
                                            {detalle.producto?.sku_pro && (
                                                <p className="text-xs text-gray-400 font-mono">
                                                    SKU: {detalle.producto.sku_pro}
                                                </p>
                                            )}
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <span className="font-medium text-cafe-700">
                                                {detalle.cantidad_det}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <span className="text-cafe-700">
                                                {formatBOB(detalle.precio_unitario_det)}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <span className="font-medium text-cafe-700">
                                                {formatBOB(detalle.subtotal_det)}
                                            </span>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <div className="p-6 text-center text-gray-500 text-sm">
                            No hay productos en este pedido.
                        </div>
                    )}
                </SectionCard>

                {/* Totales */}
                <SectionCard title="Totales">
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal:</span>
                                <span className="font-medium text-cafe-700">{formatBOB(pedido.subtotal_ped)}</span>
                            </div>
                            {pedido.descuento_ped > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Descuento:</span>
                                    <span className="font-medium text-red-600">-{formatBOB(pedido.descuento_ped)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-3 flex justify-between">
                                <span className="font-semibold text-cafe-900">Total:</span>
                                <span className="text-xl font-bold text-terracota-600">{formatBOB(pedido.total_ped)}</span>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* Acciones */}
                <SectionCard>
                    <div className="flex flex-wrap gap-3 justify-end">
                        {canCancel && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancelar Pedido
                            </button>
                        )}
                        {canConfirm && (
                            <PrimaryActionButton
                                onClick={() => setShowConfirmModal(true)}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                }
                            >
                                Confirmar Pedido
                            </PrimaryActionButton>
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Modal Confirmar */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-cafe-950/50 transition-opacity" onClick={() => setShowConfirmModal(false)} />
                        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">Confirmar Pedido</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Estás seguro de confirmar el pedido <strong className="text-cafe-700">{pedido.numero_pedido_ped}</strong>?
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Esta acción descontará el stock de los productos y no se podrá editar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <PrimaryActionButton onClick={handleConfirmar}>
                                    Sí, Confirmar
                                </PrimaryActionButton>
                                <SecondaryButton onClick={() => setShowConfirmModal(false)}>
                                    Cancelar
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Cancelar */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-cafe-950/50 transition-opacity" onClick={() => setShowCancelModal(false)} />
                        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">Cancelar Pedido</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Estás seguro de cancelar el pedido <strong className="text-cafe-700">{pedido.numero_pedido_ped}</strong>?
                                        </p>
                                        {pedido.estado_ped === 'confirmado' && (
                                            <p className="text-sm text-red-500 mt-2">
                                                Este pedido ya fue confirmado. Se revertirá el stock de los productos.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    onClick={handleCancelar}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200"
                                >
                                    Sí, Cancelar
                                </button>
                                <SecondaryButton onClick={() => setShowCancelModal(false)}>
                                    Volver
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
