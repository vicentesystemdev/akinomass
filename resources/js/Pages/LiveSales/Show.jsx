import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

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

const formatBOB = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const interaccionEstadoConfig = {
    nuevo: { label: 'Nuevo', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    contactado: { label: 'Contactado', bg: 'bg-terracota-100', text: 'text-terracota-800', dot: 'bg-terracota-500' },
    convertido_lead: { label: 'Convertido Lead', bg: 'bg-oliva-100', text: 'text-oliva-800', dot: 'bg-oliva-500' },
    convertido_pedido: { label: 'Convertido Pedido', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    descartado: { label: 'Descartado', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};

const InteraccionBadge = ({ estado }) => {
    const config = interaccionEstadoConfig[estado] || { label: estado, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
    return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full px-2.5 py-1 text-xs ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
};

export default function Show({ sesion, productos, estadosInteraccion }) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [showPanel, setShowPanel] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);

    const productoForm = useForm({
        cod_producto: '',
        orden_proliv: 1,
        precio_live_proliv: '',
        observacion_proliv: '',
    });

    const interaccionForm = useForm({
        alias_int: '',
        nombre_int: '',
        telefono_int: '',
        cod_producto: '',
        intencion_compra_int: '',
        estado_int: estadosInteraccion?.[0] || 'nuevo',
    });

    const handleAgregarProducto = () => {
        productoForm.post(route('live-sales.agregar-producto', sesion.cod_sesion_live), {
            onSuccess: () => productoForm.reset(),
        });
    };

    const handleRegistrarInteraccion = () => {
        interaccionForm.post(route('live-sales.registrar-interaccion', sesion.cod_sesion_live), {
            onSuccess: () => {
                interaccionForm.reset();
                setShowPanel(false);
            },
        });
    };

    const handleCambiarEstado = (estado) => {
        router.patch(route('live-sales.cambiar-estado', sesion.cod_sesion_live), {
            estado_ses: estado,
        }, {
            onSuccess: () => setShowConfirmModal(null),
        });
    };

    const handleConvertirLead = (interaccionId) => {
        router.post(route('live-sales.convertir-lead', interaccionId), {}, {
            onSuccess: () => setShowConfirmModal(null),
        });
    };

    const handleConvertirPedido = (interaccionId) => {
        router.post(route('live-sales.convertir-pedido', interaccionId), {}, {
            onSuccess: () => setShowConfirmModal(null),
        });
    };

    const canStartLive = sesion.estado_ses === 'programada';
    const canFinish = sesion.estado_ses === 'en_vivo';
    const canCancel = sesion.estado_ses === 'programada' || sesion.estado_ses === 'en_vivo';
    const canAddInteraction = sesion.estado_ses === 'en_vivo' || sesion.estado_ses === 'programada';

    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'productos', label: `Productos (${sesion.productos_live?.length || 0})`, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { id: 'interacciones', label: `Interacciones (${sesion.interacciones_live?.length || 0})`, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    ];

    const inputClass = "w-full rounded-lg border-gray-300 text-sm py-2 px-2.5 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200";
    const labelClass = "block text-xs font-medium text-gray-500 mb-1";

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={sesion.titulo_ses}
                    subtitle={`${sesion.canal_venta?.nombre_can || 'Sin canal'} • ${formatDate(sesion.fecha_inicio_ses)}`}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Live Sales', href: route('live-sales.index') },
                        { label: sesion.titulo_ses },
                    ]}
                    actions={
                        <div className="flex items-center gap-3">
                            <StatusBadge status={sesion.estado_ses} size="lg" />
                            {sesion.estado_ses === 'en_vivo' && (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-terracota-600">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracota-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-terracota-500"></span>
                                    </span>
                                    EN VIVO
                                </span>
                            )}
                            <Link href={route('live-sales.edit', sesion.cod_sesion_live)}>
                                <SecondaryButton>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar
                                </SecondaryButton>
                            </Link>
                        </div>
                    }
                />
            }
        >
            <Head title={sesion.titulo_ses} />

            <div className="space-y-6">
                {/* Acciones de estado */}
                <SectionCard>
                    <div className="flex flex-wrap gap-3">
                        {canStartLive && (
                            <PrimaryActionButton
                                onClick={() => setShowConfirmModal('en_vivo')}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            >
                                Iniciar Live
                            </PrimaryActionButton>
                        )}
                        {canFinish && (
                            <button
                                onClick={() => setShowConfirmModal('finalizada')}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Finalizar Live
                            </button>
                        )}
                        {canCancel && (
                            <button
                                onClick={() => setShowConfirmModal('cancelada')}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancelar Sesión
                            </button>
                        )}
                        {canAddInteraction && (
                            <PrimaryActionButton
                                onClick={() => setShowPanel(true)}
                                variant="terracota"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                }
                            >
                                Registrar Interacción
                            </PrimaryActionButton>
                        )}
                    </div>
                </SectionCard>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'border-terracota-500 text-terracota-600'
                                        : 'border-transparent text-gray-500 hover:text-cafe-700 hover:border-gray-300'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab: Resumen */}
                {activeTab === 'resumen' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SectionCard title="Información de la Sesión">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Título</p>
                                    <p className="text-sm font-medium text-cafe-900 mt-0.5">{sesion.titulo_ses}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Canal</p>
                                    <p className="text-sm text-cafe-700 mt-0.5">{sesion.canal_venta?.nombre_can || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Inicio</p>
                                    <p className="text-sm text-cafe-700 mt-0.5">{formatDate(sesion.fecha_inicio_ses)}</p>
                                </div>
                                {sesion.fecha_fin_ses && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Fin</p>
                                        <p className="text-sm text-cafe-700 mt-0.5">{formatDate(sesion.fecha_fin_ses)}</p>
                                    </div>
                                )}
                                {sesion.resumen_ses && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Resumen</p>
                                        <p className="text-sm text-cafe-700 mt-0.5 whitespace-pre-wrap">{sesion.resumen_ses}</p>
                                    </div>
                                )}
                            </div>
                        </SectionCard>

                        <SectionCard title="Estadísticas">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-oliva-50 rounded-lg">
                                    <span className="text-sm text-oliva-700">Productos ofrecidos</span>
                                    <span className="text-lg font-bold text-oliva-800">{sesion.productos_live?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-terracota-50 rounded-lg">
                                    <span className="text-sm text-terracota-700">Interacciones</span>
                                    <span className="text-lg font-bold text-terracota-800">{sesion.interacciones_live?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm text-green-700">Convertidos a Lead</span>
                                    <span className="text-lg font-bold text-green-800">
                                        {sesion.interacciones_live?.filter((i) => i.estado_int === 'convertido_lead').length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                                    <span className="text-sm text-cyan-700">Convertidos a Pedido</span>
                                    <span className="text-lg font-bold text-cyan-800">
                                        {sesion.interacciones_live?.filter((i) => i.estado_int === 'convertido_pedido').length || 0}
                                    </span>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Tab: Productos */}
                {activeTab === 'productos' && (
                    <div className="space-y-6">
                        {/* Formulario agregar producto */}
                        <SectionCard title="Agregar Producto">
                            <div className="flex flex-wrap items-end gap-3">
                                <div className="flex-1 min-w-[200px]">
                                    <label className={labelClass}>Producto</label>
                                    <select
                                        value={productoForm.data.cod_producto ?? ''}
                                        onChange={(e) => productoForm.setData('cod_producto', e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="">Seleccionar producto</option>
                                        {productos.map((p) => (
                                            <option key={p.cod_producto} value={p.cod_producto}>{p.nombre_pro}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <label className={labelClass}>Orden</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={productoForm.data.orden_proliv ?? 1}
                                        onChange={(e) => productoForm.setData('orden_proliv', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="w-32">
                                    <label className={labelClass}>Precio Live</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={productoForm.data.precio_live_proliv ?? ''}
                                        onChange={(e) => productoForm.setData('precio_live_proliv', e.target.value)}
                                        className={inputClass}
                                        placeholder="Opcional"
                                    />
                                </div>
                                <PrimaryActionButton
                                    onClick={handleAgregarProducto}
                                    loading={productoForm.processing}
                                    disabled={productoForm.processing}
                                    size="sm"
                                >
                                    Agregar
                                </PrimaryActionButton>
                            </div>
                        </SectionCard>

                        {/* Lista de productos */}
                        <SectionCard noPadding>
                            {sesion.productos_live && sesion.productos_live.length > 0 ? (
                                <TableWrapper>
                                    <TableWrapper.Header>
                                        <TableWrapper.HeaderCell align="center">Orden</TableWrapper.HeaderCell>
                                        <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                        <TableWrapper.HeaderCell align="right">Precio Live</TableWrapper.HeaderCell>
                                        <TableWrapper.HeaderCell>Observación</TableWrapper.HeaderCell>
                                    </TableWrapper.Header>
                                    <TableWrapper.Body>
                                        {sesion.productos_live.map((pl) => (
                                            <TableWrapper.Row key={pl.cod_producto_live}>
                                                <TableWrapper.Cell align="center">
                                                    <span className="inline-flex items-center justify-center w-7 h-7 bg-oliva-100 text-oliva-700 rounded-full text-xs font-bold">
                                                        {pl.orden_proliv}
                                                    </span>
                                                </TableWrapper.Cell>
                                                <TableWrapper.Cell>
                                                    <p className="font-medium text-cafe-900">{pl.producto?.nombre_pro || '-'}</p>
                                                </TableWrapper.Cell>
                                                <TableWrapper.Cell align="right">
                                                    <span className="font-medium text-cafe-700">
                                                        {pl.precio_live_proliv ? formatBOB(pl.precio_live_proliv) : '-'}
                                                    </span>
                                                </TableWrapper.Cell>
                                                <TableWrapper.Cell>
                                                    <p className="text-sm text-gray-500">{pl.observacion_proliv || '-'}</p>
                                                </TableWrapper.Cell>
                                            </TableWrapper.Row>
                                        ))}
                                    </TableWrapper.Body>
                                </TableWrapper>
                            ) : (
                                <EmptyState
                                    title="No hay productos ofrecidos"
                                    description="Agrega los productos que se ofrecerán durante la sesión en vivo."
                                />
                            )}
                        </SectionCard>
                    </div>
                )}

                {/* Tab: Interacciones */}
                {activeTab === 'interacciones' && (
                    <SectionCard noPadding>
                        {sesion.interacciones_live && sesion.interacciones_live.length > 0 ? (
                            <TableWrapper>
                                <TableWrapper.Header>
                                    <TableWrapper.HeaderCell>Interesado</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell>Intención</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                                </TableWrapper.Header>
                                <TableWrapper.Body>
                                    {sesion.interacciones_live.map((inter) => (
                                        <TableWrapper.Row key={inter.cod_interaccion_live}>
                                            <TableWrapper.Cell>
                                                <div>
                                                    <p className="font-medium text-cafe-900">{inter.alias_int || inter.nombre_int || 'Sin nombre'}</p>
                                                    {inter.telefono_int && (
                                                        <p className="text-xs text-gray-500">{inter.telefono_int}</p>
                                                    )}
                                                </div>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell>
                                                <p className="text-sm text-cafe-700">{inter.producto?.nombre_pro || '-'}</p>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell>
                                                <p className="text-sm text-cafe-700">{inter.intencion_compra_int || '-'}</p>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell>
                                                <InteraccionBadge estado={inter.estado_int} />
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell align="right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {inter.estado_int === 'nuevo' && !inter.cod_lead && (
                                                        <button
                                                            onClick={() => setShowConfirmModal({ type: 'lead', id: inter.cod_interaccion_live })}
                                                            className="text-xs font-medium text-oliva-600 hover:text-oliva-700 transition-colors"
                                                        >
                                                            → Lead
                                                        </button>
                                                    )}
                                                    {inter.estado_int === 'nuevo' && !inter.cod_pedido && (
                                                        <button
                                                            onClick={() => setShowConfirmModal({ type: 'pedido', id: inter.cod_interaccion_live })}
                                                            className="text-xs font-medium text-terracota-600 hover:text-terracota-700 transition-colors"
                                                        >
                                                            → Pedido
                                                        </button>
                                                    )}
                                                    {inter.cod_lead && (
                                                        <Link
                                                            href={route('leads.edit', inter.cod_lead)}
                                                            className="text-xs font-medium text-oliva-600 hover:text-oliva-700 transition-colors"
                                                        >
                                                            Ver Lead
                                                        </Link>
                                                    )}
                                                    {inter.cod_pedido && (
                                                        <Link
                                                            href={route('pedidos.show', inter.cod_pedido)}
                                                            className="text-xs font-medium text-terracota-600 hover:text-terracota-700 transition-colors"
                                                        >
                                                            Ver Pedido
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
                                title="No hay interacciones registradas"
                                description="Las interacciones aparecerán aquí cuando se registren durante la sesión en vivo."
                            />
                        )}
                    </SectionCard>
                )}
            </div>

            {/* Panel lateral para registrar interacción */}
            {showPanel && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-cafe-950/50 transition-opacity" onClick={() => setShowPanel(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                        <div className="flex flex-col h-full">
                            {/* Header del panel */}
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-cafe-900">Registrar Interacción</h3>
                                <button
                                    onClick={() => setShowPanel(false)}
                                    className="p-2 text-gray-400 hover:text-cafe-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Formulario */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                                <div>
                                    <label className={labelClass}>Alias / Apodo</label>
                                    <input
                                        type="text"
                                        value={interaccionForm.data.alias_int ?? ''}
                                        onChange={(e) => interaccionForm.setData('alias_int', e.target.value)}
                                        className={inputClass}
                                        placeholder="Ej: @usuario_tiktok"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Nombre</label>
                                    <input
                                        type="text"
                                        value={interaccionForm.data.nombre_int ?? ''}
                                        onChange={(e) => interaccionForm.setData('nombre_int', e.target.value)}
                                        className={inputClass}
                                        placeholder="Nombre real si se conoce"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Teléfono</label>
                                    <input
                                        type="text"
                                        value={interaccionForm.data.telefono_int ?? ''}
                                        onChange={(e) => interaccionForm.setData('telefono_int', e.target.value)}
                                        className={inputClass}
                                        placeholder="Número de contacto"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Producto de Interés</label>
                                    <select
                                        value={interaccionForm.data.cod_producto ?? ''}
                                        onChange={(e) => interaccionForm.setData('cod_producto', e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="">Seleccionar producto</option>
                                        {productos.map((p) => (
                                            <option key={p.cod_producto} value={p.cod_producto}>{p.nombre_pro}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Intención de Compra</label>
                                    <input
                                        type="text"
                                        value={interaccionForm.data.intencion_compra_int ?? ''}
                                        onChange={(e) => interaccionForm.setData('intencion_compra_int', e.target.value)}
                                        className={inputClass}
                                        placeholder="Ej: Quiere 2 remeras talla M"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Estado</label>
                                    <select
                                        value={interaccionForm.data.estado_int ?? ''}
                                        onChange={(e) => interaccionForm.setData('estado_int', e.target.value)}
                                        className={inputClass}
                                    >
                                        {estadosInteraccion.map((e) => (
                                            <option key={e} value={e}>{interaccionEstadoConfig[e]?.label || e}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Footer del panel */}
                            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                                <SecondaryButton onClick={() => setShowPanel(false)} className="flex-1">
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryActionButton
                                    onClick={handleRegistrarInteraccion}
                                    loading={interaccionForm.processing}
                                    disabled={interaccionForm.processing}
                                    className="flex-1"
                                >
                                    Registrar
                                </PrimaryActionButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modales de confirmación */}
            {showConfirmModal && typeof showConfirmModal === 'string' && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-cafe-950/50 transition-opacity" onClick={() => setShowConfirmModal(null)} />
                        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                                    showConfirmModal === 'en_vivo' ? 'bg-terracota-100' :
                                    showConfirmModal === 'finalizada' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                    <svg className={`h-6 w-6 ${
                                        showConfirmModal === 'en_vivo' ? 'text-terracota-600' :
                                        showConfirmModal === 'finalizada' ? 'text-green-600' : 'text-red-600'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showConfirmModal === 'en_vivo' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />}
                                        {showConfirmModal === 'finalizada' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />}
                                        {showConfirmModal === 'cancelada' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />}
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">
                                        {showConfirmModal === 'en_vivo' && 'Iniciar Sesión en Vivo'}
                                        {showConfirmModal === 'finalizada' && 'Finalizar Sesión'}
                                        {showConfirmModal === 'cancelada' && 'Cancelar Sesión'}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {showConfirmModal === 'en_vivo' && '¿Estás seguro de iniciar esta sesión en vivo?'}
                                            {showConfirmModal === 'finalizada' && '¿Estás seguro de finalizar esta sesión? No se podrán registrar más interacciones.'}
                                            {showConfirmModal === 'cancelada' && '¿Estás seguro de cancelar esta sesión? Esta acción no se puede deshacer.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    onClick={() => handleCambiarEstado(showConfirmModal)}
                                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 ${
                                        showConfirmModal === 'en_vivo' ? 'bg-terracota-500 hover:bg-terracota-600' :
                                        showConfirmModal === 'finalizada' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    Confirmar
                                </button>
                                <SecondaryButton onClick={() => setShowConfirmModal(null)}>
                                    Cancelar
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal convertir a Lead */}
            {showConfirmModal?.type === 'lead' && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-cafe-950/50 transition-opacity" onClick={() => setShowConfirmModal(null)} />
                        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-oliva-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-oliva-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">Convertir a Lead</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Convertir esta interacción en un lead? Se creará un nuevo registro de lead con los datos del interesado.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <PrimaryActionButton onClick={() => handleConvertirLead(showConfirmModal.id)}>
                                    Sí, Convertir a Lead
                                </PrimaryActionButton>
                                <SecondaryButton onClick={() => setShowConfirmModal(null)}>
                                    Cancelar
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal convertir a Pedido */}
            {showConfirmModal?.type === 'pedido' && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-cafe-950/50 transition-opacity" onClick={() => setShowConfirmModal(null)} />
                        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-terracota-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-terracota-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-cafe-900">Convertir a Pedido</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Convertir esta interacción en un pedido? Se creará un nuevo pedido en estado borrador.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <PrimaryActionButton onClick={() => handleConvertirPedido(showConfirmModal.id)}>
                                    Sí, Convertir a Pedido
                                </PrimaryActionButton>
                                <SecondaryButton onClick={() => setShowConfirmModal(null)}>
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
