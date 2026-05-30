import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const estadoOptions = [
    { value: 'programada', label: 'Programada' },
    { value: 'en_vivo', label: 'En Vivo' },
    { value: 'finalizada', label: 'Finalizada' },
    { value: 'cancelada', label: 'Cancelada' },
];

export default function Index({ sesiones = { data: [] } }) {
    const [filterEstado, setFilterEstado] = useState('');

    const sesionesData = sesiones.data || [];

    const filteredSesiones = useMemo(() => {
        if (!filterEstado) return sesionesData;
        return sesionesData.filter((s) => s.estado_ses === filterEstado);
    }, [sesionesData, filterEstado]);

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Live Sales"
                    subtitle="Gestiona tus sesiones de venta en vivo"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Live Sales' },
                    ]}
                    actions={
                        <Link href={route('live-sales.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                }
                            >
                                Nueva Sesión
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Live Sales" />

            <div className="space-y-6">
                {/* Filtro */}
                <SectionCard>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-cafe-700">Filtrar por estado:</span>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200 w-48"
                        >
                            <option value="">Todas las sesiones</option>
                            {estadoOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-500">
                            {filteredSesiones.length} {filteredSesiones.length === 1 ? 'sesión' : 'sesiones'}
                        </span>
                    </div>
                </SectionCard>

                {/* Cards de sesiones */}
                {filteredSesiones.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSesiones.map((sesion) => (
                            <Link
                                key={sesion.cod_sesion_live}
                                href={route('live-sales.show', sesion.cod_sesion_live)}
                                className="block"
                            >
                                <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
                                    {/* Header de la card */}
                                    <div className={`px-5 py-3 ${
                                        sesion.estado_ses === 'en_vivo'
                                            ? 'bg-terracota-50 border-b border-terracota-100'
                                            : sesion.estado_ses === 'finalizada'
                                            ? 'bg-green-50 border-b border-green-100'
                                            : sesion.estado_ses === 'cancelada'
                                            ? 'bg-red-50 border-b border-red-100'
                                            : 'bg-gray-50 border-b border-gray-100'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <StatusBadge status={sesion.estado_ses} />
                                            {sesion.estado_ses === 'en_vivo' && (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-terracota-600">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracota-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-terracota-500"></span>
                                                    </span>
                                                    EN VIVO
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="px-5 py-4">
                                        <h3 className="font-semibold text-cafe-900 text-base mb-2 truncate">
                                            {sesion.titulo_ses}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3">
                                            {sesion.canal_venta?.nombre_can || 'Sin canal'}
                                        </p>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(sesion.fecha_inicio_ses)}
                                            </div>
                                            {sesion.fecha_fin_ses && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Fin: {formatDate(sesion.fecha_fin_ses)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                {sesion.productos_live?.length || 0} productos
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                {sesion.interacciones_live?.length || 0} interacciones
                                            </span>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title={filterEstado ? 'No hay sesiones con este estado' : 'No hay sesiones de Live Sales'}
                        description={
                            filterEstado
                                ? 'Intenta cambiar el filtro para ver otras sesiones.'
                                : 'Crea tu primera sesión de venta en vivo para comenzar a registrar interacciones.'
                        }
                        action={
                            !filterEstado ? (
                                <Link href={route('live-sales.create')}>
                                    <PrimaryActionButton
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        }
                                    >
                                        Crear Sesión
                                    </PrimaryActionButton>
                                </Link>
                            ) : null
                        }
                    />
                )}

                <Pagination links={sesiones.links} meta={sesiones.meta} />
            </div>
        </AuthenticatedLayout>
    );
}
