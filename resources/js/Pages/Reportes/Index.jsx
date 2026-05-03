import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ reportes }) {
  const { auth } = usePage().props;
  const [filters, setFilters] = useState({
    fecha_inicio: reportes?.filtros?.fecha_inicio || '',
    fecha_fin: reportes?.filtros?.fecha_fin || '',
    estado_pedido: reportes?.filtros?.estado_pedido || '',
    estado_pago: reportes?.filtros?.estado_pago || '',
    estado_lead: reportes?.filtros?.estado_lead || '',
    cod_canal_venta: reportes?.filtros?.cod_canal_venta || '',
    cod_tipo_flujo_comercial: reportes?.filtros?.cod_tipo_flujo_comercial || '',
  });

  const submit = (e) => {
    e.preventDefault();
    router.get(route('reportes.index'), filters, { preserveState: true });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Reportes" />
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Reportes comerciales</h1>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded">
          {Object.entries(filters).map(([key, value]) => (
            key === 'cod_canal_venta' || key === 'cod_tipo_flujo_comercial' ? null :
              <input key={key} type={key.includes('fecha') ? 'date' : 'text'} value={value}
                placeholder={key}
                onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
                className="border rounded px-2 py-1" />
          ))}

          <select value={filters.cod_canal_venta} onChange={(e) => setFilters((p) => ({ ...p, cod_canal_venta: e.target.value }))} className="border rounded px-2 py-1">
            <option value="">Canal de venta</option>
            {(reportes?.opciones_filtros?.canales_venta || []).map((canal) => (
              <option key={canal.cod_canal_venta} value={canal.cod_canal_venta}>{canal.nombre_can}</option>
            ))}
          </select>

          <select value={filters.cod_tipo_flujo_comercial} onChange={(e) => setFilters((p) => ({ ...p, cod_tipo_flujo_comercial: e.target.value }))} className="border rounded px-2 py-1">
            <option value="">Tipo de flujo comercial</option>
            {(reportes?.opciones_filtros?.tipos_flujo_comercial || []).map((flujo) => (
              <option key={flujo.cod_tipo_flujo_comercial} value={flujo.cod_tipo_flujo_comercial}>{flujo.nombre_tip}</option>
            ))}
          </select>

          <button className="bg-black text-white rounded px-3 py-1">Filtrar</button>
        </form>

        {[
          ['Ventas por fecha', reportes?.ventas_por_fecha],
          ['Pedidos por estado', reportes?.pedidos_por_estado],
          ['Pagos por estado', reportes?.pagos_por_estado],
          ['Leads por estado', reportes?.leads_por_estado],
          ['Ventas por canal', reportes?.ventas_por_canal],
          ['Ventas por tipo de flujo', reportes?.ventas_por_tipo_flujo],
          ['Productos con stock bajo', reportes?.productos_stock_bajo],
          ['Productos más vendidos', reportes?.productos_mas_vendidos],
        ].map(([title, rows]) => (
          <section key={title} className="border rounded p-4">
            <h2 className="font-medium mb-2">{title}</h2>
            <pre className="text-sm overflow-auto">{JSON.stringify(rows || [], null, 2)}</pre>
          </section>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
