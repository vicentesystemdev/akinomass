import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/UI/EmptyState';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const tipoLabels = {
    primer_contacto: 'Primer Contacto',
    seguimiento: 'Seguimiento',
    confirmacion_interes: 'Confirmación Interés',
    confirmacion_pedido: 'Confirmación Pedido',
    recordatorio_pago: 'Recordatorio Pago',
    agradecimiento: 'Agradecimiento',
    cliente_inactivo: 'Cliente Inactivo',
    stock_disponible: 'Stock Disponible',
    respuesta_rapida_live: 'Respuesta Rápida Live',
};

const tipoBadgeVariants = {
    primer_contacto: 'oliva',
    seguimiento: 'info',
    confirmacion_interes: 'terracota',
    confirmacion_pedido: 'success',
    recordatorio_pago: 'warning',
    agradecimiento: 'success',
    cliente_inactivo: 'gray',
    stock_disponible: 'oliva',
    respuesta_rapida_live: 'terracota',
};

export default function Index({ plantillas, plantillasActivas }) {
    const [copiedId, setCopiedId] = useState(null);
    const [filterTipo, setFilterTipo] = useState('');

    const handleCopy = async (plantilla) => {
        try {
            await navigator.clipboard.writeText(plantilla.contenido_pla);
            setCopiedId(plantilla.cod_plantilla_mensaje);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const handleToggle = (plantilla) => {
        router.patch(route('plantillas-mensaje.toggle', plantilla.cod_plantilla_mensaje));
    };

    const allTipos = [...new Set(plantillas.map((p) => p.tipo_pla))];

    const filteredPlantillas = filterTipo
        ? plantillas.filter((p) => p.tipo_pla === filterTipo)
        : plantillas;

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Plantillas de Mensajes"
                    subtitle="Textos sugeridos para copiar, adaptar y usar manualmente"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Plantillas' },
                    ]}
                    actions={
                        <Link href={route('plantillas-mensaje.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                            >
                                Nueva Plantilla
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Plantillas de Mensajes" />

            <div className="space-y-6">
                {/* Banner informativo */}
                <div className="bg-oliva-50 border border-oliva-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <svg className="w-5 h-5 text-oliva-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-oliva-800">Las plantillas son textos sugeridos</p>
                        <p className="text-xs text-oliva-600 mt-0.5">
                            El sistema no envía mensajes automáticamente. Puedes copiar, adaptar y usar manualmente el texto sugerido.
                        </p>
                    </div>
                </div>

                {/* Filtro por tipo */}
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-medium text-cafe-700">Filtrar por tipo:</span>
                    <button
                        onClick={() => setFilterTipo('')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                            !filterTipo
                                ? 'bg-oliva-700 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Todos
                    </button>
                    {allTipos.map((tipo) => (
                        <button
                            key={tipo}
                            onClick={() => setFilterTipo(tipo)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                filterTipo === tipo
                                    ? 'bg-oliva-700 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {tipoLabels[tipo] || tipo}
                        </button>
                    ))}
                </div>

                {/* Cards de plantillas */}
                {filteredPlantillas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPlantillas.map((plantilla) => (
                            <div
                                key={plantilla.cod_plantilla_mensaje}
                                className={`bg-white rounded-xl shadow-card border transition-all duration-200 hover:shadow-card-hover ${
                                    plantilla.activo_pla ? 'border-gray-100' : 'border-gray-200 opacity-75'
                                }`}
                            >
                                <div className="px-5 py-4 border-b border-gray-100">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-cafe-900 text-sm leading-tight">
                                            {plantilla.nombre_pla}
                                        </h3>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Badge
                                                variant={tipoBadgeVariants[plantilla.tipo_pla] || 'default'}
                                                size="sm"
                                            >
                                                {tipoLabels[plantilla.tipo_pla] || plantilla.tipo_pla}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Badge
                                            variant={plantilla.activo_pla ? 'success' : 'gray'}
                                            size="sm"
                                        >
                                            {plantilla.activo_pla ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="px-5 py-4">
                                    <p className="text-sm text-cafe-700 whitespace-pre-wrap leading-relaxed line-clamp-6">
                                        {plantilla.contenido_pla}
                                    </p>
                                </div>

                                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => handleToggle(plantilla)}
                                        className={`text-xs font-medium transition-colors duration-200 ${
                                            plantilla.activo_pla
                                                ? 'text-gray-500 hover:text-gray-700'
                                                : 'text-green-600 hover:text-green-700'
                                        }`}
                                    >
                                        {plantilla.activo_pla ? 'Desactivar' : 'Activar'}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleCopy(plantilla)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                                copiedId === plantilla.cod_plantilla_mensaje
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-oliva-50 text-oliva-700 hover:bg-oliva-100'
                                            }`}
                                        >
                                            {copiedId === plantilla.cod_plantilla_mensaje ? (
                                                <>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Copiado
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                    </svg>
                                                    Copiar
                                                </>
                                            )}
                                        </button>

                                        <Link
                                            href={route('plantillas-mensaje.edit', plantilla.cod_plantilla_mensaje)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-terracota-600 bg-terracota-50 rounded-lg hover:bg-terracota-100 transition-all duration-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No hay plantillas registradas"
                        description="Crea tu primera plantilla de mensaje para usar como texto sugerido en tus interacciones comerciales."
                        action={
                            <Link href={route('plantillas-mensaje.create')}>
                                <PrimaryActionButton
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    }
                                >
                                    Crear Plantilla
                                </PrimaryActionButton>
                            </Link>
                        }
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
