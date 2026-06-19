import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { router } from '@inertiajs/react';
import { Activity, BadgeCheck, Calculator, PackageOpen, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import MetricCard from './Components/MetricCard';
import { formatBOB, formatDecimal, formatNumber, formatSignedPercent } from './Components/formatters';

export default function TendenciasRegresion({ tendencia = {} }) {
    const filtrosIniciales = tendencia.filtros ?? {};
    const opciones = tendencia.opciones ?? {};
    const [filtros, setFiltros] = useState({
        periodicidad: filtrosIniciales.periodicidad ?? 'mensual',
        metrica: filtrosIniciales.metrica ?? 'monto',
        periodo_inicio: filtrosIniciales.periodo_inicio ?? '',
        periodo_fin: filtrosIniciales.periodo_fin ?? '',
        cod_categoria_producto: filtrosIniciales.cod_categoria_producto ?? '',
        cod_producto: filtrosIniciales.cod_producto ?? '',
        cod_canal_venta: filtrosIniciales.cod_canal_venta ?? '',
    });
    const productos = useMemo(() => {
        if (!filtros.cod_categoria_producto) return opciones.productos ?? [];
        return (opciones.productos ?? []).filter(
            (producto) => String(producto.cod_categoria_producto) === String(filtros.cod_categoria_producto),
        );
    }, [filtros.cod_categoria_producto, opciones.productos]);
    const esMonto = filtros.metrica === 'monto';
    const formatValue = esMonto ? formatBOB : formatNumber;
    const TrendIcon = tendencia.direccion_tendencia === 'Decreciente' ? TrendingDown : TrendingUp;

    const aplicar = (event) => {
        event.preventDefault();
        const params = Object.fromEntries(Object.entries(filtros).filter(([, value]) => value !== ''));
        router.get(route('inteligencia-ventas.tendencias-regresion'), params, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <InteligenciaVentasLayout
            title="Tendencias por Regresión Lineal"
            subtitle="Proyección temporal de ventas históricas para apoyar decisiones de compra de mercadería"
        >
            <SectionCard title="Filtros del modelo" subtitle="Selecciona dimensión, métrica y ventana histórica antes de recalcular la tendencia.">
                <form onSubmit={aplicar} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Select label="Periodicidad" value={filtros.periodicidad} onChange={(value) => setFiltros((actual) => ({ ...actual, periodicidad: value }))}>
                        <option value="mensual">Mensual</option>
                        <option value="semanal">Semanal</option>
                    </Select>
                    <Select label="Métrica" value={filtros.metrica} onChange={(value) => setFiltros((actual) => ({ ...actual, metrica: value }))}>
                        <option value="monto">Monto vendido</option>
                        <option value="cantidad">Unidades vendidas</option>
                    </Select>
                    <Select label="Categoría" value={filtros.cod_categoria_producto} onChange={(value) => setFiltros((actual) => ({ ...actual, cod_categoria_producto: value, cod_producto: '' }))}>
                        <option value="">Todas</option>
                        {(opciones.categorias ?? []).map((item) => <option key={item.cod_categoria_producto} value={item.cod_categoria_producto}>{item.nombre_cat}</option>)}
                    </Select>
                    <Select label="Producto" value={filtros.cod_producto} onChange={(value) => setFiltros((actual) => ({ ...actual, cod_producto: value }))}>
                        <option value="">Todos</option>
                        {productos.map((item) => <option key={item.cod_producto} value={item.cod_producto}>{item.nombre_pro}</option>)}
                    </Select>
                    <Select label="Canal" value={filtros.cod_canal_venta} onChange={(value) => setFiltros((actual) => ({ ...actual, cod_canal_venta: value }))}>
                        <option value="">Todos</option>
                        {(opciones.canales ?? []).map((item) => <option key={item.cod_canal_venta} value={item.cod_canal_venta}>{item.nombre_can}</option>)}
                    </Select>
                    <Input label="Desde" type="date" value={filtros.periodo_inicio} onChange={(value) => setFiltros((actual) => ({ ...actual, periodo_inicio: value }))} />
                    <Input label="Hasta" type="date" value={filtros.periodo_fin} onChange={(value) => setFiltros((actual) => ({ ...actual, periodo_fin: value }))} />
                    <div className="flex items-end">
                        <button type="submit" className="w-full rounded-xl bg-terracota-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-terracota-600">
                            Calcular tendencia
                        </button>
                    </div>
                </form>
            </SectionCard>

            {tendencia.suficientes_datos ? (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MetricCard title="Tendencia general" value={tendencia.direccion_tendencia} icon={TrendIcon} tone={tendencia.direccion_tendencia === 'Decreciente' ? 'red' : 'green'} />
                        <MetricCard title="Crecimiento estimado" value={formatSignedPercent(tendencia.porcentaje_crecimiento_estimado)} icon={Activity} tone="terracota" />
                        <MetricCard title="Siguiente periodo" value={formatValue(tendencia.prediccion_siguiente_periodo)} icon={PackageOpen} tone="oliva" />
                        <MetricCard title="Confianza del modelo" value={tendencia.nivel_confianza} subtitle={`R² = ${formatDecimal(tendencia.r_cuadrado, 3)}`} icon={BadgeCheck} tone="cyan" />
                    </div>

                    <SectionCard
                        title="Ventas reales y recta estimada"
                        subtitle={`Modelo: y = ${formatDecimal(tendencia.intercepto, 2)} + ${formatDecimal(tendencia.pendiente, 2)}x`}
                    >
                        <TrendChart data={tendencia.resultados ?? []} formatValue={formatValue} />
                    </SectionCard>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <SectionCard title="Lectura ejecutiva" className="xl:col-span-1">
                            <div className="rounded-2xl border border-terracota-100 bg-terracota-50 p-5">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracota-700">Recomendación</p>
                                <p className="mt-3 text-2xl font-bold text-terracota-900">{tendencia.recomendacion}</p>
                                <p className="mt-3 text-sm leading-6 text-terracota-800">
                                    La pendiente es {formatDecimal(tendencia.pendiente, 3)} y el coeficiente de ajuste R² es {formatDecimal(tendencia.r_cuadrado, 3)}.
                                </p>
                            </div>
                        </SectionCard>

                        <SectionCard title="Resultados por periodo" noPadding className="xl:col-span-2">
                            <TableWrapper className="rounded-none border-0 shadow-none">
                                <TableWrapper.Header>
                                    <TableWrapper.HeaderCell>Periodo</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell align="right">Valor real</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell align="right">Valor estimado</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell align="right">Diferencia</TableWrapper.HeaderCell>
                                </TableWrapper.Header>
                                <TableWrapper.Body>
                                    {(tendencia.resultados ?? []).map((item) => (
                                        <TableWrapper.Row key={item.periodo}>
                                            <TableWrapper.Cell className="font-semibold text-cafe-900">{item.etiqueta}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right">{formatValue(item.valor_real)}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right">{formatValue(item.valor_estimado)}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right" className={Number(item.valor_real) >= Number(item.valor_estimado) ? 'text-green-700' : 'text-red-700'}>
                                                {formatValue(Number(item.valor_real) - Number(item.valor_estimado))}
                                            </TableWrapper.Cell>
                                        </TableWrapper.Row>
                                    ))}
                                </TableWrapper.Body>
                            </TableWrapper>
                        </SectionCard>
                    </div>
                </>
            ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
                    <Calculator className="mx-auto h-9 w-9 text-amber-600" />
                    <h3 className="mt-3 text-lg font-bold text-amber-900">Regresión no disponible</h3>
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-amber-800">{tendencia.mensaje}</p>
                </div>
            )}

            <SectionCard title="Fundamento académico: regresión lineal simple">
                <div className="grid gap-5 text-sm leading-7 text-cafe-700 lg:grid-cols-2">
                    <p>
                        La recta <strong>y = a + bx</strong> estima el comportamiento de las ventas: <strong>x</strong> representa
                        el índice temporal, <strong>y</strong> el monto o cantidad, <strong>b</strong> la pendiente y
                        <strong> a</strong> el intercepto. El siguiente periodo se proyecta extendiendo esa recta.
                    </p>
                    <p>
                        El coeficiente R² expresa cuánto de la variación histórica explica la recta. Solo se consideran
                        pedidos confirmados y pagos aceptados; pedidos cancelados y pagos rechazados quedan fuera.
                        La proyección apoya decisiones, pero no constituye una predicción absoluta.
                    </p>
                </div>
            </SectionCard>
        </InteligenciaVentasLayout>
    );
}

function TrendChart({ data, formatValue }) {
    return (
        <ResponsiveContainer width="100%" height={360}>
            <LineChart data={data} margin={{ top: 16, right: 20, left: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7e4" vertical={false} />
                <XAxis dataKey="etiqueta" tick={{ fontSize: 11, fill: '#665b4f' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatValue} tick={{ fontSize: 11, fill: '#665b4f' }} axisLine={false} tickLine={false} width={72} />
                <Tooltip formatter={(value) => formatValue(value)} />
                <Legend />
                <Line type="monotone" dataKey="valor_real" name="Venta real" stroke="#7a8450" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="valor_estimado" name="Tendencia estimada" stroke="#d77a61" strokeWidth={3} strokeDasharray="7 5" dot={{ r: 3 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

function Select({ label, value, onChange, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-cafe-700">{label}</span>
            <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500">
                {children}
            </select>
        </label>
    );
}

function Input({ label, value, onChange, ...props }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-cafe-700">{label}</span>
            <input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500" />
        </label>
    );
}
