import SectionCard from '@/Components/UI/SectionCard';
import HorizontalBar from '@/Components/Charts/HorizontalBar';
import VerticalBarChart from '@/Components/Charts/VerticalBarChart';
import TableWrapper from '@/Components/UI/TableWrapper';

const formatBOB = (value) => {
    if (value === null || value === undefined) return 'Bs 0.00';
    const num = parseFloat(value);
    if (isNaN(num)) return 'Bs 0.00';
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function VentasTab({ reportes }) {
    const ventasPorCanal = (reportes?.ventas_por_canal || []).map((v) => ({
        name: v.canal,
        value: v.monto_pagado,
        pedidos: v.total_pedidos,
    }));
    const ventasPorFlujo = (reportes?.ventas_por_tipo_flujo || []).map((v) => ({
        name: v.flujo,
        value: v.monto_pagado,
        pedidos: v.total_pedidos,
    }));
    const productosMasVendidos = (reportes?.productos_mas_vendidos || []).map((p) => ({
        name: p.nombre_producto.length > 20 ? p.nombre_producto.substring(0, 20) + '...' : p.nombre_producto,
        cantidad: p.cantidad_vendida,
        monto: p.monto_vendido,
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Ventas por Canal" subtitle="Monto pagado por canal de venta">
                    <HorizontalBar
                        data={ventasPorCanal}
                        labelKey="name"
                        valueKey="value"
                        formatValue={formatBOB}
                    />
                </SectionCard>

                <SectionCard title="Ventas por Tipo de Flujo" subtitle="Monto pagado por tipo de flujo comercial">
                    <HorizontalBar
                        data={ventasPorFlujo}
                        labelKey="name"
                        valueKey="value"
                        formatValue={formatBOB}
                    />
                </SectionCard>
            </div>

            <SectionCard title="Productos Más Vendidos" subtitle="Top 10 por cantidad vendida">
                {productosMasVendidos.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <VerticalBarChart
                            data={productosMasVendidos}
                            dataKey="cantidad"
                            labelKey="name"
                            height={300}
                            color="#D77A61"
                        />
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Cantidad</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Monto</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {(reportes?.productos_mas_vendidos || []).map((p, i) => (
                                    <TableWrapper.Row key={i}>
                                        <TableWrapper.Cell>
                                            <p className="font-medium text-cafe-900">{p.nombre_producto}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <span className="font-bold text-terracota-600">{p.cantidad_vendida}</span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <span className="text-cafe-700">{formatBOB(p.monto_vendido)}</span>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        No hay datos de productos vendidos
                    </div>
                )}
            </SectionCard>
        </div>
    );
}
