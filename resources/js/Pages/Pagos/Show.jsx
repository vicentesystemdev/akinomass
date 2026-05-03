import { Link, router } from '@inertiajs/react';

export default function Show({ pago }) {
  return <div className="p-6 space-y-3"><h1 className="text-xl">Pago #{pago.cod_pago}</h1>
    <p>Pedido: {pago.cod_pedido}</p><p>Estado: {pago.estado_pago_pag}</p><p>Monto: {pago.monto_pag}</p>
    <div className="space-x-2">
      <Link className="underline" href={route('pagos.edit', pago.cod_pago)}>Editar</Link>
      <button onClick={()=>router.post(route('pagos.confirmar', pago.cod_pago))}>Confirmar</button>
      <button onClick={()=>router.post(route('pagos.observar', pago.cod_pago))}>Observar</button>
      <button onClick={()=>router.post(route('pagos.rechazar', pago.cod_pago))}>Rechazar</button>
    </div>
  </div>;
}
