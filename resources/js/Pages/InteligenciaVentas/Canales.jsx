import PieChart from '@/Components/Charts/PieChart';
import VerticalBarChart from '@/Components/Charts/VerticalBarChart';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import { formatBOB, formatNumber, formatPercent, formatSignedPercent } from './Components/formatters';

export default function Canales({ canales = [] }) {
    const barData = canales.map((item) => ({
        name: item.canal_venta?.nombre_can ?? '-',
        value: Number(item.ventas_estimadas || 0),
    }));
    const pieData = canales.map((item) => ({
        name: item.canal_venta?.nombre_can ?? '-',
        value: Number(item.ingreso_estimado || 0),
    }));

    return (
        <InteligenciaVentasLayout
            title="Analisis por Canales"
            subtitle="Participacion comercial por origen de venta y comportamiento relativo por canal"
        >
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <SectionCard title="Barras por canal">
                    <VerticalBarChart data={barData} dataKey="value" labelKey="name" height={320} formatValue={formatNumber} />
                </SectionCard>
                <SectionCard title="Participacion por canal">
                    <PieChart data={pieData} dataKey="value" nameKey="name" height={280} innerRadius={64} formatValue={formatBOB} />
                </SectionCard>
            </div>

            <SectionCard title="Detalle de canales" noPadding>
                <TableWrapper className="rounded-none border-0 shadow-none">
                    <TableWrapper.Header>
                        <TableWrapper.HeaderCell>Canal</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Ventas generadas</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Unidades vendidas</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Ingreso generado</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Categoria mas vendida</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Producto mas vendido</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Participacion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Tendencia</TableWrapper.HeaderCell>
                    </TableWrapper.Header>
                    <TableWrapper.Body>
                        {canales.length > 0 ? canales.map((item) => (
                            <TableWrapper.Row key={item.cod_canal_venta}>
                                <TableWrapper.Cell className="font-semibold text-cafe-900">{item.canal_venta?.nombre_can ?? '-'}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.ventas_estimadas)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.unidades_vendidas)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatBOB(item.ingreso_estimado)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{item.categoria_mas_vendida?.nombre_cat ?? '-'}</TableWrapper.Cell>
                                <TableWrapper.Cell>{item.producto_mas_vendido?.nombre_pro ?? '-'}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatPercent(item.participacion_promedio)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right" className={Number(item.tendencia_porcentual || 0) >= 0 ? 'text-green-700' : 'text-red-700'}>{formatSignedPercent(item.tendencia_porcentual)}</TableWrapper.Cell>
                            </TableWrapper.Row>
                        )) : (
                            <TableWrapper.EmptyRow colSpan={8} message="No hay canales con proyecciones." />
                        )}
                    </TableWrapper.Body>
                </TableWrapper>
            </SectionCard>
        </InteligenciaVentasLayout>
    );
}
