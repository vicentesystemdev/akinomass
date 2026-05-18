import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import FilterBar from '@/Components/FilterBar';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ leads, estados }) {
    const [filters, setFilters] = useState({ estado: '', canal: '', flujo: '' });
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [leadToConvert, setLeadToConvert] = useState(null);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredLeads = leads.filter((lead) => {
        if (filters.estado && lead.estado_lea?.toLowerCase() !== filters.estado.toLowerCase()) return false;
        return true;
    });

    const handleEstadoChange = (lead, nuevoEstado) => {
        router.patch(route('leads.update-estado', lead.cod_lead), {
            estado_lea: nuevoEstado,
        });
    };

    const openConvertModal = (lead) => {
        setLeadToConvert(lead);
        setShowConvertModal(true);
    };

    const closeConvertModal = () => {
        setLeadToConvert(null);
        setShowConvertModal(false);
    };

    const handleConvertir = () => {
        if (leadToConvert) {
            router.post(route('leads.convertir', leadToConvert.cod_lead), {}, {
                onSuccess: () => closeConvertModal(),
            });
        }
    };

    const filterOptions = [
        {
            key: 'estado',
            label: 'Estado',
            value: filters.estado,
            options: estados.map((e) => ({ value: e, label: e.charAt(0).toUpperCase() + e.slice(1) })),
            placeholder: 'Todos los estados',
            className: 'w-48',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Leads"
                    subtitle="Gestiona tus prospectos y oportunidades comerciales"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Leads' },
                    ]}
                    actions={
                        <Link href={route('leads.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                            >
                                Nuevo Lead
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Leads" />

            <div className="space-y-6">
                <SectionCard noPadding>
                    <div className="px-6 py-4 border-b border-gray-100">
                        <FilterBar filters={filterOptions} onFilterChange={handleFilterChange} />
                    </div>

                    {filteredLeads.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Lead</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Canal</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Flujo</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Responsable</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Seguimiento</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {filteredLeads.map((lead) => (
                                    <TableWrapper.Row key={lead.cod_lead}>
                                        <TableWrapper.Cell>
                                            <div>
                                                <p className="font-medium text-cafe-900">{lead.nombre_lea}</p>
                                                {lead.alias_lea && (
                                                    <p className="text-xs text-gray-500 mt-0.5">Alias: {lead.alias_lea}</p>
                                                )}
                                                {lead.correo_lea && (
                                                    <p className="text-xs text-gray-500">{lead.correo_lea}</p>
                                                )}
                                            </div>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <select
                                                value={lead.estado_lea}
                                                onChange={(e) => handleEstadoChange(lead, e.target.value)}
                                                className="text-xs rounded-lg border-gray-300 focus:border-terracota-500 focus:ring-terracota-500 py-1 px-2 transition-all duration-200"
                                            >
                                                {estados.map((estado) => (
                                                    <option key={estado} value={estado}>
                                                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <span className="text-sm text-cafe-700">
                                                {lead.canal_venta?.nombre_can || '-'}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <span className="text-sm text-cafe-700">
                                                {lead.tipo_flujo_comercial?.nombre_tip || '-'}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <span className="text-sm text-cafe-700">
                                                {lead.usuario_responsable?.name || '-'}
                                            </span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            {lead.fecha_seguimiento_lea ? (
                                                <span className="text-sm text-cafe-700">
                                                    {new Date(lead.fecha_seguimiento_lea).toLocaleDateString('es-BO')}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('leads.edit', lead.cod_lead)}
                                                    className="inline-flex items-center gap-1 text-sm font-medium text-oliva-600 hover:text-oliva-700 transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Editar
                                                </Link>
                                                {lead.estado_lea !== 'convertido' && (
                                                    <button
                                                        onClick={() => openConvertModal(lead)}
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-terracota-600 hover:text-terracota-700 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        Convertir
                                                    </button>
                                                )}
                                            </div>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title="No hay leads registrados"
                            description="Comienza registrando tu primer lead para dar seguimiento a tus oportunidades comerciales."
                            action={
                                <Link href={route('leads.create')}>
                                    <PrimaryActionButton
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        }
                                    >
                                        Registrar Lead
                                    </PrimaryActionButton>
                                </Link>
                            }
                        />
                    )}
                </SectionCard>
            </div>

            {/* Modal de confirmación para convertir lead */}
            {showConvertModal && leadToConvert && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div
                            className="fixed inset-0 bg-cafe-950/50 transition-opacity"
                            onClick={closeConvertModal}
                        />
                        
                        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-terracota-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-terracota-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">
                                        Convertir Lead a Cliente
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Estás seguro de que deseas convertir a <strong className="text-cafe-700">{leadToConvert.nombre_lea}</strong> en un cliente?
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Esta acción creará un nuevo cliente con los datos del lead y marcará el lead como convertido.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <PrimaryActionButton
                                    onClick={handleConvertir}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    }
                                >
                                    Sí, Convertir
                                </PrimaryActionButton>
                                <SecondaryButton onClick={closeConvertModal}>
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
