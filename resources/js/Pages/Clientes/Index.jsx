import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import Table from '@/Components/Table';
import SearchInput from '@/Components/SearchInput';
import FilterBar from '@/Components/FilterBar';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const StatusBadge = ({ estado }) => {
    const variants = {
        activo: { variant: 'success', label: 'Activo' },
        inactivo: { variant: 'gray', label: 'Inactivo' },
    };
    const style = variants[estado?.toLowerCase()] || { variant: 'gray', label: estado };
    return <Badge variant={style.variant}>{style.label}</Badge>;
};

export default function Index({ clientes, canales, tiposFlujo, estados }) {
    const [filters, setFilters] = useState({
        estado: '',
        canal: '',
        flujo: '',
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredClientes = clientes.filter((cliente) => {
        if (filters.estado && cliente.estado_cli?.toLowerCase() !== filters.estado.toLowerCase()) return false;
        if (filters.canal && cliente.cod_canal_venta != filters.canal) return false;
        if (filters.flujo && cliente.cod_tipo_flujo_comercial != filters.flujo) return false;
        return true;
    });

    const columns = [
        {
            label: 'Nombre',
            key: 'nombre_cli',
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.nombre_cli}</p>
                    {row.correo_cli && <p className="text-sm text-gray-500">{row.correo_cli}</p>}
                </div>
            ),
        },
        {
            label: 'Teléfono',
            key: 'telefono_cli',
            render: (row) => row.telefono_cli || '-',
        },
        {
            label: 'Estado',
            key: 'estado_cli',
            render: (row) => <StatusBadge estado={row.estado_cli} />,
        },
        {
            label: 'Canal',
            key: 'canal_venta',
            render: (row) => row.canal_venta?.nombre_can || '-',
        },
        {
            label: 'Flujo',
            key: 'tipo_flujo_comercial',
            render: (row) => row.tipo_flujo_comercial?.nombre_tip || '-',
        },
        {
            label: 'Acciones',
            key: 'acciones',
            width: '150px',
            render: (row) => (
                <div className="flex gap-2">
                    <Link
                        href={route('clientes.edit', row.cod_cliente)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                        Editar
                    </Link>
                </div>
            ),
        },
    ];

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
            options: canales.map((c) => ({ value: c.cod_canal_venta, label: c.nombre_can })),
            placeholder: 'Todos los canales',
            className: 'w-48',
        },
        {
            key: 'flujo',
            label: 'Flujo',
            value: filters.flujo,
            options: tiposFlujo.map((t) => ({ value: t.cod_tipo_flujo_comercial, label: t.nombre_tip })),
            placeholder: 'Todos los flujos',
            className: 'w-48',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Clientes" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                        <p className="text-sm text-gray-500 mt-1">Gestiona tus clientes registrados</p>
                    </div>
                    <Link href={route('clientes.create')}>
                        <Button variant="primary">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nuevo Cliente
                            </span>
                        </Button>
                    </Link>
                </div>

                <Card>
                    <FilterBar
                        filters={filterOptions}
                        onFilterChange={handleFilterChange}
                        className="mb-4"
                    />
                    <Table
                        columns={columns}
                        data={filteredClientes}
                        searchPlaceholder="Buscar por nombre, teléfono o email..."
                        searchKeys={['nombre_cli', 'telefono_cli', 'correo_cli']}
                        emptyMessage="No hay clientes registrados"
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}