import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
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

const metodoLabels = {
    qr: 'QR',
    transferencia: 'Transferencia',
    efectivo: 'Efectivo',
    deposito: 'Depósito',
    otro: 'Otro',
};

const metodoBadgeVariants = {
    qr: 'info',
    transferencia: 'oliva',
    efectivo: 'success',
    deposito: 'terracota',
    otro: 'gray',
};

const estadoOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'pagado', label: 'Pagado' },
    { value: 'observado', label: 'Observado' },
    { value: 'rechazado', label: 'Rechazado' },
    { value: 'reembolsado', label: 'Reembolsado' },
];

const metodoOptions = [
    { value: 'qr', label: 'QR' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'deposito', label: 'Depósito' },
    { value: 'otro', label: 'Otro' },
];

export default function Index({ pagos = { data: [] } }) {
    const [filterEstado, setFilterEstado] = useState('');
    const [filterMetodo, setFilterMetodo] = useState('');

    const pagosData = pagos.data || [];

    const filteredPagos = useMemo(() => {
        return pagosData.filter((p) => {
            if (filterEstado && p.estado_pago_pag !== filterEstado) return false;
            if (filterMetodo && p.metodo_pago_pag !== filterMetodo) return false;
            return true;
        });
    }, [pagosData, filterEstado, filterMetodo]);

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Pagos"
                    subtitle="Gestiona los pagos de tus pedidos"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Pagos' },
                    ]}
                    actions={
                        <Link href={route('pagos.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                            >
                                Registrar Pago
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Pagos" />

            <div className="space-y-6">
                {/* Banner informativo */}
                <div className="bg-oliva-50 border border-oliva-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <svg className="w-5 h-5 text-oliva-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-oliva-800">Registro manual de pagos</p>
                        <p className="text-xs text-oliva-600 mt-0.5">
                            El registro manual de un pago no equivale a la confirmación automática de fondos bancarios.
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <SectionCard>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-cafe-700">Estado:</span>
                            <select
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                                className="rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200 w-40"
                            >
                                <option value="">Todos</option>
                                {estadoOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-cafe-700">Método:</span>
                            <select
                                value={filterMetodo}
                                onChange={(e) => setFilterMetodo(e.target.value)}
                                className="rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200 w-40"
                            >
                                <option value="">Todos</option>
                                {metodoOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-sm text-gray-500 self-center">
                            {filteredPagos.length} {filteredPagos.length === 1 ? 'pago' : 'pagos'}
                        </span>
                    </div>
                </SectionCard>

                {/* Tabla de pagos */}
                <SectionCard noPadding>
                    {filteredPagos.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Pedido</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Método</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Monto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Fecha</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {filteredPagos.map((pago) => (
                                    <TableWrapper.Row key={pago.cod_pago}>
                                        <TableWrapper.Cell>
                                            <p className="font-mono font-medium text-cafe-900">
                                                {pago.pedido?.numero_pedido_ped || `#${pago.cod_pedido}`}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                                                metodoBadgeVariants[pago.metodo_pago_pag] === 'info' ? 'bg-cyan-100 text-cyan-800' :
                                                metodoBadgeVariants[pago.metodo_pago_pag] === 'oliva' ? 'bg-oliva-100 text-oliva-800' :
                                                metodoBadgeVariants[pago.metodo_pago_pag] === 'success' ? 'bg-green-100 text-green-800' :
                                                metodoBadgeVariants[pago.metodo_pago_pag] === 'terracota' ? 'bg-terracota-100 text-terracota-800' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {metodoLabels[pago.metodo_pago_pag] || pago.metodo_pago_pag}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <p className="font-bold text-terracota-600">
                                                {formatBOB(pago.monto_pag)}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <StatusBadge status={pago.estado_pago_pag} />
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-cafe-700">
                                                {formatDate(pago.fecha_pago_pag)}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <Link
                                                href={route('pagos.show', pago.cod_pago)}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-oliva-600 hover:text-oliva-700 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Ver
                                            </Link>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title={filterEstado || filterMetodo ? 'No se encontraron pagos' : 'No hay pagos registrados'}
                            description={
                                filterEstado || filterMetodo
                                    ? 'Intenta ajustar los filtros para encontrar lo que buscas.'
                                    : 'Registra tu primer pago para comenzar a gestionar los cobros.'
                            }
                            action={
                                !filterEstado && !filterMetodo ? (
                                    <Link href={route('pagos.create')}>
                                        <PrimaryActionButton
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            }
                                        >
                                            Registrar Pago
                                        </PrimaryActionButton>
                                    </Link>
                                ) : null
                            }
                        />
                    )}

                    <Pagination links={pagos.links} meta={pagos.meta} />
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
