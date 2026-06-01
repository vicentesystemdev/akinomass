import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ComprobantePagoViewer from '@/Components/Pagos/ComprobantePagoViewer';
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

const metodoLabels = {
    qr: 'QR',
    transferencia: 'Transferencia',
    efectivo: 'Efectivo',
    deposito: 'Depósito',
    otro: 'Otro',
};

export default function Show({ pago }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showObservarModal, setShowObservarModal] = useState(false);
    const [showRechazarModal, setShowRechazarModal] = useState(false);

    const handleConfirmar = () => {
        router.post(route('pagos.confirmar', pago.cod_pago), {}, {
            onSuccess: () => setShowConfirmModal(false),
        });
    };

    const handleObservar = () => {
        router.post(route('pagos.observar', pago.cod_pago), {}, {
            onSuccess: () => setShowObservarModal(false),
        });
    };

    const handleRechazar = () => {
        router.post(route('pagos.rechazar', pago.cod_pago), {}, {
            onSuccess: () => setShowRechazarModal(false),
        });
    };

    const comprobante = pago.comprobante_web;
    const faltaComprobanteTienda =
        comprobante?.origen_tienda && !comprobante?.tiene && pago.estado_pago_pag === 'pendiente';

    const canEdit = pago.estado_pago_pag === 'pendiente';
    const canConfirm = pago.estado_pago_pag === 'pendiente' && !faltaComprobanteTienda;
    const canObservar = pago.estado_pago_pag === 'pendiente';
    const canRechazar = pago.estado_pago_pag === 'pendiente' || pago.estado_pago_pag === 'observado';

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={`Pago #${pago.cod_pago}`}
                    subtitle={`Registrado el ${formatDate(pago.fecha_pago_pag)}`}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Pagos', href: route('pagos.index') },
                        { label: `Pago #${pago.cod_pago}` },
                    ]}
                    actions={
                        <div className="flex items-center gap-3">
                            <StatusBadge status={pago.estado_pago_pag} size="lg" />
                            {canEdit && (
                                <Link href={route('pagos.edit', pago.cod_pago)}>
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
            <Head title={`Pago #${pago.cod_pago}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <SectionCard
                    title="Comprobante del cliente"
                    subtitle="Revisa el comprobante antes de confirmar el pago"
                >
                    <ComprobantePagoViewer comprobante={comprobante} />
                </SectionCard>

                <SectionCard title="Detalle del Pago">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Pedido Asociado</p>
                            <p className="text-sm font-mono font-medium text-cafe-900 mt-0.5">
                                {pago.pedido?.numero_pedido_ped || `#${pago.cod_pedido}`}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Método de Pago</p>
                            <p className="text-sm font-medium text-cafe-900 mt-0.5">
                                {metodoLabels[pago.metodo_pago_pag] || pago.metodo_pago_pag}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Monto</p>
                            <p className="text-xl font-bold text-terracota-600 mt-0.5">
                                {formatBOB(pago.monto_pag)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Fecha de Pago</p>
                            <p className="text-sm text-cafe-700 mt-0.5">
                                {formatDate(pago.fecha_pago_pag)}
                            </p>
                        </div>
                        {pago.referencia_pag && (
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Referencia</p>
                                <p className="text-sm font-mono text-cafe-700 mt-0.5">
                                    {pago.referencia_pag}
                                </p>
                            </div>
                        )}
                        {pago.observacion_pag && (
                            <div className="sm:col-span-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Observaciones</p>
                                <p className="text-sm text-cafe-700 mt-0.5">
                                    {pago.observacion_pag}
                                </p>
                            </div>
                        )}
                    </div>
                </SectionCard>

                {/* Acciones contextuales */}
                {(canConfirm || canObservar || canRechazar) && (
                    <SectionCard title="Acciones">
                        <div className="flex flex-wrap gap-3 justify-end">
                            {canRechazar && (
                                <button
                                    onClick={() => setShowRechazarModal(true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Rechazar
                                </button>
                            )}
                            {canObservar && (
                                <button
                                    onClick={() => setShowObservarModal(true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Observar
                                </button>
                            )}
                            {pago.estado_pago_pag === 'pendiente' && faltaComprobanteTienda && (
                                <p className="w-full text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                                    No puedes confirmar sin comprobante: el cliente debe subirlo desde la tienda.
                                </p>
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
                                    Confirmar Pago
                                </PrimaryActionButton>
                            )}
                        </div>
                    </SectionCard>
                )}
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
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">Confirmar Pago</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Estás seguro de confirmar el pago <strong className="text-cafe-700">#{pago.cod_pago}</strong> por <strong className="text-terracota-600">{formatBOB(pago.monto_pag)}</strong>?
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

            {/* Modal Observar */}
            {showObservarModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-cafe-950/50 transition-opacity" onClick={() => setShowObservarModal(false)} />
                        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">Observar Pago</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Estás seguro de marcar como observado el pago <strong className="text-cafe-700">#{pago.cod_pago}</strong>?
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            El pago quedará pendiente de revisión adicional.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    onClick={handleObservar}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-all duration-200"
                                >
                                    Sí, Observar
                                </button>
                                <SecondaryButton onClick={() => setShowObservarModal(false)}>
                                    Cancelar
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Rechazar */}
            {showRechazarModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-cafe-950/50 transition-opacity" onClick={() => setShowRechazarModal(false)} />
                        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">Rechazar Pago</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Estás seguro de rechazar el pago <strong className="text-cafe-700">#{pago.cod_pago}</strong> por <strong className="text-terracota-600">{formatBOB(pago.monto_pag)}</strong>?
                                        </p>
                                        <p className="text-sm text-red-500 mt-2">
                                            Esta acción no se puede deshacer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    onClick={handleRechazar}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200"
                                >
                                    Sí, Rechazar
                                </button>
                                <SecondaryButton onClick={() => setShowRechazarModal(false)}>
                                    Cancelar
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
