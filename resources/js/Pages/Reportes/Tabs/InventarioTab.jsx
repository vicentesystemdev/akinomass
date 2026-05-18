import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';

export default function InventarioTab({ reportes }) {
    const stockBajo = reportes?.productos_stock_bajo || [];

    return (
        <div className="space-y-6">
            <SectionCard
                title="Productos con Stock Bajo"
                subtitle={`${stockBajo.length} productos por debajo del mínimo`}
                headerActions={
                    stockBajo.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-terracota-100 text-terracota-700 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
                            </svg>
                            {stockBajo.length} alertas
                        </span>
                    ) : null
                }
            >
                {stockBajo.length > 0 ? (
                    <TableWrapper>
                        <TableWrapper.Header>
                            <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="center">Stock Actual</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="center">Stock Mínimo</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell align="center">Déficit</TableWrapper.HeaderCell>
                            <TableWrapper.HeaderCell>Nivel de Riesgo</TableWrapper.HeaderCell>
                        </TableWrapper.Header>
                        <TableWrapper.Body>
                            {stockBajo.map((p, i) => {
                                const deficit = p.stock_minimo - p.stock_actual;
                                const riskLevel = deficit > 10 ? 'alto' : deficit > 5 ? 'medio' : 'bajo';
                                return (
                                    <TableWrapper.Row key={i} className="bg-terracota-50/30">
                                        <TableWrapper.Cell>
                                            <p className="font-medium text-cafe-900">{p.nombre_producto}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <span className="text-lg font-bold text-terracota-600">{p.stock_actual}</span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <span className="text-sm text-gray-500">{p.stock_minimo}</span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <span className="text-sm font-medium text-red-600">-{deficit}</span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                                                riskLevel === 'alto' ? 'bg-red-100 text-red-700' :
                                                riskLevel === 'medio' ? 'bg-amber-100 text-amber-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {riskLevel === 'alto' ? 'Crítico' : riskLevel === 'medio' ? 'Medio' : 'Bajo'}
                                            </span>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                );
                            })}
                        </TableWrapper.Body>
                    </TableWrapper>
                ) : (
                    <EmptyState
                        title="Sin alertas de stock"
                        description="Todos los productos tienen stock suficiente."
                        icon={
                            <svg className="w-12 h-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                )}
            </SectionCard>
        </div>
    );
}
