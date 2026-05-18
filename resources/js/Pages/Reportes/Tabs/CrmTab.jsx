import SectionCard from '@/Components/UI/SectionCard';
import PieChartComponent from '@/Components/Charts/PieChart';
import HorizontalBar from '@/Components/Charts/HorizontalBar';
import TableWrapper from '@/Components/UI/TableWrapper';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function CrmTab({ reportes }) {
    const leadsPorEstado = reportes?.leads_por_estado || [];
    const leadsPorCanal = (reportes?.leads_por_canal || []).map((l) => ({ name: l.canal, value: l.total }));
    const clientesPorEstado = reportes?.clientes_por_estado || [];

    const pieLeads = leadsPorEstado.map((l) => ({
        name: l.estado.charAt(0).toUpperCase() + l.estado.slice(1),
        value: l.total,
    }));
    const pieClientes = clientesPorEstado.map((c) => ({
        name: c.estado.charAt(0).toUpperCase() + c.estado.slice(1),
        value: c.total,
    }));

    const totalLeads = leadsPorEstado.reduce((acc, l) => acc + l.total, 0);
    const totalClientes = clientesPorEstado.reduce((acc, c) => acc + c.total, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Leads por Estado" subtitle={`${totalLeads} leads en total`}>
                    <PieChartComponent data={pieLeads} height={300} innerRadius={60} />
                </SectionCard>

                <SectionCard title="Clientes por Estado" subtitle={`${totalClientes} clientes en total`}>
                    <PieChartComponent data={pieClientes} height={300} innerRadius={60} />
                </SectionCard>
            </div>

            <SectionCard title="Leads por Canal de Origen" subtitle="Distribución de leads por canal">
                <HorizontalBar data={leadsPorCanal} labelKey="name" valueKey="value" />
            </SectionCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Detalle Leads por Estado">
                    <TableWrapper>
                        <TableWrapper.Header>
                            <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="center">Cantidad</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="right">%</TableWrapper.HeaderCell>
                        </TableWrapper.Header>
                        <TableWrapper.Body>
                            {leadsPorEstado.map((l, i) => (
                                <TableWrapper.Row key={i}>
                                    <TableWrapper.Cell><StatusBadge status={l.estado} /></TableWrapper.Cell>
                                    <TableWrapper.Cell align="center"><span className="font-bold text-cafe-900">{l.total}</span></TableWrapper.Cell>
                                    <TableWrapper.Cell align="right"><span className="text-sm text-gray-500">{totalLeads > 0 ? ((l.total / totalLeads) * 100).toFixed(1) : 0}%</span></TableWrapper.Cell>
                                </TableWrapper.Row>
                            ))}
                        </TableWrapper.Body>
                    </TableWrapper>
                </SectionCard>

                <SectionCard title="Detalle Clientes por Estado">
                    <TableWrapper>
                        <TableWrapper.Header>
                            <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="center">Cantidad</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="right">%</TableWrapper.HeaderCell>
                        </TableWrapper.Header>
                        <TableWrapper.Body>
                            {clientesPorEstado.map((c, i) => (
                                <TableWrapper.Row key={i}>
                                    <TableWrapper.Cell><StatusBadge status={c.estado} /></TableWrapper.Cell>
                                    <TableWrapper.Cell align="center"><span className="font-bold text-cafe-900">{c.total}</span></TableWrapper.Cell>
                                    <TableWrapper.Cell align="right"><span className="text-sm text-gray-500">{totalClientes > 0 ? ((c.total / totalClientes) * 100).toFixed(1) : 0}%</span></TableWrapper.Cell>
                                </TableWrapper.Row>
                            ))}
                        </TableWrapper.Body>
                    </TableWrapper>
                </SectionCard>
            </div>
        </div>
    );
}
