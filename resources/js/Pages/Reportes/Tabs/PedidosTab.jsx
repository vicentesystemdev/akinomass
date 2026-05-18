import SectionCard from '@/Components/UI/SectionCard';
import PieChartComponent from '@/Components/Charts/PieChart';
import TableWrapper from '@/Components/UI/TableWrapper';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function PedidosTab({ reportes }) {
    const pedidosPorEstado = reportes?.pedidos_por_estado || [];
    const pieData = pedidosPorEstado.map((p) => ({
        name: p.estado.charAt(0).toUpperCase() + p.estado.slice(1),
        value: p.total,
    }));
    const totalPedidos = pedidosPorEstado.reduce((acc, p) => acc + p.total, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Distribución de Pedidos" subtitle={`${totalPedidos} pedidos en total`}>
                    <PieChartComponent
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        height={300}
                        innerRadius={60}
                    />
                </SectionCard>

                <SectionCard title="Detalle por Estado">
                    <TableWrapper>
                        <TableWrapper.Header>
                            <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="center">Cantidad</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="right">% del Total</TableWrapper.HeaderCell>
                        </TableWrapper.Header>
                        <TableWrapper.Body>
                            {pedidosPorEstado.map((p, i) => (
                                <TableWrapper.Row key={i}>
                                    <TableWrapper.Cell>
                                        <StatusBadge status={p.estado} />
                                    </TableWrapper.Cell>
                                    <TableWrapper.Cell align="center">
                                        <span className="font-bold text-cafe-900">{p.total}</span>
                                    </TableWrapper.Cell>
                                    <TableWrapper.Cell align="right">
                                        <span className="text-sm text-gray-500">
                                            {totalPedidos > 0 ? ((p.total / totalPedidos) * 100).toFixed(1) : 0}%
                                        </span>
                                    </TableWrapper.Cell>
                                </TableWrapper.Row>
                            ))}
                        </TableWrapper.Body>
                    </TableWrapper>
                </SectionCard>
            </div>
        </div>
    );
}
