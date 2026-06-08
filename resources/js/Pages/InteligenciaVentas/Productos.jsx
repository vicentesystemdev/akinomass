import AreaTrendChart from '@/Components/Charts/AreaTrendChart';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
    const [filters, setFilters] = useState({
        cod_categoria_producto: filtros.cod_categoria_producto ?? '',
        cod_canal_venta: filtros.cod_canal_venta ?? '',
        nivel_riesgo_stock: filtros.nivel_riesgo_stock ?? '',
        nivel_recomendacion: filtros.nivel_recomendacion ?? '',
        periodo_inicio: filtros.periodo_inicio ?? '',
        periodo_fin: filtros.periodo_fin ?? '',
    });
    const selected = items[0];
    const trendData = selected ? [
        { periodo: '90 dias', ventas: Number(selected.ventas_ultimos_90_dias || 0) },
        { periodo: '30 dias', ventas: Number(selected.ventas_ultimos_30_dias || 0) },
        { periodo: 'Proyeccion', ventas: Number(selected.ventas_estimadas_proximo_periodo || 0) },
    ] : [];
    const options = useMemo(() => ({
        categorias: uniqueOptions(items, 'cod_categoria_producto', categoriaNombre),
        canales: uniqueOptions(items, 'cod_canal_venta', canalNombre),
    }), [items]);

    const updateFilter = (key, value) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        applyFilters(next);
    };

    const applyFilters = (next = filters) => {
        const params = Object.fromEntries(Object.entries(next).filter(([, value]) => value !== '' && value !== null && value !== undefined));
        router.get(route('inteligencia-ventas.productos'), params, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        const next = {
            cod_categoria_producto: '',
            cod_canal_venta: '',
            nivel_riesgo_stock: '',
            nivel_recomendacion: '',
            periodo_inicio: '',
            periodo_fin: '',
        };
        setFilters(next);
        router.get(route('inteligencia-ventas.productos'), {}, { preserveState: true, replace: true });
    };

    return (
        <InteligenciaVentasLayout
            title="Prediccion por Productos"
            subtitle="Lectura detallada por producto, variante, tendencia comercial y cobertura estimada"
        >
            <SectionCard title="Filtros de analisis">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
                    <Select label="Categoria" value={filters.cod_categoria_producto} onChange={(value) => updateFilter('cod_categoria_producto', value)} options={options.categorias} />
                    <Select label="Canal" value={filters.cod_canal_venta} onChange={(value) => updateFilter('cod_canal_venta', value)} options={options.canales} />
                    <Select label="Riesgo" value={filters.nivel_riesgo_stock} onChange={(value) => updateFilter('nivel_riesgo_stock', value)} options={optionMap(riesgoLabels)} />
                    <Select label="Recomendacion" value={filters.nivel_recomendacion} onChange={(value) => updateFilter('nivel_recomendacion', value)} options={optionMap(recomendacionLabels)} />
                    <Field label="Desde" type="date" value={filters.periodo_inicio} onChange={(value) => updateFilter('periodo_inicio', value)} />
                    <Field label="Hasta" type="date" value={filters.periodo_fin} onChange={(value) => updateFilter('periodo_fin', value)} />
                </div>
                <div className="mt-4 flex justify-end">
                    <button type="button" onClick={clearFilters} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-cafe-700 hover:bg-gray-50">
                        Limpiar filtros
                    </button>
                </div>
            </SectionCard>

            <SectionCard title={selected ? `Tendencia comercial: ${productoNombre(selected)}` : 'Tendencia comercial'}>
                <AreaTrendChart data={trendData} dataKey="ventas" labelKey="periodo" height={260} formatValue={formatNumber} />
            </SectionCard>

            <SectionCard title="Detalle por producto" noPadding>
                <TableWrapper className="rounded-none border-0 shadow-none">
                    <TableWrapper.Header>
                        <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Categoria</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Variante/talla</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Ventas 30 dias</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Promedio</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Tendencia</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Indice</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
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
                        {items.length > 0 ? items.map((item) => (
                            <TableWrapper.Row key={item.cod_prediccion_venta}>
                                <TableWrapper.Cell className="font-semibold text-cafe-900">{productoNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{categoriaNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{varianteNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.ventas_ultimos_30_dias)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatDecimal(item.promedio_ventas_periodo, 1)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right" className={Number(item.tendencia_porcentual || 0) >= 0 ? 'text-green-700' : 'text-red-700'}>{formatSignedPercent(item.tendencia_porcentual)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatDecimal(item.indice_demanda_relativa, 2)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{labelOf(item.estado_demanda_predicho, demandaLabels)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatPercent(Number(item.probabilidad_alta || 0) * 100)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.ventas_estimadas_proximo_periodo)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{formatNumber(item.rango_estimado_minimo)} - {formatNumber(item.rango_estimado_maximo)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.stock_actual)}</TableWrapper.Cell>
                                <TableWrapper.Cell><CoverageBar value={item.ratio_cobertura} /></TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatDecimal(item.rotacion_stock, 2)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{item.canal_dominante ?? canalNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatBOB(item.ingreso_estimado)}</TableWrapper.Cell>
                                <TableWrapper.Cell><ConfidenceBadge value={item.nivel_confianza} /></TableWrapper.Cell>
                                <TableWrapper.Cell><RiesgoBadge value={item.nivel_riesgo_stock} /></TableWrapper.Cell>
                                <TableWrapper.Cell><RecomendacionBadge value={item.nivel_recomendacion} /></TableWrapper.Cell>
                            </TableWrapper.Row>
                        )) : (
                            <TableWrapper.EmptyRow colSpan={19} message="No hay productos proyectados con los filtros actuales." />
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
