import TableWrapper from '@/Components/UI/TableWrapper';
import { formatBOB } from './VentaRedHelpers';

export default function VentaRedDetalleTable({ detalles = [], onRemove = null }) {
    if (detalles.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
                <p className="text-sm font-medium text-cafe-700">No hay productos agregados</p>
                <p className="mt-1 text-xs text-gray-500">Agrega productos del catalogo real para calcular la venta.</p>
            </div>
        );
    }

    return (
        <TableWrapper>
            <TableWrapper.Header>
                <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                <TableWrapper.HeaderCell>Variante</TableWrapper.HeaderCell>
                <TableWrapper.HeaderCell align="right">Cantidad</TableWrapper.HeaderCell>
                <TableWrapper.HeaderCell align="right">Precio</TableWrapper.HeaderCell>
                <TableWrapper.HeaderCell align="right">Subtotal</TableWrapper.HeaderCell>
                {onRemove && <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>}
            </TableWrapper.Header>
            <TableWrapper.Body>
                {detalles.map((detalle, index) => (
                    <TableWrapper.Row key={detalle.cod_venta_red_detalle ?? index}>
                        <TableWrapper.Cell>
                            <p className="font-medium text-cafe-900">{detalle.producto?.nombre_pro ?? detalle.nombre_producto ?? 'Producto'}</p>
                            <p className="text-xs text-gray-500">{detalle.producto?.sku_pro ?? detalle.sku_producto ?? '-'}</p>
                        </TableWrapper.Cell>
                        <TableWrapper.Cell>
                            <span className="text-sm text-cafe-700">
                                {detalle.variante?.talla?.nom_talla_producto ?? detalle.talla_nombre ?? '-'}
                            </span>
                        </TableWrapper.Cell>
                        <TableWrapper.Cell align="right">{detalle.cantidad}</TableWrapper.Cell>
                        <TableWrapper.Cell align="right">{formatBOB(detalle.precio_unitario)}</TableWrapper.Cell>
                        <TableWrapper.Cell align="right">
                            <span className="font-semibold text-cafe-900">{formatBOB(detalle.subtotal)}</span>
                        </TableWrapper.Cell>
                        {onRemove && (
                            <TableWrapper.Cell align="right">
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    Eliminar
                                </button>
                            </TableWrapper.Cell>
                        )}
                    </TableWrapper.Row>
                ))}
            </TableWrapper.Body>
        </TableWrapper>
    );
}
