import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import FilterBar from '@/Components/FilterBar';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ clientes = { data: [] }, canales = [], tiposFlujo = [], estados = [] }) {
    const [filters, setFilters] = useState({ estado: '', canal: '', flujo: '' });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clientesData = clientes.data || [];
    const canalesArray = Array.isArray(canales) ? canales : [];
    const tiposFlujoArray = Array.isArray(tiposFlujo) ? tiposFlujo : [];

    const filteredClientes = clientesData.filter((cliente) => {
        if (filters.estado && cliente.estado_cli?.toLowerCase() !== filters.estado.toLowerCase()) return false;
        if (filters.canal && cliente.cod_canal_venta != filters.canal) return false;
        if (filters.flujo && cliente.cod_tipo_flujo_comercial != filters.flujo) return false;
        return true;
    });

    const filterOptions = [
        {
            key: 'estado',
            label: 'Estado',
            value: filters.estado,
            options: estados.map((e) => ({ value: e, label: e.charAt(0).toUpperCase() + e.slice(1) })),
            placeholder: 'Todos los estados',
            className: 'w-40',
        },
        {
            key: 'canal',
            label: 'Canal',
            value: filters.canal,
            options: canalesArray.map((c) => ({ value: c.cod_canal_venta, label: c.nombre_can })),
            placeholder: 'Todos los canales',
            className: 'w-48',
        },
        {
            key: 'flujo',
            label: 'Flujo',
            value: filters.flujo,
            options: tiposFlujoArray.map((t) => ({ value: t.cod_tipo_flujo_comercial, label: t.nombre_tip })),
            placeholder: 'Todos los flujos',
            className: 'w-48',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Clientes"
                    subtitle="Gestiona tus clientes registrados"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Clientes' },
                    ]}
                    actions={
                        <Link href={route('clientes.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                            >
                                Nuevo Cliente
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Clientes" />

            <div className="space-y-6">
                <SectionCard noPadding>
                    <div className="px-6 py-4 border-b border-gray-100">
                        <FilterBar filters={filterOptions} onFilterChange={handleFilterChange} />
                    </div>

                    {filteredClientes.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Nombre</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Teléfono</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Canal</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Flujo</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {filteredClientes.map((cliente) => (
                                    <TableWrapper.Row key={cliente.cod_cliente}>
                                        <TableWrapper.Cell>
                                            <div>
                                                <p className="font-medium text-cafe-900">{cliente.nombre_cli}</p>
                                                {cliente.correo_cli && (
                                                    <p className="text-xs text-gray-500 mt-0.5">{cliente.correo_cli}</p>
                                                )}
                                            </div>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            {cliente.telefono_cli || '-'}
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <StatusBadge status={cliente.estado_cli} />
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            {cliente.canal_venta?.nombre_can || '-'}
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            {cliente.tipo_flujo_comercial?.nombre_tip || '-'}
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <Link
                                                href={route('clientes.edit', cliente.cod_cliente)}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-terracota-600 hover:text-terracota-700 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                            </Link>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title="No hay clientes registrados"
                            description="Comienza creando tu primer cliente para gestionar tus contactos comerciales."
                            action={
                                <Link href={route('clientes.create')}>
                                    <PrimaryActionButton
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        }
                                    >
                                        Crear Cliente
                                    </PrimaryActionButton>
                                </Link>
                            }
                        />
                    )}

                    <Pagination links={clientes.links} meta={clientes.meta} />
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
