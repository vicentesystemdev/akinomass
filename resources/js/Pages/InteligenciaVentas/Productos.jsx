import AreaTrendChart from '@/Components/Charts/AreaTrendChart';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import { ConfidenceBadge, RecomendacionBadge, RiesgoBadge } from './Components/Badges';
import CoverageBar from './Components/CoverageBar';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import {
    canalNombre,
    categoriaNombre,
    demandaLabels,
    formatBOB,
    formatDecimal,
    formatNumber,
    formatPercent,
    formatSignedPercent,
    labelOf,
    productoNombre,
    recomendacionLabels,
    riesgoLabels,
    valueOf,
    varianteNombre,
} from './Components/formatters';

export default function Productos({ predicciones = [], filtros = {} }) {
    const items = predicciones?.data ?? predicciones ?? [];

    // 1. Obtener filtros y ordenamiento actuales de la URL
    const searchParams = useMemo(() => {
        if (typeof window === 'undefined') return new URLSearchParams();
        return new URLSearchParams(window.location.search);
    }, [predicciones]);

    const searchVal = searchParams.get('search') ?? '';
    const estadoDemandaVal = searchParams.get('estado_demanda') ?? '';
    const tendenciaTipoVal = searchParams.get('tendencia_tipo') ?? '';
    const ventas30DiasVal = searchParams.get('ventas_30_dias') ?? '';
    const sortByVal = searchParams.get('sort_by') ?? 'indice';
    const sortDirVal = searchParams.get('sort_dir') ?? 'desc';
    const rowsVal = searchParams.get('rows') ?? '25';

    // Estado local para búsqueda reactiva (evita retraso al escribir)
    const [localSearch, setLocalSearch] = useState(searchVal);

    useEffect(() => {
        setLocalSearch(searchVal);
    }, [searchVal]);

    // Estado de filtros del backend
    const [filters, setFilters] = useState({
        cod_categoria_producto: filtros.cod_categoria_producto ?? '',
        cod_canal_venta: filtros.cod_canal_venta ?? '',
        nivel_riesgo_stock: filtros.nivel_riesgo_stock ?? '',
        nivel_recomendacion: filtros.nivel_recomendacion ?? '',
        periodo_inicio: filtros.periodo_inicio ?? '',
        periodo_fin: filtros.periodo_fin ?? '',
    });

    // 2. Lógica de combinación de filtros y recarga vía Inertia
    const applyFilterChange = (key, value) => {
        const currentParams = Object.fromEntries(new URLSearchParams(window.location.search));
        const merged = {
            ...currentParams,
            [key]: value
        };

        if (filters.hasOwnProperty(key)) {
            setFilters(prev => ({ ...prev, [key]: value }));
        }

        const params = Object.fromEntries(
            Object.entries(merged).filter(([, val]) => val !== '' && val !== null && val !== undefined)
        );

        router.get(route('inteligencia-ventas.productos'), params, { preserveState: true, replace: true, preserveScroll: true });
    };

    const applyMultipleChanges = (changes) => {
        const currentParams = Object.fromEntries(new URLSearchParams(window.location.search));
        const merged = {
            ...currentParams,
            ...changes
        };
        const params = Object.fromEntries(
            Object.entries(merged).filter(([, val]) => val !== '' && val !== null && val !== undefined)
        );
        router.get(route('inteligencia-ventas.productos'), params, { preserveState: true, replace: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setFilters({
            cod_categoria_producto: '',
            cod_canal_venta: '',
            nivel_riesgo_stock: '',
            nivel_recomendacion: '',
            periodo_inicio: '',
            periodo_fin: '',
        });
        setLocalSearch('');
        router.get(route('inteligencia-ventas.productos'), {}, { preserveState: true, replace: true });
    };

    // 3. Filtrado y ordenamiento en cliente (frontend)
    const processedItems = useMemo(() => {
        let result = [...items];

        // Filtro búsqueda: producto o SKU
        if (searchVal) {
            const query = searchVal.toLowerCase();
            result = result.filter(item => {
                const name = (item.producto?.nombre_pro || '').toLowerCase();
                const sku = (item.producto?.sku_pro || '').toLowerCase();
                const varSku = (item.variante?.sku_variante_producto || '').toLowerCase();
                return name.includes(query) || sku.includes(query) || varSku.includes(query);
            });
        }

        // Filtro estado demanda
        if (estadoDemandaVal) {
            result = result.filter(item => item.estado_demanda_predicho === estadoDemandaVal);
        }

        // Filtro tendencia
        if (tendenciaTipoVal) {
            result = result.filter(item => {
                const trend = Number(item.tendencia_porcentual || 0);
                if (tendenciaTipoVal === 'creciente') return trend > 0;
                if (tendenciaTipoVal === 'decreciente') return trend < 0;
                if (tendenciaTipoVal === 'estable') return trend === 0;
                return true;
            });
        }

        // Filtro ventas 30 días
        if (ventas30DiasVal) {
            result = result.filter(item => {
                const sales = Number(item.ventas_ultimos_30_dias || 0);
                if (ventas30DiasVal === 'con_ventas') return sales > 0;
                if (ventas30DiasVal === 'sin_ventas') return sales === 0;
                return true;
            });
        }

        // Ordenamiento
        result.sort((a, b) => {
            let valA, valB;
            switch (sortByVal) {
                case 'producto':
                    valA = (a.producto?.nombre_pro || '').toLowerCase();
                    valB = (b.producto?.nombre_pro || '').toLowerCase();
                    break;
                case 'categoria':
                    valA = (a.categoria?.nombre_cat || '').toLowerCase();
                    valB = (b.categoria?.nombre_cat || '').toLowerCase();
                    break;
                case 'ventas_30_dias':
                    valA = Number(a.ventas_ultimos_30_dias || 0);
                    valB = Number(b.ventas_ultimos_30_dias || 0);
                    break;
                case 'promedio':
                    valA = Number(a.promedio_ventas_periodo || 0);
                    valB = Number(b.promedio_ventas_periodo || 0);
                    break;
                case 'tendencia':
                    valA = Number(a.tendencia_porcentual || 0);
                    valB = Number(b.tendencia_porcentual || 0);
                    break;
                case 'indice':
                    valA = Number(a.indice_demanda_relativa || 0);
                    valB = Number(b.indice_demanda_relativa || 0);
                    break;
                case 'estado':
                    valA = (a.estado_demanda_predicho || '').toLowerCase();
                    valB = (b.estado_demanda_predicho || '').toLowerCase();
                    break;
                default:
                    valA = Number(a.indice_demanda_relativa || 0);
                    valB = Number(b.indice_demanda_relativa || 0);
            }

            if (valA < valB) return sortDirVal === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirVal === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [items, searchVal, estadoDemandaVal, tendenciaTipoVal, ventas30DiasVal, sortByVal, sortDirVal]);

    // Paginación local
    const paginatedItems = useMemo(() => {
        if (rowsVal === 'all') return processedItems;
        return processedItems.slice(0, Number(rowsVal));
    }, [processedItems, rowsVal]);

    // Gráfico de tendencias del primer producto de la lista resultante
    const selected = paginatedItems[0];
    const trendData = selected ? [
        { periodo: '90 dias', ventas: Number(selected.ventas_ultimos_90_dias || 0) },
        { periodo: '30 dias', ventas: Number(selected.ventas_ultimos_30_dias || 0) },
        { periodo: 'Proyeccion', ventas: Number(selected.ventas_estimadas_proximo_periodo || 0) },
    ] : [];

    const options = useMemo(() => ({
        categorias: uniqueOptions(items, 'cod_categoria_producto', categoriaNombre),
        canales: uniqueOptions(items, 'cod_canal_venta', canalNombre),
    }), [items]);

    // Componente de Cabecera Ordenable
    const SortableHeaderCell = ({ field, children, align }) => {
        const isCurrent = sortByVal === field;
        const handleClick = () => {
            let nextDir = 'asc';
            if (isCurrent) {
                nextDir = sortDirVal === 'asc' ? 'desc' : 'asc';
            }
            applyMultipleChanges({ sort_by: field, sort_dir: nextDir });
        };

        return (
            <TableWrapper.HeaderCell
                align={align}
                className="cursor-pointer select-none hover:bg-cafe-50 group"
                onClick={handleClick}
            >
                <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : ''}`}>
                    <span className="group-hover:text-terracota-600 transition-colors">{children}</span>
                    <span className="text-cafe-400 text-xs font-bold font-mono">
                        {isCurrent ? (sortDirVal === 'asc' ? ' ↑' : ' ↓') : ''}
                    </span>
                </div>
            </TableWrapper.HeaderCell>
        );
    };

    return (
        <InteligenciaVentasLayout
            title="Prediccion por Productos"
            subtitle="Lectura detallada por producto, variante, tendencia comercial y cobertura estimada"
        >
            <SectionCard title="Filtros de analisis">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {/* Fila 1: Búsqueda, Categoría, Canal, Riesgo, Recomendación */}
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-cafe-700">Buscar producto o SKU</span>
                        <input
                            type="text"
                            placeholder="Ej: jean cargo..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onBlur={() => applyFilterChange('search', localSearch)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilterChange('search', localSearch)}
                            className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500"
                        />
                    </label>

                    <Select label="Categoria" value={filters.cod_categoria_producto} onChange={(value) => applyFilterChange('cod_categoria_producto', value)} options={options.categorias} />
                    <Select label="Canal" value={filters.cod_canal_venta} onChange={(value) => applyFilterChange('cod_canal_venta', value)} options={options.canales} />
                    <Select label="Riesgo" value={filters.nivel_riesgo_stock} onChange={(value) => applyFilterChange('nivel_riesgo_stock', value)} options={optionMap(riesgoLabels)} />
                    <Select label="Recomendacion" value={filters.nivel_recomendacion} onChange={(value) => applyFilterChange('nivel_recomendacion', value)} options={optionMap(recomendacionLabels)} />

                    {/* Fila 2: Estado demanda, Tendencia tipo, Ventas 30d, Registros, Fechas */}
                    <Select
                        label="Demanda"
                        value={estadoDemandaVal}
                        onChange={(value) => applyFilterChange('estado_demanda', value)}
                        options={optionMap(demandaLabels)}
                    />

                    <Select
                        label="Tendencia"
                        value={tendenciaTipoVal}
                        onChange={(value) => applyFilterChange('tendencia_tipo', value)}
                        options={[
                            { value: 'creciente', label: 'Creciente' },
                            { value: 'decreciente', label: 'Decreciente' },
                            { value: 'estable', label: 'Estable' },
                        ]}
                    />

                    <Select
                        label="Ventas 30 dias"
                        value={ventas30DiasVal}
                        onChange={(value) => applyFilterChange('ventas_30_dias', value)}
                        options={[
                            { value: 'con_ventas', label: 'Con ventas' },
                            { value: 'sin_ventas', label: 'Sin ventas' },
                        ]}
                    />

                    <Select
                        label="Registros"
                        value={rowsVal}
                        onChange={(value) => applyFilterChange('rows', value)}
                        options={[
                            { value: '25', label: '25' },
                            { value: '50', label: '50' },
                            { value: '100', label: '100' },
                            { value: 'all', label: 'Todos' },
                        ]}
                    />

                    <Field label="Desde" type="date" value={filters.periodo_inicio} onChange={(value) => applyFilterChange('periodo_inicio', value)} />
                    <Field label="Hasta" type="date" value={filters.periodo_fin} onChange={(value) => applyFilterChange('periodo_fin', value)} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-cafe-500 font-semibold">
                        Mostrando {paginatedItems.length} de {processedItems.length} productos filtrados (Total: {items.length})
                    </span>
                    <button type="button" onClick={clearFilters} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-cafe-700 hover:bg-gray-50 active:scale-95 transition-all">
                        Limpiar filtros
                    </button>
                </div>
            </SectionCard>

            <SectionCard title={selected ? `Tendencia comercial: ${productoNombre(selected)}` : 'Tendencia comercial'}>
                <AreaTrendChart data={trendData} dataKey="ventas" labelKey="periodo" height={260} formatValue={formatNumber} />
            </SectionCard>

            <SectionCard title="Detalle por producto" noPadding>
                <TableWrapper className="rounded-none border-0 shadow-none overflow-x-auto">
                    <TableWrapper.Header>
                        <SortableHeaderCell field="producto">Producto</SortableHeaderCell>
                        <SortableHeaderCell field="categoria">Categoria</SortableHeaderCell>
                        <TableWrapper.HeaderCell>Variante/talla</TableWrapper.HeaderCell>
                        <SortableHeaderCell field="ventas_30_dias" align="right">Ventas 30 dias</SortableHeaderCell>
                        <SortableHeaderCell field="promedio" align="right">Promedio</SortableHeaderCell>
                        <SortableHeaderCell field="tendencia" align="right">Tendencia</SortableHeaderCell>
                        <SortableHeaderCell field="indice" align="right">Indice</SortableHeaderCell>
                        <SortableHeaderCell field="estado">Estado</SortableHeaderCell>
                        <TableWrapper.HeaderCell align="right">Prob. alta</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Proyeccion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Rango</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Stock</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Cobertura</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Rotacion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Canal dominante</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Ingreso</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Confianza</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Riesgo</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Recomendacion</TableWrapper.HeaderCell>
                    </TableWrapper.Header>
                    <TableWrapper.Body>
                        {paginatedItems.length > 0 ? paginatedItems.map((item) => {
                            const trendValue = Number(item.tendencia_porcentual || 0);
                            let trendClass = 'text-gray-500 font-semibold';
                            if (trendValue > 0) trendClass = 'text-green-700 font-semibold';
                            if (trendValue < 0) trendClass = 'text-red-700 font-semibold';

                            return (
                                <TableWrapper.Row key={item.cod_prediccion_venta}>
                                    <TableWrapper.Cell className="font-semibold text-cafe-900">{productoNombre(item)}</TableWrapper.Cell>
                                    <TableWrapper.Cell>{categoriaNombre(item)}</TableWrapper.Cell>
                                    <TableWrapper.Cell>{varianteNombre(item)}</TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">{formatNumber(item.ventas_ultimos_30_dias)}</TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">{formatDecimal(item.promedio_ventas_periodo, 1)}</TableWrapper.Cell>
                                    <TableWrapper.Cell align="right" className={trendClass}>{formatSignedPercent(item.tendencia_porcentual)}</TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">{formatDecimal(item.indice_demanda_relativa, 2)}</TableWrapper.Cell>
                                    <TableWrapper.Cell>{labelOf(item.estado_demanda_predicho, demandaLabels)}</TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">{formatPercent(Number(item.probabilidad_alta || 0) * 100)}</TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">{formatNumber(item.ventas_estimadas_proximo_periodo)}</TableWrapper.Cell>
                                    <TableWrapper.Cell>{formatNumber(item.rango_estimado_minimo)} - {formatNumber(item.rango_estimado_maximo)}</TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">{formatNumber(item.stock_actual)}</TableWrapper.Cell>
                                    <TableWrapper.Cell><CoverageBar value={item.ratio_cobertura} /></TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">
                                        {Number(item.rotacion_stock) >= 999 ? (
                                            <span
                                                className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 border-red-100 cursor-help"
                                                title="Ventas registradas sin stock disponible"
                                            >
                                                Stock agotado
                                            </span>
                                        ) : (
                                            formatDecimal(item.rotacion_stock, 2)
                                        )}
                                    </TableWrapper.Cell>
                                    <TableWrapper.Cell>{item.canal_dominante ?? canalNombre(item)}</TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">{formatBOB(item.ingreso_estimado)}</TableWrapper.Cell>
                                    <TableWrapper.Cell><ConfidenceBadge value={item.nivel_confianza} /></TableWrapper.Cell>
                                    <TableWrapper.Cell><RiesgoBadge value={item.nivel_riesgo_stock} /></TableWrapper.Cell>
                                    <TableWrapper.Cell><RecomendacionBadge value={item.nivel_recomendacion} /></TableWrapper.Cell>
                                </TableWrapper.Row>
                            );
                        }) : (
                            <TableWrapper.EmptyRow colSpan={19} message="No se encontraron productos con los filtros seleccionados." />
                        )}
                    </TableWrapper.Body>
                </TableWrapper>
            </SectionCard>
        </InteligenciaVentasLayout>
    );
}

function Select({ label, value, onChange, options }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-semibold text-cafe-700">{label}</span>
            <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500">
                <option value="">Todos</option>
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </label>
    );
}

function Field({ label, type, value, onChange }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-semibold text-cafe-700">{label}</span>
            <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500" />
        </label>
    );
}

function uniqueOptions(items, valueKey, labelGetter) {
    const map = new Map();
    items.forEach((item) => {
        const value = item[valueKey];
        if (value) map.set(String(value), labelGetter(item));
    });

    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
}

function optionMap(labels) {
    return Object.entries(labels).map(([value, label]) => ({ value, label }));
}
