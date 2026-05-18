import SectionCard from '@/Components/UI/SectionCard';
import PieChartComponent from '@/Components/Charts/PieChart';
import VerticalBarChart from '@/Components/Charts/VerticalBarChart';
import TableWrapper from '@/Components/UI/TableWrapper';
import StatusBadge from '@/Components/UI/StatusBadge';

const formatBOB = (value) => {
    if (value === null || value === undefined) return 'Bs 0.00';
    const num = parseFloat(value);
    if (isNaN(num)) return 'Bs 0.00';
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const metodoLabels = { qr: 'QR', transferencia: 'Transferencia', efectivo: 'Efectivo', deposito: 'Depósito', otro: 'Otro' };

export default function PagosTab({ reportes }) {
    const pagosPorEstado = reportes?.pagos_por_estado || [];
    const pagosPorMetodo = (reportes?.pagos_por_metodo || []).map((p) => ({
        name: metodoLabels[p.metodo] || p.metodo,
        monto: p.monto_total,
        total: p.total,
    }));
    const pieData = pagosPorEstado.map((p) => ({
        name: p.estado.charAt(0).toUpperCase() + p.estado.slice(1),
        value: p.total,
    }));
    const totalPagos = pagosPorEstado.reduce((acc, p) => acc + p.total, 0);
    const montoTotal = pagosPorEstado.reduce((acc, p) => acc + (p.monto_total || 0), 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Pagos por Estado" subtitle={`${totalPagos} pagos • ${formatBOB(montoTotal)} total`}>
                    <PieChartComponent data={pieData} height={300} innerRadius={60} />
                </SectionCard>

                <SectionCard title="Pagos por Método de Pago" subtitle="Monto recaudado por método">
                    <VerticalBarChart
                        data={pagosPorMetodo}
                        dataKey="monto"
                        labelKey="name"
                        height={300}
                        formatValue={(v) => `Bs ${v}`}
                        color="#3C473A"
                    />
                </SectionCard>
            </div>

            <SectionCard title="Detalle de Pagos por Estado">
                <TableWrapper>
                    <TableWrapper.Header>
                        <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="center">Cantidad</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">Monto Total</TableWrapper.HeaderCell>
                        <TableWrapper.HeaderCell align="right">% del Total</TableWrapper.HeaderCell>
                    </TableWrapper.Header>
                    <TableWrapper.Body>
                        {pagosPorEstado.map((p, i) => (
                            <TableWrapper.Row key={i}>
                                <TableWrapper.Cell>
                                    <StatusBadge status={p.estado} />
                                </TableWrapper.Cell>
                                <TableWrapper.Cell align="center">
                                    <span className="font-bold text-cafe-900">{p.total}</span>
                                </TableWrapper.Cell>
                                <TableWrapper.Cell align="right">
                                    <span className="font-medium text-terracota-600">{formatBOB(p.monto_total)}</span>
                                </TableWrapper.Cell>
                                <TableWrapper.Cell align="right">
                                    <span className="text-sm text-gray-500">
                                        {totalPagos > 0 ? ((p.total / totalPagos) * 100).toFixed(1) : 0}%
                                    </span>
                                </TableWrapper.Cell>
                            </TableWrapper.Row>
                        ))}
                    </TableWrapper.Body>
                </TableWrapper>
            </SectionCard>
        </div>
    );
}
