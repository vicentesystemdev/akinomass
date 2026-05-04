import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Movimientos({ movimientos }) {
  return (
    <AuthenticatedLayout header="Movimientos de Inventario">
      <Head title="Movimientos" />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Movimientos de inventario</h1>
        <table className="w-full border">
          <thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Stock</th><th>Usuario</th></tr></thead>
          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov.cod_movimiento_inventario}>
                <td>{mov.created_at}</td><td>{mov.producto?.nombre_pro}</td><td>{mov.tipo_movimiento_mov}</td><td>{mov.cantidad_mov}</td><td>{mov.stock_anterior_mov} → {mov.stock_nuevo_mov}</td><td>{mov.usuario_responsable?.name ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}

