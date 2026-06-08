import HorizontalBar from '@/Components/Charts/HorizontalBar';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { RecomendacionBadge, RiesgoBadge } from './Components/Badges';
import CoverageBar from './Components/CoverageBar';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import { categoriaNombre, formatBOB, formatDecimal, formatNumber, productoNombre, varianteNombre } from './Components/formatters';

export default function Abastecimiento({ predicciones = [] }) {
    const items = predicciones?.data ?? predicciones ?? [];
    const chartData = items.slice(0, 10).map((item) => ({
        name: productoNombre(item),
        value: Number(item.cantidad_sugerida_abastecimiento || 0),
    }));

    return (
        <InteligenciaVentasLayout
            title="Recomendacion de Abastecimiento"
            subtitle="Priorizacion de compra basada en proyeccion de ventas, cobertura y riesgo de quiebre"
        >
            <SectionCard title="Cantidad sugerida por producto">
                <HorizontalBar data={chartData} formatValue={(value) => `${formatNumber(value)} unidades`} />
            </SectionCard>

            <SectionCard title="Plan de abastecimiento" noPadding>
                <TableWrapper className="rounded-none border-0 shadow-none">
                    <TableWrapper.Header>
                        <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Categoria</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Variante/talla</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Stock actual</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Proyeccion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Stock seguridad</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Cantidad sugerida</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Cobertura</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Rotacion</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Ingreso</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Riesgo</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Nivel</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell>Motivo</TableWrapper.HeaderCell>
                    </TableWrapper.Header>
                    <TableWrapper.Body>
                        {items.length > 0 ? items.map((item) => (
                            <TableWrapper.Row key={item.cod_prediccion_venta}>
                                <TableWrapper.Cell className="font-semibold text-cafe-900">{productoNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{categoriaNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell>{varianteNombre(item)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.stock_actual)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.ventas_estimadas_proximo_periodo)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatNumber(item.stock_seguridad_dinamico)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right" className="font-bold text-terracota-700">{formatNumber(item.cantidad_sugerida_abastecimiento)}</TableWrapper.Cell>
                                <TableWrapper.Cell><CoverageBar value={item.ratio_cobertura} /></TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatDecimal(item.rotacion_stock, 2)}</TableWrapper.Cell>
                                <TableWrapper.Cell align="right">{formatBOB(item.ingreso_estimado)}</TableWrapper.Cell>
                                <TableWrapper.Cell><RiesgoBadge value={item.nivel_riesgo_stock} /></TableWrapper.Cell>
                                <TableWrapper.Cell><RecomendacionBadge value={item.nivel_recomendacion} /></TableWrapper.Cell>
                                <TableWrapper.Cell className="max-w-sm whitespace-normal">{item.motivo ?? '-'}</TableWrapper.Cell>
                            </TableWrapper.Row>
                        )) : (
                            <TableWrapper.EmptyRow colSpan={13} message="No hay recomendaciones de abastecimiento pendientes." />
                        )}
                    </TableWrapper.Body>
                </TableWrapper>
            </SectionCard>
        </InteligenciaVentasLayout>
    );
}
