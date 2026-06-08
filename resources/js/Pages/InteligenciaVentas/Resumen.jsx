import HorizontalBar from '@/Components/Charts/HorizontalBar';
import PieChart from '@/Components/Charts/PieChart';
import VerticalBarChart from '@/Components/Charts/VerticalBarChart';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { Link } from '@inertiajs/react';
import { Boxes, CalendarClock, ChartNoAxesColumnIncreasing, CircleDollarSign, Layers, PackageSearch, RadioTower, TriangleAlert } from 'lucide-react';
import { RecomendacionBadge, RiesgoBadge } from './Components/Badges';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import MetricCard from './Components/MetricCard';
import { canalNombre, categoriaNombre, formatBOB, formatDate, formatNumber, productoNombre } from './Components/formatters';

export default function Resumen({ resumen = {}, predicciones = [] }) {
    const items = predicciones?.data ?? predicciones ?? [];
    const categorias = aggregate(items, (item) => categoriaNombre(item), 'ventas_estimadas_proximo_periodo')
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    const canales = aggregate(items, (item) => canalNombre(item), 'ingreso_estimado')
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    const topAbastecimiento = [...items]
        .sort((a, b) => Number(b.cantidad_sugerida_abastecimiento || 0) - Number(a.cantidad_sugerida_abastecimiento || 0))
        .slice(0, 5);
    const topCategorias = categorias.filter((item) => item.name !== '-').length;
    const canalPrincipal = canales[0]?.name ?? '-';
    const ultimaProyeccion = items[0]?.created_at ?? items[0]?.periodo_fin;

    return (
        <InteligenciaVentasLayout
            title="Resumen de Inteligencia de Ventas"
            subtitle="Vista ejecutiva de demanda, cobertura y abastecimiento sugerido"
            showConfigAction
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard title="Productos analizados" value={formatNumber(resumen.total_predicciones ?? items.length)} icon={PackageSearch} tone="oliva" />
                <MetricCard title="Categorias con mayor proyeccion" value={formatNumber(topCategorias)} icon={Layers} tone="terracota" />
                <MetricCard title="Riesgo de quiebre de stock" value={formatNumber(resumen.riesgo_alto ?? 0)} icon={TriangleAlert} tone="red" />
                <MetricCard title="Unidades sugeridas" value={formatNumber(resumen.unidades_sugeridas ?? 0)} subtitle="para abastecimiento" icon={Boxes} tone="amber" />
                <MetricCard title="Ingreso estimado" value={formatBOB(resumen.ingreso_estimado ?? 0)} subtitle="proximo periodo" icon={CircleDollarSign} tone="green" />
                <MetricCard title="Canal con mayor movimiento" value={canalPrincipal} icon={RadioTower} tone="cyan" />
                <MetricCard title="Ultima proyeccion generada" value={formatDate(ultimaProyeccion)} icon={CalendarClock} tone="oliva" />
                <MetricCard title="Modelo activo" value="Analisis probabilistico" icon={ChartNoAxesColumnIncreasing} tone="terracota" />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <SectionCard title="Ventas estimadas por categoria" className="xl:col-span-2">
                    <VerticalBarChart data={categorias} dataKey="value" labelKey="name" height={300} formatValue={formatNumber} />
                </SectionCard>
                <SectionCard title="Participacion por canal">
                    <PieChart data={canales} dataKey="value" nameKey="name" height={260} innerRadius={58} formatValue={formatBOB} />
                </SectionCard>
            </div>

            <SectionCard title="Top 5 productos recomendados para abastecer">
                <HorizontalBar data={topAbastecimiento.map((item) => ({
                    name: productoNombre(item),
                    value: Number(item.cantidad_sugerida_abastecimiento || 0),
                }))} formatValue={(value) => `${formatNumber(value)} unidades`} />
            </SectionCard>

            <SectionCard title="Top recomendaciones" noPadding>
                <TableWrapper className="rounded-none border-0 shadow-none">
                    <TableWrapper.Header>
                        <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Categoria</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Stock actual</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Proyeccion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Cantidad sugerida</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Riesgo</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Recomendacion</TableWrapper.HeaderCell>
                    </TableWrapper.Header>
                    <TableWrapper.Body>
                        {topAbastecimiento.length > 0 ? topAbastecimiento.map((item) => (
                            <TableWrapper.Row key={item.cod_prediccion_venta}>
                                <TableWrapper.Cell className="font-semibold text-cafe-900">{productoNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{categoriaNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.stock_actual)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.ventas_estimadas_proximo_periodo)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right" className="font-bold text-terracota-700">{formatNumber(item.cantidad_sugerida_abastecimiento)}</TableWrapper.Cell>
                                <TableWrapper.Cell><RiesgoBadge value={item.nivel_riesgo_stock} /></TableWrapper.Cell>
                                <TableWrapper.Cell><RecomendacionBadge value={item.nivel_recomendacion} /></TableWrapper.Cell>
                            </TableWrapper.Row>
                        )) : (
                            <TableWrapper.EmptyRow colSpan={7} message="No hay proyecciones generadas todavia." />
                        )}
                    </TableWrapper.Body>
                </TableWrapper>
            </SectionCard>

            <div className="flex justify-end">
                <Link href={route('inteligencia-ventas.configuracion')} className="text-sm font-semibold text-terracota-700 hover:text-terracota-800">
                    Ir a configuracion
                </Link>
            </div>
        </InteligenciaVentasLayout>
    );
}

function aggregate(items, labelGetter, valueKey) {
    const map = new Map();
    items.forEach((item) => {
        const name = labelGetter(item) || '-';
        map.set(name, (map.get(name) || 0) + Number(item[valueKey] || 0));
    });

    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}
