import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { router } from '@inertiajs/react';
import { Banknote, ChartNoAxesColumnIncreasing, CircleDollarSign, Layers, PackageCheck, RadioTower, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { RecomendacionBadge } from './Components/Badges';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import MetricCard from './Components/MetricCard';
import {
    formatBOB,
    formatDecimal,
    formatNumber,
    formatPercent,
    formatSignedPercent,
    recomendacionLabels,
    riesgoLabels,
} from './Components/formatters';

const temporadaLabels = {
    invierno: 'Invierno',
    verano: 'Verano',
    otono: 'Otono',
    primavera: 'Primavera',
};

export default function Conclusiones({ conclusiones = {} }) {
    const filtrosIniciales = conclusiones.filtros ?? {};
    const [filters, setFilters] = useState({
        tipo_analisis: filtrosIniciales.tipo_analisis ?? 'meses',
        horizonte_meses: filtrosIniciales.horizonte_meses ?? 1,
        temporada: filtrosIniciales.temporada ?? 'invierno',
        cod_categoria_producto: filtrosIniciales.cod_categoria_producto ?? '',
        cod_canal_venta: filtrosIniciales.cod_canal_venta ?? '',
        nivel_riesgo_stock: filtrosIniciales.nivel_riesgo_stock ?? '',
        nivel_recomendacion: filtrosIniciales.nivel_recomendacion ?? '',
    });
    const resumen = conclusiones.resumen ?? {};
    const escenarios = conclusiones.escenarios ?? [];
    const productos = conclusiones.productos_recomendados ?? [];
    const categorias = conclusiones.categorias_recomendadas ?? [];
    const noAbastecer = conclusiones.no_abastecer ?? [];
    const temporada = conclusiones.temporada;
    const opciones = conclusiones.opciones ?? { categorias: [], canales: [] };
    const productosMonitoreo = conclusiones.productos_monitoreo ?? [];
    const totalPredicciones = conclusiones.total_predicciones ?? 0;

    const updateFilter = (key, value) => {
        const next = { ...filters, [key]: value };

        if (key === 'tipo_analisis' && value === 'meses') {
            next.temporada = filters.temporada || 'invierno';
        }

        setFilters(next);
        applyFilters(next);
    };

    const applyFilters = (next = filters) => {
        const params = Object.fromEntries(Object.entries(next).filter(([, value]) => value !== '' && value !== null && value !== undefined));
        router.get(route('inteligencia-ventas.conclusiones'), params, { preserveState: true, replace: true });
    };

    return (
        <InteligenciaVentasLayout
            title="Conclusiones de Inteligencia de Ventas"
            subtitle="Resumen ejecutivo para orientar la compra de mercaderia segun proyeccion de ventas, stock actual, rotacion, inversion requerida y temporada."
        >
            <SectionCard title="Selector de analisis">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">
                    <Select label="Tipo de analisis" value={filters.tipo_analisis} onChange={(value) => updateFilter('tipo_analisis', value)} options={[
                        { value: 'meses', label: 'Meses' },
                        { value: 'temporada', label: 'Temporada' },
                    ]} />
                    {filters.tipo_analisis === 'meses' ? (
                        <Select label="Horizonte" value={filters.horizonte_meses} onChange={(value) => updateFilter('horizonte_meses', value)} options={[
                            { value: 1, label: 'Proximo mes' },
                            { value: 2, label: 'Proximos 2 meses' },
                            { value: 3, label: 'Proximos 3 meses' },
                            { value: 4, label: 'Proximos 4 meses' },
                        ]} />
                    ) : (
                        <Select label="Temporada" value={filters.temporada} onChange={(value) => updateFilter('temporada', value)} options={Object.entries(temporadaLabels).map(([value, label]) => ({ value, label }))} />
                    )}
                    <Select label="Categoria" value={filters.cod_categoria_producto} onChange={(value) => updateFilter('cod_categoria_producto', value)} options={opciones.categorias ?? []} />
                    <Select label="Canal" value={filters.cod_canal_venta} onChange={(value) => updateFilter('cod_canal_venta', value)} options={opciones.canales ?? []} />
                    <Select label="Riesgo" value={filters.nivel_riesgo_stock} onChange={(value) => updateFilter('nivel_riesgo_stock', value)} options={optionMap(riesgoLabels)} />
                    <Select label="Recomendacion" value={filters.nivel_recomendacion} onChange={(value) => updateFilter('nivel_recomendacion', value)} options={optionMap(recomendacionLabels)} />
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => {
                                const clean = {
                                    tipo_analisis: 'meses',
                                    horizonte_meses: 1,
                                    temporada: 'invierno',
                                    cod_categoria_producto: '',
                                    cod_canal_venta: '',
                                    nivel_riesgo_stock: '',
                                    nivel_recomendacion: '',
                                };
                                setFilters(clean);
                                router.get(route('inteligencia-ventas.conclusiones'), {}, { preserveState: true, replace: true });
                            }}
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-cafe-700 hover:bg-gray-50"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            </SectionCard>

            {/* Aviso si no hay predicciones analizadas */}
            {totalPredicciones === 0 ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm mb-4">
                    <h3 className="text-base font-bold text-red-900 flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-red-700" />
                        No existen predicciones generadas
                    </h3>
                    <p className="mt-2 text-sm text-red-800">
                        No se encontraron registros de predicciones en la base de datos para los criterios seleccionados. Por favor, ejecute el analisis de Inteligencia de Ventas desde el panel principal.
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-cafe-200 bg-crema-100 p-4 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-cafe-800 font-semibold">
                    <span>Predicciones analizadas en este periodo: <strong>{totalPredicciones} productos</strong></span>
                    {resumen.unidades_sugeridas === 0 && (
                        <span className="rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-bold text-green-800">
                            Inventario suficiente (Compra no requerida)
                        </span>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard title="Inversion recomendada" value={formatBOB(resumen.inversion_recomendada)} icon={Banknote} tone="terracota" />
                <MetricCard title="Ganancia estimada" value={formatBOB(resumen.ganancia_estimada)} icon={CircleDollarSign} tone="green" />
                <MetricCard title="ROI estimado" value={formatPercent(Number(resumen.roi_estimado || 0) * 100)} icon={ChartNoAxesColumnIncreasing} tone="oliva" />
                <MetricCard title="Unidades sugeridas" value={formatNumber(resumen.unidades_sugeridas)} icon={PackageCheck} tone="amber" />
                <MetricCard title="Categoria prioritaria" value={resumen.categoria_prioritaria ?? '-'} icon={Layers} tone="cyan" />
                <MetricCard title="Riesgo general" value={resumen.riesgo_general ?? '-'} icon={ShieldAlert} tone={riskTone(resumen.riesgo_general)} />
                <MetricCard title="Canal relevante" value={resumen.canal_relevante ?? '-'} icon={RadioTower} tone="oliva" />
                <MetricCard title="Decision ejecutiva" value={resumen.unidades_sugeridas > 0 ? "Compra guiada" : "Compra controlada"} subtitle={resumen.unidades_sugeridas > 0 ? "prioridad de abastecimiento" : "monitorear stock"} icon={PackageCheck} tone="terracota" />
            </div>

            <SectionCard title="Conclusion general">
                <p className="max-w-4xl text-sm leading-6 text-cafe-700">{conclusiones.conclusion_general}</p>
            </SectionCard>

            {resumen.unidades_sugeridas > 0 ? (
                <>
                    <SectionCard title="Escenarios de inversion">
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                            {escenarios.map((escenario) => (
                                <ScenarioCard key={escenario.clave} escenario={escenario} />
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Productos recomendados" noPadding>
                        <TableWrapper className="rounded-none border-0 shadow-none">
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Categoria</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Conservadora</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Recomendada</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Agresiva</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Costo estimado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Ingreso estimado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Ganancia</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Riesgo</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Motivo</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {productos.length > 0 ? productos.map((producto) => (
                                    <TableWrapper.Row key={producto.cod_prediccion_venta}>
                                        <TableWrapper.Cell className="font-semibold text-cafe-900">{producto.producto}</TableWrapper.Cell>
                                        <TableWrapper.Cell>{producto.categoria}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatNumber(producto.cantidad_conservadora)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right" className="font-bold text-terracota-700">{formatNumber(producto.cantidad_recomendada)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatNumber(producto.cantidad_agresiva)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <div>
                                                <span>{formatBOB(producto.costo_estimado_total)}</span>
                                                {producto.costo_estimado && <p className="text-[11px] text-amber-700">Costo referencial</p>}
                                            </div>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatBOB(producto.ingreso_estimado)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatBOB(producto.ganancia_estimada)}</TableWrapper.Cell>
                                        <TableWrapper.Cell><RiskPill value={producto.riesgo} /></TableWrapper.Cell>
                                        <TableWrapper.Cell className="max-w-sm whitespace-normal">{producto.motivo ?? 'Producto con oportunidad de abastecimiento por proyeccion comercial y cobertura estimada.'}</TableWrapper.Cell>
                                    </TableWrapper.Row>
                                )) : (
                                    <TableWrapper.EmptyRow colSpan={10} message="No hay productos con recomendacion de compra para los filtros actuales." />
                                )}
                            </TableWrapper.Body>
                        </TableWrapper>
                    </SectionCard>

                    <SectionCard title="Categorias recomendadas" noPadding>
                        <TableWrapper className="rounded-none border-0 shadow-none">
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Categoria</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Unidades sugeridas</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Inversion aproximada</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Ganancia estimada</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Prioridad</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Motivo</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {categorias.length > 0 ? categorias.map((categoria) => (
                                    <TableWrapper.Row key={categoria.categoria}>
                                        <TableWrapper.Cell className="font-semibold text-cafe-900">{categoria.categoria}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatNumber(categoria.unidades_sugeridas)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatBOB(categoria.inversion_aproximada)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatBOB(categoria.ganancia_estimada)}</TableWrapper.Cell>
                                        <TableWrapper.Cell><RecomendacionBadge value={categoria.prioridad === 'Alta prioridad' ? 'alta' : 'media'} /></TableWrapper.Cell>
                                        <TableWrapper.Cell className="max-w-md whitespace-normal">{categoria.motivo}</TableWrapper.Cell>
                                    </TableWrapper.Row>
                                )) : (
                                    <TableWrapper.EmptyRow colSpan={6} message="No hay categorias recomendadas para abastecimiento." />
                                )}
                            </TableWrapper.Body>
                        </TableWrapper>
                    </SectionCard>
                </>
            ) : totalPredicciones > 0 ? (
                <>
                    {/* Escenario B: Unidades sugeridas = 0 pero existen predicciones */}
                    <div className="rounded-xl border border-green-200 bg-green-50/50 p-6 shadow-sm mb-4">
                        <h3 className="text-base font-bold text-green-950">Decision ejecutiva: Mantener compra controlada</h3>
                        <p className="mt-2 text-sm text-green-900 leading-relaxed">
                            No se recomienda compra inmediata de mercaderia. Las existencias actuales en inventario cubren la proyeccion del periodo y el stock de seguridad dinamico. Se aconseja canalizar liquidez hacia el monitoreo de los siguientes productos clave con demanda relativa destacada o tendencia creciente.
                        </p>
                    </div>

                    <SectionCard title="Productos sugeridos para monitoreo preventivo" noPadding>
                        <TableWrapper className="rounded-none border-0 shadow-none">
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Categoria</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Stock actual</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Stock seguridad</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Proyeccion ventas</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Indice demanda</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Tendencia</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado proyectado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Riesgo</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {productosMonitoreo.length > 0 ? productosMonitoreo.map((p) => {
                                    const trendVal = Number(p.tendencia_porcentual || 0);
                                    let trendClass = 'text-gray-500 font-semibold';
                                    if (trendVal > 0) trendClass = 'text-green-700 font-semibold';
                                    if (trendVal < 0) trendClass = 'text-red-700 font-semibold';

                                    return (
                                        <TableWrapper.Row key={p.producto}>
                                            <TableWrapper.Cell className="font-semibold text-cafe-900">{p.producto}</TableWrapper.Cell>
                                            <TableWrapper.Cell>{p.categoria}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right">{formatNumber(p.stock_actual)}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right">{formatNumber(p.stock_seguridad_dinamico)}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right">{formatNumber(p.ventas_estimadas_proximo_periodo)}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right">{formatDecimal(p.indice_demanda_relativa, 2)}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right" className={trendClass}>{formatSignedPercent(p.tendencia_porcentual)}</TableWrapper.Cell>
                                            <TableWrapper.Cell className="capitalize">{p.estado_demanda_predicho}</TableWrapper.Cell>
                                            <TableWrapper.Cell><RiskPill value={p.nivel_riesgo_stock ?? p.riesgo} /></TableWrapper.Cell>
                                        </TableWrapper.Row>
                                    );
                                }) : (
                                    <TableWrapper.EmptyRow colSpan={9} message="No hay productos destacados bajo monitoreo preventivo." />
                                )}
                            </TableWrapper.Body>
                        </TableWrapper>
                    </SectionCard>
                </>
            ) : null}

            <SectionCard title="No abastecer por ahora" noPadding>
                <TableWrapper className="rounded-none border-0 shadow-none">
                    <TableWrapper.Header>
                        <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Categoria</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Stock actual</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Proyeccion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Rotacion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Motivo</TableWrapper.HeaderCell>
                    </TableWrapper.Header>
                    <TableWrapper.Body>
                        {noAbastecer.length > 0 ? noAbastecer.map((producto) => (
                            <TableWrapper.Row key={`${producto.producto}-${producto.categoria}`}>
                                <TableWrapper.Cell className="font-semibold text-cafe-900">{producto.producto}</TableWrapper.Cell>
                                <TableWrapper.Cell>{producto.categoria}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(producto.stock_actual)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(producto.proyeccion)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">
                                    {Number(producto.rotacion_stock) >= 999 ? (
                                        <span
                                            className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 border-red-100 cursor-help"
                                            title="Ventas registradas sin stock disponible"
                                        >
                                            Stock agotado
                                        </span>
                                    ) : (
                                        formatDecimal(producto.rotacion_stock, 2)
                                    )}
                                </TableWrapper.Cell>
                                <TableWrapper.Cell className="max-w-md whitespace-normal">{producto.motivo}</TableWrapper.Cell>
                            </TableWrapper.Row>
                        )) : (
                            <TableWrapper.EmptyRow colSpan={6} message="No hay productos marcados para pausar abastecimiento." />
                        )}
                    </TableWrapper.Body>
                </TableWrapper>
            </SectionCard>

            {temporada && (
                <SectionCard title="Enfoque por temporada">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-oliva-50 px-3 py-1 text-sm font-bold text-oliva-800">{temporada.nombre}</span>
                            <span className="text-sm text-cafe-700">{temporada.mensaje}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FocusList title="Categorias a priorizar" items={temporada.categorias_prioritarias ?? []} />
                            <FocusList title="Productos principales" items={temporada.productos_principales ?? []} />
                        </div>
                    </div>
                </SectionCard>
            )}
        </InteligenciaVentasLayout>
    );
}

function ScenarioCard({ escenario }) {
    return (
        <article className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-cafe-900">{escenario.nombre}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Factor {formatPercent(Number(escenario.factor || 0) * 100)}</p>
                </div>
                <RiskPill value={escenario.riesgo} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <MiniMetric label="Inversion" value={formatBOB(escenario.costo_inversion)} />
                <MiniMetric label="Ingreso" value={formatBOB(escenario.ingreso_estimado)} />
                <MiniMetric label="Ganancia" value={formatBOB(escenario.ganancia_estimada)} />
                <MiniMetric label="ROI" value={formatSignedPercent(Number(escenario.roi_estimado || 0) * 100)} />
                <MiniMetric label="Unidades" value={formatNumber(escenario.unidades_sugeridas)} />
                <MiniMetric label="Margen" value={formatPercent(Number(escenario.margen_estimado || 0) * 100)} />
            </div>
            <p className="mt-4 text-sm leading-6 text-cafe-700">{escenario.motivo_resumido}</p>
            <div className="mt-4 space-y-2">
                <TagList label="Productos principales" items={escenario.productos_principales ?? []} />
                <TagList label="Categorias incluidas" items={escenario.categorias_incluidas ?? []} />
            </div>
        </article>
    );
}

function MiniMetric({ label, value }) {
    return (
        <div className="rounded-lg bg-crema-100 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 font-bold text-cafe-900">{value}</p>
        </div>
    );
}

function TagList({ label, items }) {
    if (!items?.length) return null;

    return (
        <div>
            <p className="mb-1 text-xs font-semibold text-cafe-700">{label}</p>
            <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                    <span key={item} className="rounded-full bg-oliva-50 px-2 py-1 text-xs font-semibold text-oliva-800">{item}</span>
                ))}
            </div>
        </div>
    );
}

function FocusList({ title, items }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-crema-100 p-4">
            <h4 className="text-sm font-bold text-cafe-900">{title}</h4>
            <ul className="mt-3 space-y-2">
                {items.length > 0 ? items.map((item) => (
                    <li key={item} className="text-sm text-cafe-700">- {item}</li>
                )) : (
                    <li className="text-sm text-gray-500">Sin elementos destacados para los filtros actuales.</li>
                )}
            </ul>
        </div>
    );
}

function Select({ label, value, onChange, options }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-semibold text-cafe-700">{label}</span>
            <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500">
                <option value="">Todos</option>
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </label>
    );
}

function RiskPill({ value }) {
    const tone = {
        Bajo: 'bg-green-50 text-green-700 border-green-100',
        Medio: 'bg-amber-50 text-amber-700 border-amber-100',
        Alto: 'bg-red-50 text-red-700 border-red-100',
    }[value] ?? 'bg-gray-50 text-gray-700 border-gray-100';

    return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}>{value ?? '-'}</span>;
}

function optionMap(labels) {
    return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

function riskTone(value) {
    return {
        Bajo: 'green',
        Medio: 'amber',
        Alto: 'red',
    }[value] ?? 'oliva';
}
