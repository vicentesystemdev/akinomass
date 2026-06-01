import { useCallback, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';

const PRESETS = [
    { id: '7d', label: '7 días' },
    { id: '30d', label: '30 días' },
    { id: 'month', label: 'Este mes' },
    { id: 'prev_month', label: 'Mes anterior' },
];

function toInputDate(d) {
    return d.toISOString().slice(0, 10);
}

function getPresetRange(presetId) {
    const today = new Date();
    const end = toInputDate(today);

    if (presetId === '7d') {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return { fecha_inicio: toInputDate(start), fecha_fin: end };
    }
    if (presetId === '30d') {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        return { fecha_inicio: toInputDate(start), fecha_fin: end };
    }
    if (presetId === 'month') {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        return { fecha_inicio: toInputDate(start), fecha_fin: end };
    }
    if (presetId === 'prev_month') {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const fin = new Date(today.getFullYear(), today.getMonth(), 0);
        return { fecha_inicio: toInputDate(start), fecha_fin: toInputDate(fin) };
    }
    return null;
}

const estadoPedidoOptions = ['borrador', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado', 'devuelto'];
const estadoPagoOptions = ['pendiente', 'pagado', 'observado', 'rechazado', 'reembolsado'];
const estadoLeadOptions = ['nuevo', 'contactado', 'interesado', 'pendiente_pago', 'convertido', 'perdido', 'descartado'];

const labelClass = 'block text-xs font-semibold text-cafe-600 mb-1.5';
const inputClass =
    'w-full rounded-xl border-gray-200 bg-white shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-800 transition-all';

export default function ReportFilterBar({ initialFilters, opcionesFiltros, onApplying }) {
    const [filters, setFilters] = useState(initialFilters);
    const [expanded, setExpanded] = useState(true);
    const [activePreset, setActivePreset] = useState(null);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const activeChips = [
        filters.fecha_inicio && { key: 'desde', label: `Desde ${filters.fecha_inicio}` },
        filters.fecha_fin && { key: 'hasta', label: `Hasta ${filters.fecha_fin}` },
        filters.estado_pedido && { key: 'ep', label: `Pedido: ${filters.estado_pedido}` },
        filters.estado_pago && { key: 'epa', label: `Pago: ${filters.estado_pago}` },
        filters.estado_lead && { key: 'el', label: `Lead: ${filters.estado_lead}` },
        filters.cod_canal_venta && {
            key: 'canal',
            label: `Canal: ${opcionesFiltros?.canales_venta?.find((c) => String(c.cod_canal_venta) === String(filters.cod_canal_venta))?.nombre_can || filters.cod_canal_venta}`,
        },
        filters.cod_tipo_flujo_comercial && {
            key: 'flujo',
            label: `Flujo: ${opcionesFiltros?.tipos_flujo_comercial?.find((t) => String(t.cod_tipo_flujo_comercial) === String(filters.cod_tipo_flujo_comercial))?.nombre_tip || filters.cod_tipo_flujo_comercial}`,
        },
    ].filter(Boolean);

    const applyFilters = useCallback(
        (nextFilters) => {
            onApplying?.(true);
            router.get(route('reportes.index'), nextFilters, {
                preserveState: true,
                preserveScroll: true,
                only: ['reportes'],
                onFinish: () => onApplying?.(false),
            });
        },
        [onApplying],
    );

    const handleApply = () => applyFilters(filters);

    const handleClear = () => {
        const empty = {
            fecha_inicio: '',
            fecha_fin: '',
            estado_pedido: '',
            estado_pago: '',
            estado_lead: '',
            cod_canal_venta: '',
            cod_tipo_flujo_comercial: '',
        };
        setFilters(empty);
        setActivePreset(null);
        applyFilters(empty);
    };

    const handlePreset = (presetId) => {
        const range = getPresetRange(presetId);
        if (!range) return;
        setActivePreset(presetId);
        const next = { ...filters, ...range };
        setFilters(next);
        applyFilters(next);
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-cafe-50 to-white px-5 py-4">
                <div>
                    <h3 className="text-sm font-bold text-cafe-900">Filtros del reporte</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Ajusta el período y criterios; los gráficos se actualizan al aplicar</p>
                </div>
                <button
                    type="button"
                    onClick={() => setExpanded((e) => !e)}
                    className="text-xs font-medium text-terracota-600 hover:text-terracota-700"
                >
                    {expanded ? 'Ocultar' : 'Mostrar filtros'}
                </button>
            </div>

            {expanded && (
                <div className="p-5 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-medium text-gray-500 self-center mr-1">Período rápido:</span>
                        {PRESETS.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => handlePreset(p.id)}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                                    activePreset === p.id
                                        ? 'bg-terracota-500 text-white shadow-sm'
                                        : 'bg-gray-100 text-cafe-700 hover:bg-terracota-50 hover:text-terracota-700'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className={labelClass}>Fecha inicio</label>
                            <input
                                type="date"
                                value={filters.fecha_inicio}
                                onChange={(e) => {
                                    setActivePreset(null);
                                    setFilters((prev) => ({ ...prev, fecha_inicio: e.target.value }));
                                }}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Fecha fin</label>
                            <input
                                type="date"
                                value={filters.fecha_fin}
                                onChange={(e) => {
                                    setActivePreset(null);
                                    setFilters((prev) => ({ ...prev, fecha_fin: e.target.value }));
                                }}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Estado pedido</label>
                            <select
                                value={filters.estado_pedido}
                                onChange={(e) => setFilters((p) => ({ ...p, estado_pedido: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos</option>
                                {estadoPedidoOptions.map((e) => (
                                    <option key={e} value={e}>
                                        {e.charAt(0).toUpperCase() + e.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Estado pago</label>
                            <select
                                value={filters.estado_pago}
                                onChange={(e) => setFilters((p) => ({ ...p, estado_pago: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos</option>
                                {estadoPagoOptions.map((e) => (
                                    <option key={e} value={e}>
                                        {e.charAt(0).toUpperCase() + e.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Estado lead</label>
                            <select
                                value={filters.estado_lead}
                                onChange={(e) => setFilters((p) => ({ ...p, estado_lead: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos</option>
                                {estadoLeadOptions.map((e) => (
                                    <option key={e} value={e}>
                                        {e.charAt(0).toUpperCase() + e.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Canal de venta</label>
                            <select
                                value={filters.cod_canal_venta}
                                onChange={(e) => setFilters((p) => ({ ...p, cod_canal_venta: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos los canales</option>
                                {(opcionesFiltros?.canales_venta || []).map((c) => (
                                    <option key={c.cod_canal_venta} value={c.cod_canal_venta}>
                                        {c.nombre_can}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Tipo de flujo</label>
                            <select
                                value={filters.cod_tipo_flujo_comercial}
                                onChange={(e) => setFilters((p) => ({ ...p, cod_tipo_flujo_comercial: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos los flujos</option>
                                {(opcionesFiltros?.tipos_flujo_comercial || []).map((t) => (
                                    <option key={t.cod_tipo_flujo_comercial} value={t.cod_tipo_flujo_comercial}>
                                        {t.nombre_tip}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                            <PrimaryActionButton onClick={handleApply} size="sm" className="flex-1 justify-center">
                                Aplicar filtros
                            </PrimaryActionButton>
                            <SecondaryButton onClick={handleClear} className="px-3" title="Limpiar filtros">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </SecondaryButton>
                        </div>
                    </div>

                    {activeChips.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {activeChips.map((chip) => (
                                <span
                                    key={chip.key}
                                    className="inline-flex items-center rounded-full bg-oliva-50 border border-oliva-200 px-2.5 py-1 text-xs font-medium text-oliva-800"
                                >
                                    {chip.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
