import VerticalBarChart from '@/Components/Charts/VerticalBarChart';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { RiesgoBadge } from './Components/Badges';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import { demandaLabels, formatBOB, formatDecimal, formatNumber, formatPercent, labelOf } from './Components/formatters';

export default function Categorias({ categorias = [] }) {
    const chartData = categorias.map((item) => ({
        name: item.categoria?.nombre_cat ?? '-',
        value: Number(item.ventas_estimadas || 0),
    }));

    return (
        <InteligenciaVentasLayout
            title="Prediccion por Categorias"
            subtitle="Analisis probabilistico de demanda agrupado por familia comercial"
        >
            <SectionCard title="Categoria vs ventas estimadas">
                <VerticalBarChart data={chartData} dataKey="value" labelKey="name" height={320} formatValue={formatNumber} />
            </SectionCard>

            <SectionCard title="Detalle por categoria" noPadding>
                <TableWrapper className="rounded-none border-0 shadow-none">
                    <TableWrapper.Header>
                        <TableWrapper.HeaderCell>Categoria</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Ventas 30 dias</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Ventas 90 dias</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Proyeccion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Indice</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Prob. alta</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Stock total</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Riesgo</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Sugerido</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Ingreso</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Canal dominante</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Motivo</TableWrapper.HeaderCell>
                    </TableWrapper.Header>
                    <TableWrapper.Body>
                        {categorias.length > 0 ? categorias.map((item) => (
                            <TableWrapper.Row key={item.cod_categoria_producto ?? item.categoria?.nombre_cat}>
                                <TableWrapper.Cell className="font-semibold text-cafe-900">{item.categoria?.nombre_cat ?? '-'}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.ventas_ultimos_30_dias)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.ventas_ultimos_90_dias)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.ventas_estimadas)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatDecimal(item.indice_demanda, 2)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{labelOf(item.estado_proyectado, demandaLabels)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatPercent(Number(item.probabilidad_alta || 0) * 100)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.stock_total)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right"><RiesgoBadge value={Number(item.productos_riesgo || 0) > 0 ? 'alto' : 'sin_riesgo'} /></TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.cantidad_sugerida)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatBOB(item.ingreso_estimado)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{item.canal_dominante ?? '-'}</TableWrapper.Cell>
                                <TableWrapper.Cell className="max-w-xs whitespace-normal">{item.motivo ?? '-'}</TableWrapper.Cell>
                            </TableWrapper.Row>
                        )) : (
                            <TableWrapper.EmptyRow colSpan={13} message="No hay categorias proyectadas." />
                        )}
                    </TableWrapper.Body>
                </TableWrapper>
            </SectionCard>
        </InteligenciaVentasLayout>
    );
}
