import { Link } from '@inertiajs/react';

export default function Index({ pagos }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Pagos</h1>
      <Link href={route('pagos.create')} className="underline">Registrar pago</Link>
      <table className="w-full mt-4 border">
        <thead><tr><th>ID</th><th>Pedido</th><th>Estado</th><th>Monto</th><th></th></tr></thead>
        <tbody>
          {pagos.map((p) => (
            <tr key={p.cod_pago}>
              <td>{p.cod_pago}</td><td>{p.cod_pedido}</td><td>{p.estado_pago_pag}</td><td>{p.monto_pag}</td>
              <td><Link className="underline" href={route('pagos.show', p.cod_pago)}>Ver</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
